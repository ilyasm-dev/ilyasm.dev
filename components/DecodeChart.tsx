"use client";

import { useState } from "react";
import { DECODE as d, DEPTHS, TOKENS } from "@/lib/decode";

const W = 560;
const H = 280;
const PAD = { l: 44, r: 58, t: 16, b: 36 };
const Y_MAX = 250;

// The x axis is proportional to context length, so the slope between points is honest.
const x = (i: number) => PAD.l + (TOKENS[i] / TOKENS[TOKENS.length - 1]) * (W - PAD.l - PAD.r);
const y = (v: number) => PAD.t + (1 - v / Y_MAX) * (H - PAD.t - PAD.b);
const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

export default function DecodeChart() {
  const [hover, setHover] = useState<number | null>(null);

  function onMove(e: React.PointerEvent<SVGRectElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const px = PAD.l + ((e.clientX - box.left) / box.width) * (W - PAD.l - PAD.r);
    let best = 0;
    for (let i = 1; i < TOKENS.length; i++) if (Math.abs(x(i) - px) < Math.abs(x(best) - px)) best = i;
    setHover(best);
  }

  const tip = hover !== null ? { m: d.master[hover], f: d.fix[hover] } : null;
  const tipLeft = hover !== null ? (x(hover) / W) * 100 : 0;

  return (
    <figure className="chart">
      <div className="chart-head">
        <figcaption>Decode speed in tokens per second (higher is better) as the context grows. RTX 5090, CUDA 12.8.1, Qwen3-8B Q4_K_M, q4_0 cache</figcaption>
      </div>
      <p className="chart-callout" aria-live="polite">
        <span>At 32k tokens of context</span>
        <strong>
          {d.master[3].toFixed(1)} to {d.fix[3].toFixed(1)} tok/s
        </strong>
        <span className="chart-ratio">{(d.fix[3] / d.master[3]).toFixed(2)}x with the q4_0 cache</span>
      </p>
      <div className="chart-body">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="decode-title">
          <title id="decode-title">{`Decode speed in tokens per second by context length, q4_0 cache. At 32k tokens of context it is ${d.master[3].toFixed(1)} before the fix and ${d.fix[3].toFixed(1)} after.`}</title>
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
          <path key="m" className="line line-master" d={path(d.master)} />
          <path key="f" className="line line-fix" d={path(d.fix)} />
          {d.master.map((v, i) => (
            <circle key={`mc${i}`} className={`dot dot-master${hover === i ? " on" : ""}`} cx={x(i)} cy={y(v)} r={hover === i ? 5 : 3.5} />
          ))}
          {d.fix.map((v, i) => (
            <circle key={`fc${i}`} className={`dot dot-fix${hover === i ? " on" : ""}`} cx={x(i)} cy={y(v)} r={hover === i ? 5 : 3.5} />
          ))}
          <text className="end-label end-fix" x={x(3) + 9} y={y(d.fix[3]) + 4}>
            after
          </text>
          <text className="end-label end-master" x={x(3) + 9} y={y(d.master[3]) + (Math.abs(y(d.fix[3]) - y(d.master[3])) < 14 ? 17 : 4)}>
            before
          </text>
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
      <table className="chart-table">
        <caption className="sr-only">Decode speed in tokens per second, q4_0 cache</caption>
        <thead>
          <tr>
            <th scope="col">Context (tokens)</th>
            <th scope="col">Before</th>
            <th scope="col">After</th>
            <th scope="col">Change</th>
          </tr>
        </thead>
        <tbody>
          {DEPTHS.map((label, i) => (
            <tr key={label} className={hover === i ? "on" : undefined}>
              <th scope="row">{label}</th>
              <td>{d.master[i].toFixed(1)}</td>
              <td>{d.fix[i].toFixed(1)}</td>
              <td className="chart-gain">{(d.fix[i] / d.master[i]).toFixed(2)}x</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="chart-source">
        Measured with llama-bench, 128 generated tokens, llama.cpp master against the PR branch (PR #30077).
      </p>
      <div className="legend">
        <span>
          <i className="sw sw-master" /> before (llama.cpp master)
        </span>
        <span>
          <i className="sw sw-fix" /> after the fix
        </span>
      </div>
    </figure>
  );
}
