# Inference audit of Qwen3-8B on vLLM, one H100 NVL

Sample report in the format a client receives. It is not a client engagement and uses no client data. The deployment is my own test setup on a rented GPU, measured from 2026-10-03 to 2026-10-05. Upstream status was checked on 2026-10-11.

## Summary

**Bottom line.** Document-question traffic can run on 3 GPUs instead of 5, which is 40% less hardware. The cost per answer falls 46%. It takes one setting change, and answer quality did not change in my test. Chat traffic needed no change.

**What was slow.** The target was that 95% of requests start answering within 1 second. Chat meets it easily, and one GPU handles 128 chat requests at once. Document questions are the problem. They send long prompts (about 3,000 tokens) and get short answers. With default settings, one GPU handles only 4 of them at once within the target. Past that, requests queue, and at 128 at once the slowest 5% wait 16.3 seconds. The likely cause is that the GPU's working memory (the KV cache, which holds each request's context) fills up.

**What it costs.** The same traffic needs 5 GPUs by default and 3 after fix 1. Each GPU handles 4 times as many document requests within the target, and the cost per answer drops to 54% of the default. The 2,000 tokens per second of traffic is my assumption for the example. Your numbers decide the real saving.

**Cost basis.** Hardware cost uses RunPod secure cloud H100 NVL at $3.19/hr, priced 2026-10-03. That is the rate the measurement used. One GPU running all month is about $2,330, so 5 GPUs are about $11,600 per month and 3 GPUs about $7,000. Per million output tokens, document questions cost $1.78 by default and $0.96 after fix 1. Each is at its own 1-second operating point (4 concurrent against 16 concurrent). At a fixed 128 concurrent they cost $1.38 and $0.76.

### Ranked fixes

| # | Fix | Expected gain | Effort | Confidence and risk |
|---|---|---|---|---|
| 1 | Store the conversation memory in 8-bit (FP8 KV cache) | Document questions: 4x more requests per GPU within target, 46% lower cost per answer | One setting, plus a quality check on your own test set | Measured. Quality unchanged on a math test. Check it on your data |
| 2 | Put the shared part of each prompt first | Up to 3.7x throughput when prompts share a start (2,000 shared tokens, 64 at once) | A prompt change in your application | Measured. The gain depends on how much your prompts share |
| 3 | Keep the default model weights (BF16) for now | Avoids losing 27% of document throughput at 64 concurrent and 17% of chat throughput at 16 concurrent | None today. A newer image or the upstream fix lets you revisit the FP8 weights | Measured. On a newer image, DeepGEMM reached 1,074 tok/s for long prompts at 64 concurrent (vLLM main) |
| 4 | Choose the prefill chunk size for your product | Chat first-answer wait (p95) drops from 1.51 s to 1.00 s, or streaming stays smooth | One setting | Measured. It is a trade-off, not a free gain |

