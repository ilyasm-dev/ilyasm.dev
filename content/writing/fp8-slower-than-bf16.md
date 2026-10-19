---
date: 2026-10-20
summary: Under load, FP8 Qwen3-8B served slower than BF16 on an H100 NVL with vLLM. The cause was one line of kernel selection, and fixing it gave 17 to 52% more output tokens per second on the CUTLASS FP8 path.
---

# FP8 was slower than BF16 on an H100. The cause was a divisibility check.

FP8 weights are supposed to make inference faster. They halve the bytes the GPU reads for every token, and decoding
is limited by exactly that. So when I served Qwen3-8B on an H100 NVL with vLLM, I expected the FP8 checkpoint to win.

Under load it lost. With 64 concurrent long-prompt requests, BF16 produced 831 tokens per second and FP8 produced
606. The cause turned out to be one line of kernel selection in vLLM. I wrote a fix and opened a pull request. It made
FP8 serving 16 to 59% faster in my first test, and 17 to 52% faster in a second test a day later. This is how I found
it.

## Who this affects

Not everyone. vLLM normally uses a library called DeepGEMM for FP8 on Hopper GPUs, and DeepGEMM avoids this code
path entirely. vLLM's official Docker image is built on CUDA 13.0.3 by default and carries the compiler DeepGEMM needs.

You hit the problem when DeepGEMM is not used, either because someone sets `VLLM_USE_DEEP_GEMM=0` or because it can't
run. DeepGEMM compiles at startup and needs nvcc 12.9 or newer. On a CUDA 12.8 image, vLLM 0.30.0 crashes at startup
with FP8 weights. `VLLM_USE_DEEP_GEMM=0` gets past the crash and lands on the slow path described here.

## The setup

- Model: Qwen3-8B, in BF16 and as the official Qwen3-8B-FP8 checkpoint (128x128 block-scaled weights).
- Engine: vLLM 0.30.0 for steps 1 to 3 and the first end-to-end test, vLLM main at commit `84bcbc6` for the patch
  test. Default settings with a maximum length of 8,192 tokens, except `VLLM_USE_DEEP_GEMM=0` (the CUTLASS path) and,
  in the patch comparisons, the torch.compile cache off. CUDA graphs and torch.compile on.
- GPU: one H100 NVL, 94 GB, 3.9 TB/s memory bandwidth, rented on RunPod.
- Traffic: chat (512 tokens in, 256 out) and long prompts (3,000 in, 128 out), measured with `vllm bench serve`.

## Step 1: single requests are fine

With one request at a time, FP8 behaves as expected. It takes 5.1 ms per output token against 6.8 ms for BF16. The
loss only appears once requests are batched. That points at something that changes with batch size.

## Step 2: compare against what the hardware can do

Decoding one token means reading every weight once. At small batch sizes that is almost the only cost. So the time
per decode step should barely change between batch 1 and batch 8. Eight times the work, same bytes.

I profiled single decode steps with the torch profiler, about 760 steps per run, and summed the time spent in the
matrix multiplications.

| Matrix multiplies per decode step (the four projections in each layer, not the final vocabulary projection) | Batch 1 | Batch 8 | Batch 64 |
|---|---|---|---|
| BF16 (cuBLAS) | 4.87 ms | 4.93 ms | 5.98 ms |
| FP8 (CUTLASS) | 2.97 ms | 4.90 ms | 5.18 ms |

BF16 behaves like a memory-bound workload should. Batch 8 costs the same as batch 1. FP8 does not. Batch 8 costs 65%
more than batch 1 for the same bytes. At batch 8, FP8 is no faster than BF16 while reading half as much.

At batch 64 the FP8 layers read about 7.2 GB per step in 5.18 ms. That is 1.39 TB/s, about 36% of the GPU's 3.9 TB/s
specification. In the FP8 traces the vocabulary projection reaches 84 to 91% of it, so the gap is not a hardware
limit.

## Step 3: two different kernels

The trace showed the reason quickly. At batch 1 and batch 8, the FP8 layers ran different CUTLASS kernels. Their
template arguments differ: `128, 1, 128` at batch 1 and `1, 128, 128` at batch 8.

The choice is made in `csrc/quantization/w8a8/cutlass/c3x/scaled_mm_blockwise_sm90_fp8_dispatch.cuh`. The folder was
`csrc/libtorch_stable/quantization/` until vLLM moved it on 12 October. The line did not change:

```cpp
bool swap_ab = (a.size(0) % 4) != 0;
```

`a.size(0)` is M, the number of tokens in the batch. The dispatch has two configurations:

- **Swapped (swap_ab):** a 128x16 tile with the operands exchanged. Built for small batches.
- **Default:** a 128x128 tile. Built for large batches.

So the kernel depends on whether the batch size is divisible by 4. A batch of 7 gets the small-batch kernel. A batch
of 8 gets the large one. At batch 8, each 128-row tile does 8 rows of real work. For a 4,096-wide layer, the default
kernel also launches only 32 thread blocks, on a GPU with 132 SMs.

