import { DECODE } from "@/lib/decode";

type Row = { from: number; to?: number; text: string };

// Two bars, before in the problem color and after in the result color. `to` draws a hatched range.
function Bars({ before, after, max, caption, label }: { before: Row; after: Row; max: number; caption: string; label: string }) {
  const pct = (v: number) => `${(v / max) * 100}%`;
  const rows: [string, Row][] = [
    ["before", before],
    ["after", after],
  ];
  return (
    <figure className="bars" aria-label={label}>
      {rows.map(([kind, r]) => (
        <div className={`bar-row bar-row-${kind}`} key={kind}>
          <span className="bar-label">{kind}</span>
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
export function ChartQueryBars() {
  return (
    <Bars
      before={{ from: 400, to: 900, text: "400 to 900 ms" }}
      after={{ from: 8, text: "3 to 8 ms" }}
      max={900}
      caption="Hourly chart query time, measured on production, June 2026"
      label="Hourly chart query time, 400 to 900 ms before and 3 to 8 ms after the rewrite"
    />
  );
}

// llama.cpp decode speed at 32k tokens of context, before and after PR #30077.
export function DecodeBars() {
  const m = DECODE.master[3].toFixed(1);
  const f = DECODE.fix[3].toFixed(1);
  return (
    <Bars
      before={{ from: DECODE.master[3], text: `${m} tok/s` }}
      after={{ from: DECODE.fix[3], text: `${f} tok/s` }}
      max={DECODE.fix[3]}
      caption="Decode speed at 32k tokens of context, RTX 5090, CUDA 12.8.1"
      label={`Decode speed at 32k tokens of context, ${m} tokens per second before the fix and ${f} after`}
    />
  );
}
