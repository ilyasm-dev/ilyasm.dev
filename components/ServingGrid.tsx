import type { ShowcaseCopy } from "@/content/copy/types";
import { fill, num, type Lang } from "@/lib/i18n";
import { SLOT_ENDS_PATCHED, SLOT_ENDS_STOCK } from "@/lib/serving";

// Measured vLLM output throughput of the same runs, long prompts, 64 at once, one H100 NVL (PR #60464).
const BEFORE_TPS = 634;
const AFTER_TPS = 965;

// One bar per concurrent request slot, each serving its requests in turn at their measured end times.
const TILES = SLOT_ENDS_STOCK.length;
const PER_TILE = SLOT_ENDS_STOCK[0].length;
const REQUESTS = TILES * PER_TILE;
// Benchmark seconds per second on screen.
export const SERVING_SPEEDUP = 10;

const lastEnd = (slots: number[][]) => Math.max(...slots.map((ends) => ends[ends.length - 1]));
const BEFORE_S = lastEnd(SLOT_ENDS_STOCK);
const AFTER_S = lastEnd(SLOT_ENDS_PATCHED);

export const SERVING_MS = (BEFORE_S * 1000) / SERVING_SPEEDUP;
export const servingLabel = (copy: ShowcaseCopy, lang: Lang) =>
  fill(copy.servingLabel, {
    tiles: TILES,
    perTile: PER_TILE,
    beforeTps: BEFORE_TPS,
    requests: REQUESTS,
    beforeS: num(BEFORE_S, lang, 1),
    afterTps: AFTER_TPS,
    afterS: num(AFTER_S, lang, 1),
  });

type Panel = { name: "before" | "after"; doneS: number; slots: number[][] };
const PANELS: Panel[] = [
  { name: "before", doneS: BEFORE_S, slots: SLOT_ENDS_STOCK },
  { name: "after", doneS: AFTER_S, slots: SLOT_ENDS_PATCHED },
];

// Requests a bar has finished after `t` benchmark seconds, as a fraction (2.5 is halfway through its third).
// Each request starts when the one before it in the slot ends.
const servedAt = (ends: number[], t: number) => {
  const done = ends.filter((end) => end <= t).length;
  if (done === ends.length) return done;
  const start = done ? ends[done - 1] : 0;
  return done + (t - start) / (ends[done] - start);
};

function Tile({ served }: { served: number }) {
  const full = served >= PER_TILE;
  const progress = full ? 1 : served % 1;
  return (
    <span className={full ? "tile tile-full" : "tile"}>
      <i className="tile-fill" style={{ transform: `scaleX(${progress})` }} />
    </span>
  );
}

type Props = { copy: ShowcaseCopy; lang: Lang; elapsed: number | null };

function ServingPanel({ panel, elapsed, copy, lang }: Props & { panel: Panel }) {
  const t = Math.min(((elapsed ?? 0) * SERVING_SPEEDUP) / 1000, panel.doneS);
  const done = t >= panel.doneS;
  const served = panel.slots.map((ends) => (done ? PER_TILE : servedAt(ends, t)));

  return (
    <div className={`race-col race-col-${panel.name}`}>
      <div className="race-chat serve-panel">
        <span className="race-tag">{copy[panel.name]}</span>
        <div className="tile-grid" aria-hidden="true">
          {served.map((s, i) => (
            <Tile key={i} served={s} />
          ))}
        </div>
        <span className={done ? "show-outcome race-done" : "show-outcome"} aria-hidden="true">
          {done ? fill(copy.doneIn, { s: num(panel.doneS, lang, 1) }) : fill(copy.seconds, { s: num(t, lang, 1) })}
        </span>
      </div>
    </div>
  );
}

export default function ServingGrid({ elapsed, reduced, ...props }: Props & { reduced: boolean }) {
  const e = reduced ? SERVING_MS : elapsed;
  return (
    <div className="show-body">
      {PANELS.map((p) => (
        <ServingPanel key={p.name} panel={p} elapsed={e} {...props} />
      ))}
    </div>
  );
}
