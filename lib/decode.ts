// RTX 5090, CUDA 12.8.1, Qwen3-8B Q4_K_M, q4_0 cache, llama-bench -n 128, mean of 3 rounds (audit repo results/cloud/vfix-5090-cu128/table.md)
export const DEPTHS = ["0", "4k", "16k", "32k"];
export const TOKENS = [0, 4096, 16384, 32768];
export const DECODE = { master: [215.63, 164.41, 100.54, 65.07], fix: [235.0, 212.66, 171.85, 134.39] };
