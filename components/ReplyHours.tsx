"use client";

import { useEffect, useState } from "react";

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

// Amsterdam wall clock hour as a time in the visitor's zone, e.g. "3 am".
function localTime(hour: number, amsOffset: number, at: Date): string {
  const utc = Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate(), hour, 0) - amsOffset * 60000;
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })
    .format(new Date(utc))
    .replace(":00", "")
    .replace(/^12\sAM$/, "midnight")
    .replace(/^12\sPM$/, "noon")
    .replace(/\s?AM$/, " am")
    .replace(/\s?PM$/, " pm");
}

function describe(at: Date) {
  const ams = offsetMinutes(TZ, at);
  const mine = offsetMinutes(undefined, at);
  const yours = mine === ams ? null : `${localTime(START, ams, at)} to ${localTime(END, ams, at)} your time`;
  return { gmt: gmtLabel(ams), yours };
}

export default function ReplyHours() {
  const [info, setInfo] = useState<{ gmt: string; yours: string | null }>({ gmt: "Amsterdam time", yours: null });

  useEffect(() => {
    setInfo(describe(new Date()));
  }, []);

  return (
    <>
      I reply within hours, 9&nbsp;am to 9&nbsp;pm {info.gmt}
      {info.yours ? ` (${info.yours})` : ""}.
    </>
  );
}
