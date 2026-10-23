import prsData from "@/data/prs.json";
import type { Lang } from "@/lib/i18n";

type Pr = { repo: string; number: number; state: "open" | "merged" };
const PRS = prsData as Pr[];

// Pull requests of one state in one repo from data/prs.json, which every build rewrites from GitHub. A PR in `except` is not counted.
export function prCount(repo: string, state: Pr["state"], except: number[] = []): number {
  return PRS.filter((p) => p.repo === repo && p.state === state && !except.includes(p.number)).length;
}

const WORDS: Record<Lang, string[]> = {
  en: ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"],
  nl: ["geen", "één", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien"],
};

// A count as the plain word for small numbers and as digits above.
export function countWord(n: number, lang: Lang): string {
  return WORDS[lang][n] ?? String(n);
}

export const upperFirst = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
