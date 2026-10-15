import type { ShowcaseCopy } from "@/content/copy/types";
import { fill } from "@/lib/i18n";

// Rolantir hourly chart query time on the server, measured on production (backend commit 6a15eb6).
// 400 ms is the conservative end of the measured 400 to 900 ms, 8 ms the slow end of 3 to 8 ms.
export const BEFORE_MS = 400;
export const AFTER_MS = 8;
export const SLOW = 10;

export const chartRunMs = (slow: boolean) => BEFORE_MS * (slow ? SLOW : 1);
export const chartLabel = (copy: ShowcaseCopy) => fill(copy.chartLabel, { before: BEFORE_MS, after: AFTER_MS });

const W = 320;
const H = 150;
const PAD = { l: 8, r: 8, t: 12, b: 22 };

// An invented daily cycle with an evening peak and a busier weekend. Not real game data.
const POINTS = Array.from({ length: 7 * 24 }, (_, h) => {
  const day = Math.floor(h / 24);
  const hour = h % 24;
  const cycle = 0.5 + 0.5 * Math.cos(((hour - 19) / 24) * Math.PI * 2);
  const weekend = day >= 5 ? 1.14 : 1;
  const wobble = 0.03 * Math.sin(h * 1.7) + 0.02 * Math.sin(h * 0.45 + day);
  return (0.34 + 0.56 * Math.pow(cycle, 1.4) + wobble) * weekend;
});
const MAX = Math.max(...POINTS) * 1.05;
const x = (i: number) => PAD.l + (i / (POINTS.length - 1)) * (W - PAD.l - PAD.r);
const y = (v: number) => H - PAD.b - (v / MAX) * (H - PAD.t - PAD.b);
const LINE = POINTS.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join("");
const AREA = `${LINE}L${x(POINTS.length - 1).toFixed(1)} ${H - PAD.b}L${x(0).toFixed(1)} ${H - PAD.b}Z`;
const GRID = [0.25, 0.5, 0.75, 1].map((f) => y(MAX * f * 0.95));

function Chart({ days }: { days: string[] }) {
  return (
    <svg className="dash-svg" viewBox={`0 0 ${W} ${H}`} role="presentation" focusable="false">
      {GRID.map((g, i) => (
        <line key={i} x1={PAD.l} x2={W - PAD.r} y1={g} y2={g} className="dash-grid" />
      ))}
      <path d={AREA} className="dash-area" />
      <path d={LINE} className="dash-line" />
      {days.map((d, i) => (
        <text key={d} x={PAD.l + ((i + 0.5) / 7) * (W - PAD.l - PAD.r)} y={H - 6} className="dash-tick" textAnchor="middle">
          {d}
        </text>
      ))}
    </svg>
  );
}

function Loading({ text }: { text: string }) {
  return (
    <div className="dash-loading">
      <span className="dash-spinner" />
      <span>{text}</span>
    </div>
  );
}

type Side = { name: "before" | "after"; realMs: number };
const SIDES: Side[] = [
  { name: "before", realMs: BEFORE_MS },
  { name: "after", realMs: AFTER_MS },
];

export default function ChartLoad({ copy, elapsed, slow, reduced }: { copy: ShowcaseCopy; elapsed: number | null; slow: boolean; reduced: boolean }) {
  const scale = slow ? SLOW : 1;
  return (
    <div className="show-body">
      {SIDES.map((s) => {
        const loaded = reduced || (elapsed !== null && elapsed >= s.realMs * scale);
        return (
          <div className={`race-col race-col-${s.name}`} key={s.name}>
            <div className="race-chat dash">
              <span className="race-tag">{copy[s.name]}</span>
              <span className="dash-example">{copy.chartExample}</span>
              <div className="dash-plot" aria-hidden="true" data-loaded={loaded}>
                {loaded ? <Chart days={copy.chartDays} /> : <Loading text={copy.chartQuerying} />}
              </div>
              <span className="show-outcome race-done" aria-hidden="true">
                {s.realMs} ms
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
