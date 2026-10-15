// Tokens are approximated as word pieces, an optional leading space plus up to 4 characters each.
export const tokenize = (text: string) => text.match(/ ?[^ ]{1,4}/g) ?? [];

// Measured llama.cpp decode speeds at 32k context, RTX 5090, q4_0 KV cache, CUDA 12.8 (PR #30077).
export const BEFORE_TPS = 65.1;
export const AFTER_TPS = 134.4;

// The race is timed on the English answer's token count in every language, so the shown seconds never change.
export const raceMs = (tokens: number, tps: number) => (tokens / tps) * 1000;