## Step 4: why the rule exists

The rule is not about speed. As far as I can tell from the code and a related issue (#40016), it is about alignment.
The default kernel loads the activation scales with TMA, which needs 16-byte alignment. With one float per row, M
must be a multiple of 4. The swapped kernel has no such constraint, so it became the escape hatch for odd sizes. PR
#44572 added that route in June, replacing a copy that padded odd batches, and took the idea from the Blackwell
dispatches.

That creates a second problem in the other direction. Large batches that are not divisible by 4 also get the small
kernel. With chunked prefill, the number of tokens per step is close to arbitrary. If those counts are spread evenly,
three in four steps miss the alignment. I did not count how often that happens in serving.

## Step 5: proving it without a rebuild

Both kernels are already compiled into the stock wheel. The divisibility rule decides which one runs. So timing M
against its neighbours compares the two kernels at almost the same size. No rebuild needed.

I timed vLLM's own `cutlass_scaled_mm` op on the four layer shapes of Qwen3-8B. Summed over one transformer layer:

| Tokens (M) | Kernel picked today | Time per layer | Neighbour on the other kernel | Time per layer |
|---|---|---|---|---|
| 8 | default | 123 us | 9 (swapped) | 78 us |
| 16 | default | 120 us | 17 (swapped) | 79 us |
| 32 | default | 124 us | 33 (swapped) | 97 us |
| 64 | default | 125 us | 63 (swapped) | 108 us |

And the large-batch direction, for the single slowest layer (the fused gate and up projection):

| Tokens (M) | Kernel | Time |
|---|---|---|
| 4,096 | default | 1.1 ms |
| 4,097 | swapped | 10.3 ms |
| 8,192 | default | 3.7 ms |
| 8,193 | swapped | 23.5 ms |

One extra token makes that layer 6 to 9 times slower. The red lines below show both directions. The blue lines are
the fix, measured later.

![Matrix multiply time per layer against batch size for two Qwen3-8B layers on an H100 NVL. Stock vLLM is slower than the patch at small batch sizes divisible by 4, and far slower at large ones that are not.](media/fp8-gemm-per-m.svg)

## Step 6: end to end

To measure the effect on real serving without rebuilding vLLM, I wrapped the op. Small aligned batches get one zero
row, so they reach the swapped kernel. Large misaligned batches get padded to a multiple of 4. The extra output rows
are dropped.

Two details mattered. The wrapper is an opaque custom op, so torch.compile cannot freeze the branch to the batch
size it traced. And it loads in every vLLM process through `sitecustomize`, including the engine process.

All runs below are from one H100 NVL on 4 October.

| | Long prompts, 64 concurrent | Long prompts, 16 concurrent | Chat, 16 concurrent | Decode step, batch 8 |
|---|---|---|---|---|
| BF16 | 831 tok/s | 578 tok/s | 1,785 tok/s | n/a |
| FP8 as shipped | 606 tok/s | 609 tok/s | 1,486 tok/s | 6.79 ms |
| FP8, routing corrected | 980 tok/s | 689 tok/s | 2,051 tok/s | 6.00 ms |

With the routing corrected, FP8 beats BF16 by 18% on long prompts under load. The p95 time to first token drops
from 2.09 s to 1.19 s. FP8 as shipped already beat BF16 at 64 concurrent chat requests (5,121 against 4,652 tok/s),
so it does not lose everywhere. GSM8K accuracy stayed within noise: 192 of 200 correct on stock FP8 and 188 with the
routing corrected.

The workaround understates the real fix. It adds small copy kernels to every matrix multiply. It also turns 64 rows
into 65, which is worse than either kernel at 64. That is why chat at 64 concurrent requests got slower in my runs
(5,121 to 4,709 tok/s). The real fix has neither cost.

## Why nobody noticed

On Hopper, DeepGEMM normally handles these layers, so I expect few setups to reach this code. I have no count. When I
searched vLLM's pull requests on 20 October, I found none that changes how the Hopper dispatch picks its kernel. FP8
being "a bit slower under load" is easy to accept and move on from.

The same rule existed on Blackwell. PR #52775 fixed it for the RTX PRO 6000 class of GPUs and measured 18% more
serving throughput. Its author named the Hopper file as not yet checked. The data center Blackwell version has
since moved to the same rule.

## The fix

The Blackwell code already shows the way. I ported it to the Hopper dispatch:

- Use the swapped kernel for every batch up to 64 rows: `swap_ab = m <= 64`.
- For larger batches not divisible by 4, pad only the activation scales to a multiple of 4. They are 1/64 the size
  of the activations. Build the scale layout from the padded size. The activations themselves stay as they are.

The [kernel patch](https://github.com/vllm-project/vllm/pull/60464) comes with two new test shapes for vLLM's FP8
kernel tests. A [second patch](https://github.com/vllm-project/vllm/pull/60438) makes vLLM check DeepGEMM's compiler
version and fall back with a warning instead of crashing. The two belong together: the second sends more people down
this path, and the first makes that path fast.

Both pull requests are open, with no review from a person, as of 20 October 2026. The line is still on vLLM main and
in the v0.32.0 release code. I read the dispatch file on both and did not run v0.32.0.

The patch is not perfect. The 24,576-wide gate and up layer is faster on the default kernel at 49 to 64 rows. It takes
48.5 µs there against 53.2 µs for the swapped one at 64 rows, and the patch swaps anyway. I estimate that costs about 2% at batch 64. I have
not tested a per-shape threshold.

## The real patch on an H100

I built the patched kernel library and ran it against stock vLLM from the same commit, on one H100 NVL on 4 October.
Both builds pass all 25 block-FP8 kernel tests, including the two new shapes. A check before every run confirmed which
library each side had loaded.

| | Long prompts, 64 concurrent | Long prompts, 16 concurrent | Chat, 16 concurrent | Chat, 64 concurrent | Decode step, batch 8 |
|---|---|---|---|---|---|
| FP8 as shipped | 588 tok/s | 512 tok/s | 1,409 tok/s | 4,675 tok/s | 6.96 ms |
| FP8, patched | 933 tok/s | 680 tok/s | 2,229 tok/s | 5,444 tok/s | 5.06 ms |

![Serving throughput with stock FP8 and with the patch on an H100 NVL. Chat at 16 concurrent requests goes from 1,409 to 2,229 tokens per second and at 64 from 4,675 to 5,444. Long prompts at 16 concurrent go from 512 to 680 and at 64 from 588 to 933.](media/fp8-serving.svg)

This run used vLLM's main branch, so the numbers differ slightly from the table above. The real fix matches the
workaround on long prompts and removes its cost at 64 rows. Chat at 64 concurrent requests now gains 16% instead
of losing 8%. Across all four layer shapes and 33 batch sizes, matrix multiply time drops from 60.8 ms to 19.9 ms.
GSM8K accuracy stayed within noise: 192 of 200 correct on stock FP8 and 190 with the patch.

I repeated the comparison the next day on a different pod, with DeepGEMM as a third arm. The patch gave 17 to 52%
over stock, which is the table in the pull request. DeepGEMM was still 4 to 18% faster than the patched CUTLASS path in
serving. So the patch matters when DeepGEMM is off or can't run.

## Two mistakes worth sharing

My first end-to-end test showed no difference at all. The patched run had loaded the unpatched run's compiled graph
from vLLM's compile cache, so my code never ran. A log line printed once per padded batch size exposed it. Disable
the compile cache when you A/B a patch.

My first attempt at the DeepGEMM comparison failed too. I pointed `CUDA_HOME` at a minimal compiler, and FlashInfer
then tried to build its sampler with it. My cheap validation run had the sampler disabled, so it missed this.
Validate with the exact configuration you will pay for.

## What I measured and what I didn't

Each serving number is one run of 64 requests (16 concurrent) or 256 requests (64 concurrent) with random-token
prompts. I have no spread for them. Decode step times come from three runs that agreed within 0.15 ms. The two
sessions of the patch agree within 7 percentage points on every workload.

| Gain over stock FP8 | Routing workaround, 4 Oct | Patch, 4 Oct | Patch, 5 Oct |
|---|---|---|---|
| Long prompts, 64 concurrent | +62% | +59% | +52% |
| Long prompts, 16 concurrent | +13% | +33% | +26% |
| Chat, 16 concurrent | +38% | +58% | +51% |
| Chat, 64 concurrent | -8% | +16% | +17% |

Absolute numbers moved more than the gains between pods. The same BF16 setup produced 787 tok/s on long prompts at 16
concurrent in my first audit session and 578 in the comparison session. Stock FP8 decoded a batch of 8 in 6.96 ms in
one patch session and 9.30 ms in the next. That is why every comparison here stays inside one session.

I did not run BF16 on the patch test's vLLM version, so I don't claim the patched FP8 beats BF16 there. The 18% over
BF16 is the workaround on vLLM 0.30.0. I tested one model on one GPU type, and I did not profile the patched build
kernel by kernel.

## Takeaways

- Measure against the hardware ceiling, not against the previous run. "FP8 is a bit slower" sounds plausible.
  "Batch 8 costs 65% more than batch 1 for the same bytes" does not.
- Run the same workload at batch 1, 8 and 64. Memory-bound work should barely change across that range.
- If you serve FP8 models on Hopper, check which kernel your startup log names for `Fp8LinearMethod`. On vLLM 0.30.0
  `DeepGemmFp8BlockScaledMMKernel` is the fast path. `CutlassFp8BlockScaledMMKernel` is the one described here.
- On vLLM's main branch, `VLLM_USE_DEEP_GEMM=1` routes through a FlashInfer kernel. In my run on a CUDA 13.0 image it
  failed during CUDA graph capture, because a kernel it compiles was never written to its cache. I haven't found the
  cause. Adding `--linear-backend deep_gemm` kept vLLM off that kernel, and DeepGEMM ran.
