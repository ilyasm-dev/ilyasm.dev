import { IBM_Plex_Mono, Source_Sans_3, Source_Serif_4 } from "next/font/google";

// Self-hosted at build time. Next adds a size-matched fallback for each, so the swap does not move the layout.
// Serif for headings and figures, sans for text, mono for labels and the trace.
export const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
export const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
export const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono", display: "swap" });

export const fontVars = `${serif.variable} ${sans.variable} ${mono.variable}`;
