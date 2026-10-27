import type { Copy } from "@/content/copy/types";
import { DECODE } from "@/lib/decode";
import { fill, num, type Lang } from "@/lib/i18n";

type Row = { from: number; to?: number; text: string };
type BarsCopy = Copy["bars"];

// Two bars, before in the problem color and after in the result color. `to` draws a hatched range.
function Bars({ before, after, max, caption, label, copy }: { before: Row; after: Row; max: number; caption: string; label: string; copy: BarsCopy }) {
  const pct = (v: number) => `${(v / max) * 100}%`;
  const rows: ["before" | "after", Row][] = [
    ["before", before],
    ["after", after],
  ];
  return (
    <figure className="bars" aria-label={label}>
      {rows.map(([kind, r]) => (
        <div className={`bar-row bar-row-${kind}`} key={kind}>
          <span className="bar-label">{copy[kind]}</span>
          <div className="bar-track">
            <div className={`bar bar-${kind}`} style={{ width: pct(r.from) }} />
            {r.to ? <div className="bar bar-range" style={{ left: pct(r.from), width: pct(r.to - r.from) }} /> : null}
          </div>
          <span className="bar-value">{r.text}</span>
        </div>
      ))}
      <figcaption className="bars-caption">{caption}</figcaption>
    </figure>
  );
}

// Rolantir hourly chart query time before and after the query rewrite (hub projects/rolantir/README.md, commit 6a15eb6).
export function ChartQueryBars({ copy }: { copy: BarsCopy }) {
  return (
    <Bars
      before={{ from: 400, to: 900, text: copy.chartRange[0] }}
      after={{ from: 8, text: copy.chartRange[1] }}
      max={900}
      caption={copy.chartCaption}
      label={copy.chartLabel}
      copy={copy}
    />
  );
}

// llama.cpp decode speed at 32k tokens of context, before and after PR #30077.
export function DecodeBars({ copy, lang }: { copy: BarsCopy; lang: Lang }) {
  const m = num(DECODE.master[3], lang, 1);
  const f = num(DECODE.fix[3], lang, 1);
  return (
    <Bars
      before={{ from: DECODE.master[3], text: `${m} tok/s` }}
      after={{ from: DECODE.fix[3], text: `${f} tok/s` }}
      max={DECODE.fix[3]}
      caption={copy.decodeCaption}
      label={fill(copy.decodeLabel, { m, f })}
      copy={copy}
    />
  );
}
