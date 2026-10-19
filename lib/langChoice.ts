import type { Lang } from "@/lib/i18n";

const KEY = "lang";

// Kept in memory as well, so a choice still holds for this visit when the browser blocks storage.
let inMemory: Lang | null = null;

// The language the visitor picked with the switch or the language offer, if any.
export function readChoice(): Lang | null {
  if (inMemory) return inMemory;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "nl") return saved;
  } catch {}
  return null;
}

// Saved only on a click, never on a plain visit.
export function saveChoice(lang: Lang) {
  inMemory = lang;
  try {
    localStorage.setItem(KEY, lang);
  } catch {}
}

// True when the browser's language list has `lang` before `other`, or has `lang` and not `other`.
export function browserPrefers(lang: Lang, other: Lang): boolean {
  const list = navigator.languages?.length ? navigator.languages : [navigator.language];
  const primary = list.map((tag) => tag.toLowerCase().split("-")[0]);
  const want = primary.indexOf(lang);
  const rival = primary.indexOf(other);
  return want >= 0 && (rival < 0 || want < rival);
}
