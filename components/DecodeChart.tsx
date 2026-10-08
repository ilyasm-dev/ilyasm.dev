"use client";

import { useState } from "react";

type Series = { master: number[]; fix: number[] };

// RTX 5090, CUDA 12.8.1, Qwen3-8B Q4_K_M, llama-bench -n 128, mean of 3 rounds (audit repo results/cloud/vfix-5090-cu128/table.md)
const DEPTHS = ["0", "4k", "16k", "32k"];
const DATA: Record<"q4_0" | "q8_0", Series> = {
  q4_0: { master: [215.63, 164.41, 100.54, 65.07], fix: [235.0, 212.66, 171.85, 134.39] },
  q8_0: { master: [234.31, 211.85, 169.06, 131.24], fix: [234.35, 211.93, 168.94, 131.09] },
};

const W = 560;
const H = 280;
const PAD = { l: 44, r: 16, t: 16, b: 36 };
const Y_MAX = 250;

const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / (DEPTHS.length - 1);
const y = (v: number) => PAD.t + (1 - v / Y_MAX) * (H - PAD.t - PAD.b);
const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

export default function DecodeChart() {
  const [kind, setKind] = useState<"q4_0" | "q8_0">("q4_0");
  const [hover, setHover] = useState<number | null>(null);
  const d = DATA[kind];

  function onMove(e: React.PointerEvent<SVGRectElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * (W - PAD.l - PAD.r);
    const i = Math.round((px / (W - PAD.l - PAD.r)) * (DEPTHS.length - 1));
    setHover(Math.max(0, Math.min(DEPTHS.length - 1, i)));
  }

  const tip = hover !== null ? { m: d.master[hover], f: d.fix[hover] } : null;
  const tipLeft = hover !== null ? (x(hover) / W) * 100 : 0;

  return (
    <figure className="chart">
      <div className="chart-head">
        <figcaption>Tokens per second as the context grows, RTX 5090 with CUDA 12.8</figcaption>
        <div className="segmented" role="group" aria-label="KV cache type">
          <button aria-pressed={kind === "q4_0"} onClick={() => setKind("q4_0")}>
            q4_0 cache
          </button>
          <button aria-pressed={kind === "q8_0"} onClick={() => setKind("q8_0")}>
            q8_0 (control)
          </button>
        </div>
      </div>
      <div className="chart-body">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Decode speed, ${kind} cache, master against the fix`}>
          {[0, 50, 100, 150, 200, 250].map((v) => (
            <g key={v}>
              <line className="grid" x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} />
              <text className="tick" x={PAD.l - 8} y={y(v) + 4} textAnchor="end">
                {v}
              </text>
            </g>
          ))}
          {DEPTHS.map((label, i) => (
            <text key={label} className="tick" x={x(i)} y={H - 12} textAnchor="middle">
              {label}
            </text>
          ))}
          {hover !== null && <line className="guide" x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} />}
          <path key={`m-${kind}`} className="line line-master" d={path(d.master)} />
          <path key={`f-${kind}`} className="line line-fix" d={path(d.fix)} />
          {d.master.map((v, i) => (
            <circle key={`mc${i}`} className={`dot dot-master${hover === i ? " on" : ""}`} cx={x(i)} cy={y(v)} r={hover === i ? 5 : 3.5} />
          ))}
          {d.fix.map((v, i) => (
            <circle key={`fc${i}`} className={`dot dot-fix${hover === i ? " on" : ""}`} cx={x(i)} cy={y(v)} r={hover === i ? 5 : 3.5} />
          ))}
          <rect
            className="hit"
            x={PAD.l}
            y={PAD.t}
            width={W - PAD.l - PAD.r}
            height={H - PAD.t - PAD.b}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            data-testid="chart-hit"
          />
        </svg>
        {tip && hover !== null && (
          <div className="tooltip" style={{ left: `${tipLeft}%` }} role="status">
            <strong>{DEPTHS[hover]} tokens of context</strong>
            <span>
              <i className="sw sw-master" /> {tip.m.toFixed(1)} tok/s before
            </span>
            <span>
              <i className="sw sw-fix" /> {tip.f.toFixed(1)} tok/s after
            </span>
            <span className="tip-gain">{(tip.f / tip.m).toFixed(2)}x</span>
          </div>
        )}
      </div>
      <div className="legend">
        <span>
          <i className="sw sw-master" /> before (llama.cpp master)
        </span>
        <span>
          <i className="sw sw-fix" /> after the fix
        </span>
        {kind === "q8_0" && <span className="legend-note">The lines overlap because the fix leaves q8_0 unchanged.</span>}
      </div>
    </figure>
  );
}
