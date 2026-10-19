---
date: 2026-10-20
summary: On an RTX 5090, llama.cpp decoded at half speed with a 4-bit KV cache. The cause was how CUDA 12.8 compiles one byte read for Blackwell GPUs, and a ten-line change doubles decode speed at 32k context.
---

# Half-speed attention on RTX 50 GPUs, caused by one pointer cast and CUDA 12.8

When you run a language model, the KV cache holds the conversation's context so far. llama.cpp can store it in a 4-bit format called q4_0. That saves memory, and it's meant to be at least as fast as the 8-bit format because there's half as much to read.

On an RTX 5090, with llama.cpp built using CUDA 12.8 (the toolkit its default Docker images use), it wasn't. At 32k tokens of context it generated 65 tokens per second instead of 134.

The cause sat in the compiler. CUDA 12.8 turned a three-line byte read into a slow round trip through memory, and only for Blackwell GPUs. Rewriting those lines doubles generation speed at 32k context. The fix is open as [llama.cpp #30077](https://github.com/ggml-org/llama.cpp/pull/30077). As of 20 October 2026 the maintainers haven't decided between it and a newer CUDA version for the Docker image. Here's how I found it, and what the review changed.

![Decode speed against context on an RTX 5090 with CUDA 12.8. The q4_0 cache on master falls from 216 to 65 tokens per second. With the fix it falls from 235 to 134, next to q8_0.](media/blackwell-decode.svg)

## The setup

- Model: Qwen3-8B, quantized to Q4_K_M, with the KV cache in q4_0 or q8_0 (8-bit).
- Engine: llama.cpp master `51ce9c11a`, `llama-bench -fa 1 -p 0 -n 128` at 0 to 32,768 tokens of context, 3 interleaved rounds.
- GPU: one RTX 5090 on RunPod, builds from CUDA 12.8.1 (nvcc 12.8.93) and CUDA 13.0.
- Kernel timing: `test-backend-ops perf` on the attention operation alone, in Qwen3-8B's shape (head size 128, 8 K/V heads, 4 query heads each).

## Step 1: a number that shouldn't exist

I was benchmarking a different change across several GPUs when one row on the RTX 5090 stood out.

| Decode on master, RTX 5090, CUDA 12.8 (tok/s) | q8_0 cache | q4_0 cache |
|---|---|---|
| empty context | 232.2 | 213.9 |
| 16k tokens | 169.5 | 99.6 |
| 32k tokens | 131.6 | 64.5 |

Source: `results/cloud/pr1-all-5090/REPORT.md`.

A q4_0 cache is about half the size of a q8_0 cache, so reading it should take less time. The attention operation alone took 89.9 µs per call for q4_0 at 16k rows, against 41.7 µs for q8_0. On an RTX 3090 and 4090 in the same run, the two formats were level (`results/cloud/pr1-all-3090/`, `results/cloud/pr1-all-4090/`).

## Step 2: not llama.cpp's fault

A day earlier, on another RTX 5090 with master `65840ed53`, q4_0 had decoded at 176.2 tok/s at 16k, right next to q8_0 (`results/cloud/pr1-5090/REPORT.md`). The only CUDA commit between those masters changed which stream a buffer memset runs on. That can't halve the speed of one cache format. The toolkit could, and the earlier run used CUDA 13.0 where the new one used 12.8.1.

## Step 3: compile the same kernel with three toolkits

The attention kernel for each cache format lives in its own file, here `fattn-vec-instance-q4_0-q4_0.cu`. I compiled it with the build's own flags plus `-Xptxas -v`, which prints each kernel's registers and stack, for three nvcc versions and several targets.

| nvcc | sm_86 (RTX 30) | sm_89 (RTX 40) | sm_90a (H100) | sm_120a (RTX 50), q4_0 | sm_120a, q8_0 |
|---|---|---|---|---|---|
| 12.8.93 | 0 B | 0 B | 0 B | **128 B** | 0 B |
| 12.9.86 | | | | 0 B | 0 B |
| 13.0.88 | 0 B | 0 B | | 0 B | 0 B |

Stack frame of the single-token kernel at head size 128. Source: `results/kernels/q4_0-sm120-nvcc/REPORT.md`.

Exactly one combination has a stack frame, nvcc 12.8 compiling q4_0 for Blackwell. On a GPU, a stack frame means local memory, which is per-thread but lives in the same slow DRAM as everything else. A value that should sit in a register gets written out and read back, over and over.

## Step 4: which half of the compiler?

nvcc's front end turns C++ into PTX, a kind of intermediate assembly, and then `ptxas` turns PTX into machine code. To see which stage was to blame, I assembled the 12.8 PTX with the 13.0 `ptxas`. The 128 B stayed, so the problem is already in what the 12.8 front end emits. And the PTX showed it plainly. A 16-bit value is stored to the stack and read back as two bytes, 64 times in the kernel:

```
st.u16      [%SP+0], %rs163;
ld.v2.u8    {%rs165, %rs166}, [%SP+0];
```

## Step 5: the line that triggers it

That pattern matches `dequantize_V_q4_0` in `ggml/src/ggml-cuda/fattn-common.cuh`. It unpacks the 4-bit values, subtracts 8 from each byte with `__vsub4`, and reads the bytes back through a pointer:

```cpp
q = __vsub4(q, 0x08080808);
const int8_t * q8 = (const int8_t *) &q;
...
((half2 *) dst)[l0/2] = d * make_half2(q8[l0 + 0], q8[l0 + 1]);
```

Taking the address of `q` is an invitation for the compiler to put it in memory. Every other nvcc version and target optimizes that away. nvcc 12.8 for Blackwell doesn't. To be sure, I tried two edits on the real kernel. Going back to `__vsubss4`, which the code used before a recent change, kept the 128 B. Reading the bytes with shifts dropped it to 0 B (`results/kernels/q4_0-sm120-nvcc/REPORT.md`). So the recent change was innocent, and the pointer read is the trigger.

It isn't new either. The same file from a commit of October 2025 gives the same 128 B frame, so it's been in master for at least a year. The q5_0 code has the same pattern and the same frame. I couldn't reproduce it in a 20-line kernel with the same pattern, so the trigger needs the surrounding kernel.

## Step 6: the fix

Read the bytes with shifts, so nothing takes the address of `q` and it stays in a register:

```cpp
((half2 *) dst)[l0/2] = d * make_half2((int8_t) (q >> (8*l0)), (int8_t) (q >> (8*l0 + 8)));
```

The same change goes into `dequantize_V_q5_0`, ten lines in total. On a little-endian GPU, `(int8_t) (q >> (8*l))` is the same signed byte as `q8[l]`. llama.cpp's attention tests pass, 1728 of 1728 on the RTX 5090.

## Step 7: proving it on the GPU

A smaller stack frame is a strong hint, not proof. So I built master twice on the same RTX 5090 with CUDA 12.8.1, once with the fix, and ran both in alternating rounds.

![The attention operation alone on an RTX 5090 with CUDA 12.8. With the fix, q4_0 drops from 88.1 to 41.2 µs per call at 16k rows. At 32k it drops from 164.8 to 77.1 µs. q8_0 takes 41.7 µs at 16k and 79.6 µs at 32k on both builds.](media/blackwell-attention-op.svg)

| Decode, Qwen3-8B (tok/s) | master | fix | speedup |
|---|---|---|---|
| q4_0, empty context | 215.63 | 235.00 | 1.09 |
| q4_0, 4k context | 164.41 | 212.66 | 1.29 |
| q4_0, 16k context | 100.54 | 171.85 | 1.71 |
| q4_0, 32k context | 65.07 | 134.39 | 2.07 |
| q8_0, 16k context | 169.06 | 168.94 | 1.00 |
| q8_0, 32k context | 131.24 | 131.09 | 1.00 |

Sources: `results/cloud/vfix-5090-cu128/REPORT.md` (attention op, medians of 3 rounds) and its `table.md` (decode, made with llama.cpp's `scripts/compare-llama-bench.py`, means of 3 rounds).

With the fix, q4_0 is level with q8_0. It also matches master built with CUDA 13.0, which ran q4_0 at 175.7 tok/s at 16k (`results/cloud/pr1-all-5090-cu13/REPORT.md`). Two independent routes landing on the same speed is what convinced me. Against an f16 cache, q4_0 at 16k went from 57% of its speed to 97% (177.5 tok/s for f16, `results/cloud/vfix-5090-cu128/REPORT.md`).

## Step 8: why only Blackwell?

This one bugged me, so I went back to it. With nvcc 12.8, every target up to sm_90a (Hopper) compiles to 0 B. Every Blackwell target, sm_100, sm_101 and sm_120, with or without the "a", gets the 128 B.

The reason is inside cicc, the part of nvcc that turns C++ into PTX. Its optimizer reports a different version per target, in 12.8, 12.9 and 13.0 alike:

| target | cicc's optimizer reports |
|---|---|
| compute_90 and older | NVIDIA NVVM 7.0.1 |
| compute_100 and compute_120 | NVIDIA NVVM 20.0.0 |

Given `-print-pipeline-passes`, the new one prints a 104-pass pipeline from LLVM's new pass manager. The old one rejects the flag. So Blackwell kernels go through a separate, much newer LLVM-based compiler. I'd be careful with the number, though. NVIDIA's [CUDA 12.8 release notes](https://docs.nvidia.com/cuda/archive/12.8.0/cuda-toolkit-release-notes/index.html) describe Blackwell's IR as "an updated NVVM IR dialect, based on LLVM 18.1.8 IR". As I read it, both hold. The dialect is the input format, and 20.0.0 is what the optimizer reports about itself. Which LLVM release it was built from isn't public.

For the stack itself, I compared the two toolkits' PTX for the same lines:

| nvcc 12.8 | nvcc 12.9 |
|---|---|
| `st.u16 [%SP+0], %rs163;` | `cvt.s16.s8 %rs165, %rs163;` |
| `ld.v2.u8 {%rs165, %rs166}, [%SP+0];` | `shr.s16 %rs166, %rs163, 8;` |

12.8 goes through memory to get two bytes out of a 16-bit value, and 12.9 uses a sign-extend and a shift. Right after instruction selection, 12.8 has 64 stack slots of 2 bytes, exactly the 128 B, and 12.9 has none. So the memory is a temporary that instruction selection adds to turn a 16-bit integer into two bytes. The NVPTX backend has no direct support for that two-byte type, so it goes through the stack.

Upstream LLVM had hit this too. The fix, [llvm/llvm-project #113928](https://github.com/llvm/llvm-project/pull/113928) "[NVPTX] Don't use stack memory when bitcasting to/from v2i8", was merged on 1 November 2024. Its description names "the default legalization rules which perform the bitcast in stack memory". Open-source LLVM reproduces both sides exactly. LLVM 19.1.7 emits the 12.8 code, stack and all, and LLVM 20.1.8 emits the 12.9 code.

My best explanation is that 12.8's new optimizer was built from LLVM code that predates this fix, and 12.9's includes it. That part is inferred, since NVIDIA's sources aren't public, but it fits every measurement (`results/kernels/blackwell-why/REPORT.md`, with commands to reproduce).

## Step 9: the review

JohannesGaessler tested the PR on an RTX 3090, 4090 and 5090 with nvcc 13.3. No speedup anywhere, as expected without 12.8. But q5_0 on the 3090 got slower, 0.86 to 0.91x of master's speed at 32k context.

I didn't see that coming. On sm_86 the shifts change 10 of the 29 kernels in the q5_0 file, and as many in the q4_0 file. The changed kernels even have 0.4 to 2.2% fewer instructions. I haven't measured which difference costs the time.

What I could do was stop applying the workaround where the bug isn't. The shifts now sit behind `#if !defined(GGML_USE_HIP) && !defined(GGML_USE_MUSA) && __CUDA_ARCH__ >= 1000` in a small helper. Only Blackwell gets them, and everything else keeps the pointer read. The HIP and MUSA checks are there because ggml's `vendors/hip.h` and `vendors/musa.h` define `__CUDA_ARCH__` as 1300. Without them, AMD and Moore Threads builds would take the shifts too.

I compared the machine code (SASS) kernel by kernel with nvcc 12.8 and 13.4. On sm_86, sm_89 and sm_90 every q4_0 and q5_0 kernel is identical to master. On sm_120a every one is identical to the version I measured, so the step 7 numbers hold. The guard is commits `6c5ee177d` and `85569bf77` (`results/kernels/vdq-guard/REPORT.md`).

## Fix the code, or fix the toolkit?

Johannes then asked a fair question. Why carry a workaround when the Docker image could move to CUDA 12.9? CISC pointed to [#21438](https://github.com/ggml-org/llama.cpp/pull/21438), which moved the image down from 12.9.1 to 12.8.1 in April 2026. Hosts with driver 570, which supports CUDA up to 12.8, couldn't start the 12.9 image ([#21429](https://github.com/ggml-org/llama.cpp/issues/21429)). Some rented hosts, on Vast for example, run that driver. The Ubuntu CUDA 12.8 release builds ([#28186](https://github.com/ggml-org/llama.cpp/pull/28186)) have the same Blackwell problem.

One middle route is to compile with 12.9 and ship on the 12.8.1 runtime image, which driver 570 can start. As is, that fails. The image builds machine code only for sm_86, sm_89 and sm_120a, and every other GPU gets PTX that the driver compiles at load time. A driver older than the toolkit can't compile 12.9's newer PTX (version 8.8 against 8.7). So on a 570 host, A100, H100 and B200 would fail. I checked this by compiling, not on a GPU (`results/docker-split/REPORT.md`).

Both options have a real case. A newer toolkit fixes the bug where it lives, with no special case in the source, but it drops the hosts #21438 was made for. The workaround keeps those hosts running. The cost is an architecture check for one compiler version, which stays until nobody builds with 12.8. As of 20 October 2026 that's undecided.

## Who is affected

You're affected if you have a Blackwell GPU and a llama.cpp build made with CUDA 12.8. You also need a q4_0 or q5_0 V cache (`-ctv q4_0` or `-ctv q5_0`) during single-token generation. Blackwell means any GeForce RTX 50 or RTX PRO Blackwell card. I only measured the RTX 5090, but they all run the same sm_120a code.

As of 20 October 2026, the default `cuda` and `cuda12` Docker images (CUDA 12.8.1) compile sm_120a natively. So does the Ubuntu CUDA 12.8 release, built in the 12.8.2 image. NVIDIA's package index shows that image uses the same nvcc 12.8.93 that I tested.

On a B200 or GB200 only source builds with CUDA 12.8 are hit. The official 12.8 builds run those from compute_90 PTX, which is clean. The Windows releases (CUDA 12.4 and 13.4), CUDA 13 builds, older GPUs, and q8_0 or f16 caches aren't affected.

## What I'd take away from this

When a smaller data format runs slower than a bigger one, suspect the code generation first. `-Xptxas -v` per toolkit and target is a cheap check, and here it found the problem in minutes. And when a bug hits one GPU generation, check whether that generation goes through a different compiler.

Before the review I'd have said shifts beat taking the address of a local value. The RTX 3090 disagreed. A workaround for one compiler's bug can cost something on another target. So scope it to where the bug is, and diff the generated code on every target you didn't mean to change.