**What I would do first.** Fix 1 this week, after a check on your own test set. Then fix 2 with your developers. For fix 3, the cause is found and the fix is submitted upstream to vLLM (#60464).


## Setup and method

- Model: Qwen3-8B in BF16, and the official Qwen3-8B-FP8 checkpoint. vLLM 0.30.0 with default settings as the baseline. Torch compile and CUDA graphs on.
- GPU: one H100 NVL (94 GB, 3.9 TB/s memory bandwidth), RunPod image with a CUDA 12.8 toolkit.
- Traffic: chat (512 tokens in, 256 out) and document questions (3,000 in, 128 out). Each ran at 1, 4, 16, 64 and 128 concurrent requests with `vllm bench serve`.
- Target: p95 time to first token (TTFT) at or under 1 s. p95 means 95% of requests were at least this fast. The operating point is the highest concurrency that meets the target.
- Throughput is in output tokens per second (tok/s).
- Quality: GSM8K, 500 math questions, greedy decoding, per variant. With 500 questions the result is accurate to about plus or minus 2 points.
- Cost per million output tokens uses the measured throughput at the operating point and the rate in the cost basis above.

## Findings

### 1. FP8 KV cache raises long-prompt capacity

**Cause.** The KV cache holds the context of every running request. It sets how many long requests fit on the GPU at once. An 8-bit cache holds twice the tokens.

**Gain (measured).** At the 1 s target:

| Variant | KV cache capacity | Document questions | Chat |
|---|---|---|---|
| Default (BF16 cache) | 468,000 tokens | 4 concurrent, 498 tok/s, $1.78 per M | 128 concurrent, 5,008 tok/s, $0.18 per M |
| `--kv-cache-dtype fp8` | 933,000 tokens | 16 concurrent, 927 tok/s, $0.96 per M | 128 concurrent, 5,572 tok/s, $0.16 per M |

- Document questions: 4x the concurrency, 1.9x the throughput, 46% lower cost per answer.
- At 128 concurrent document requests the default setup is overloaded. There p95 TTFT falls from 16.3 s to 1.8 s, and cost per million tokens from $1.38 to $0.76 (45%).
- GSM8K: 474 of 500 for both, plus or minus about 2 points. About 20 answers differ, and the right and wrong changes cancel out.

**Confidence.** High for the throughput numbers (measured). Medium for quality outside math questions, so test on your own data. The mechanism is inferred: 128 long requests need about 400,000 tokens of cache, close to the BF16 limit, so requests queue. I did not confirm this from scheduler statistics.

### 2. Prefix caching works, if prompts are ordered for it

**Cause.** vLLM reuses the cached start of a prompt when many requests share it. It is on by default. A single changed token early in the prompt ends the reuse.

**Gain (measured).** Test: 2,000 shared tokens, 64 concurrent requests. Throughput is 3,196 tok/s with prefix caching and 872 without (3.7x). p95 TTFT is 0.77 s with it and 6.3 s without.

**What to do.** Keep it on, and put fixed content first. System prompts, tool definitions and shared documents go before anything per user.

**Confidence.** High for this workload (measured). The size of the gain in your application depends on how much of each prompt is shared (inferred).

### 3. FP8 weights are slower under load on this setup

FP8 weights halve the bytes read per token, which should make every request faster. Single requests are: 5.1 ms per token against 6.8 ms. Under load the result reverses.

| Same GPU, same day | Document questions, 64 concurrent | Chat, 16 concurrent |
|---|---|---|
| BF16 weights | 831 tok/s | 1,785 tok/s |
| FP8 weights, as shipped | 606 tok/s | 1,486 tok/s |
| FP8 weights, kernel choice corrected (workaround) | 980 tok/s | 2,051 tok/s |

**Loss (measured).** In the 2026-10-04 session, FP8 weights as shipped lose 27% of document throughput at 64 concurrent against BF16. They lose 17% of chat throughput at 16 concurrent.

**Cause (measured).** vLLM picks between two FP8 matrix kernels on Hopper by whether the batch size is divisible by 4. Small batches get a kernel sized for large ones. Large batches that are not divisible by 4 get the small one. The worst layer runs 9x slower at 4,097 rows than at 4,096 (10.3 ms against 1.1 ms).

**Why it is hidden.** vLLM normally uses a faster library, DeepGEMM, on Hopper. DeepGEMM needs CUDA toolkit 12.9 or newer. On a CUDA 12.8 image, vLLM 0.30.0 crashes at startup with FP8 weights. Disabling DeepGEMM avoids the crash and lands on this slow path.

**Fix today.** Use an image with CUDA toolkit 12.9 or newer, such as vLLM's official Docker image. On vLLM main (not 0.30.0) on the H100, DeepGEMM reached 1,074 tok/s for long prompts at 64 concurrent. Stock reached 634 and the upstream fix below 965. The workaround row above pads batch sizes to steer the kernel choice. It helps documents and chat at 16 but costs chat at 64 concurrent (5,121 to 4,709 tok/s).

**Fix upstream.** The fix is submitted upstream to vLLM (#60464). I wrote, built and tested it on an H100, and vLLM's own tests pass. Against stock vLLM on the same commit, long prompts at 64 requests at once go from 634 to 965 tok/s (+52%, or +59% in a second session). Chat at 16 requests at once goes from 1,202 to 1,816 (+51%, or +58%). Quality is unchanged: GSM8K 192 of 200 for stock and 190 for patched, which is within noise.

**Confidence.** High for the cause, the kernel numbers and the patched end-to-end numbers (all measured).

### 4. Prefill chunk size is a trade-off

**Cause.** Long prompts are processed in chunks while chat requests keep generating. The chunk size decides who waits.

**Gain and cost (measured).** Chat measured while 3,000-token prompts keep arriving, 64 concurrent requests:

| Chunk size (tokens per step) | Chat p95 TTFT | p95 gap between tokens |
|---|---|---|
| 2,048 | 1.00 s | 70 ms |
| 8,192 (default here) | 1.51 s | 19 ms |
| 16,384 | 1.57 s | 18 ms |

Smaller chunks start chat answers sooner and make streaming less smooth. A chat-first app favors 2,048. A streaming-first app keeps the default.

**Confidence.** Measured on one run per setting. The direction is clear. The exact values will move with your traffic mix (inferred).

### 5. Operational risks found on the way

| Issue | Cause | Impact | Fix | Confidence |
|---|---|---|---|---|
| FP8 weights crash at startup on a CUDA 12.8 toolkit (`NVCC version must be at least 12.9`) | vLLM 0.30.0 selects DeepGEMM without checking the toolkit version | The service does not start | Use a newer toolkit. Setting `VLLM_USE_DEEP_GEMM=0` also starts it but lands on the slow path in finding 3. The fix is submitted upstream to vLLM (#60438) | Measured on the H100 pod |
| Sampler crash at startup on RTX 50 series cards with the same toolkit | The FlashInfer sampler fails to build on these cards (compute capability 12.x) with a CUDA 12.8 toolkit | The service does not start | Fixed in vLLM's main branch, not yet released. Workaround: `VLLM_USE_FLASHINFER_SAMPLER=0` | Measured on an RTX 5090 |
| Triton backend for FP8 weights (`--linear-backend triton`) is slower than the default | Not investigated | No gain, a loss everywhere | Do not use it as a workaround for finding 3 | Measured on the H100 pod |

## Beyond configuration

Profiling against the hardware limit also found kernel-level losses. They need code changes in vLLM, not settings, and are listed for completeness.

- Single-request decode with BF16 reaches about 59% of the GPU's memory bandwidth. With FP8 it reaches about 43%. This is the largest gap found (measured).
- With FP8 weights, the norm fusion copies an extra tensor in every layer, costing 1 to 1.3% per step. The fix is submitted upstream to vLLM (#60481). On the H100 the copy is gone and end-to-end speed is within noise.
- The fused norm and quantization kernel is 2.0 to 2.5x slower than vLLM's own experimental Helion version (measured).

## Limits of this audit

Measured on a single H100 NVL.

## Reproduce

Full measurement logs and scripts are delivered with the report. Every number above comes from those files.
