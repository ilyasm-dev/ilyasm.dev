"use client";

import { useEffect, useState } from "react";
import type { ReplyCopy } from "@/content/copy/types";
import { fill, type Lang } from "@/lib/i18n";

const TZ = "Europe/Amsterdam";
const START = 9;
const END = 21;

// Offset of a time zone from UTC in minutes at the given moment, read from Intl.
function offsetMinutes(timeZone: string | undefined, at: Date): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" })
    .formatToParts(at)
    .find((p) => p.type === "timeZoneName")?.value;
  const m = name?.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}

function gmtLabel(minutes: number): string {
  if (minutes === 0) return "GMT";
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const mm = abs % 60;
  return `GMT${sign}${h}${mm ? `.${String(mm).padStart(2, "0")}` : ""}`;
}

// Amsterdam wall clock hour as a time in the visitor's zone, "3 am" in English and "3.00" in Dutch.
function localTime(hour: number, amsOffset: number, at: Date, lang: Lang): string {
  const utc = new Date(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate(), hour, 0) - amsOffset * 60000);
  if (lang === "nl") {
    return new Intl.DateTimeFormat("nl-NL", { hour: "numeric", minute: "2-digit" }).format(utc).replace(":", ".").replace(/^0(\d)/, "$1");
  }
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })
    .format(utc)
    .replace(":00", "")
    .replace(/^12\sAM$/, "midnight")
    .replace(/^12\sPM$/, "noon")
    .replace(/\s?AM$/, " am")
    .replace(/\s?PM$/, " pm");
}

function describe(at: Date, lang: Lang, copy: ReplyCopy) {
  const ams = offsetMinutes(TZ, at);
  const mine = offsetMinutes(undefined, at);
  const yours = mine === ams ? "" : fill(copy.yours, { start: localTime(START, ams, at, lang), end: localTime(END, ams, at, lang) });
  return { zone: gmtLabel(ams), yours };
}

export default function ReplyHours({ lang, copy }: { lang: Lang; copy: ReplyCopy }) {
  const [info, setInfo] = useState({ zone: copy.zoneFallback, yours: "" });

  useEffect(() => {
    setInfo(describe(new Date(), lang, copy));
  }, [lang, copy]);

  return <>{fill(copy.text, info)}</>;
}
