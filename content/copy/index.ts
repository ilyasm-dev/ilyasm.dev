import type { Lang } from "@/lib/i18n";
import { en } from "./en";
import { nl } from "./nl";
import type { Copy } from "./types";

export const COPY: Record<Lang, Copy> = { en, nl };
export type { Copy, ReplyCopy, ShowcaseCopy } from "./types";
