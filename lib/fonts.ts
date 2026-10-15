import { IBM_Plex_Mono } from "next/font/google";

// Self-hosted at build time. Used for labels, figures and the trace, not for body text.
export const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono", display: "swap" });
