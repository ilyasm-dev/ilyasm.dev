"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import ChatRace, { CHAT_RACE_LABEL, CHAT_RACE_MS } from "@/components/ChatRace";
import ServingGrid, { SERVING_LABEL, SERVING_MS, SERVING_SPEEDUP } from "@/components/ServingGrid";
import ChartLoad, { CHART_LABEL, chartRunMs } from "@/components/ChartLoad";

type Tab = {
  id: "llama" | "vllm" | "rolantir";
  figureShort: string;
  topic: string;
  figure: string;
  meaning: string;
  measured: string;
  source: { label: string; href: string; external: boolean };
  label: string;
};

const TABS: Tab[] = [
  {
    id: "llama",
    figureShort: "Up to 2.1x faster",
    topic: "AI replies",
    figure: "Up to 2.1x faster AI replies",
    meaning: "Long chats answer about twice as fast without new hardware.",
    measured: "Measured on an RTX 5090 GPU",
    source: { label: "llama.cpp PR #30077", href: "https://github.com/ggml-org/llama.cpp/pull/30077", external: true },
    label: CHAT_RACE_LABEL,
  },
  {
    id: "vllm",
    figureShort: "Up to 52% more",
    topic: "AI serving",
    figure: "Up to 52% more AI tokens per second",
    meaning: "Two GPUs now serve more than what three GPUs served before my fix.",
    measured: `Measured on an H100 GPU (shown ${SERVING_SPEEDUP}x faster)`,
    source: { label: "vLLM PR #60464", href: "https://github.com/vllm-project/vllm/pull/60464", external: true },
    label: SERVING_LABEL,
  },
  {
    id: "rolantir",
    figureShort: "50x faster",
    topic: "Chart queries",
    figure: "50x faster chart queries",
    meaning: "Chart queries that went from slow to instant.",
    measured: "Measured on production",
    source: { label: "Rolantir case", href: "/work/rolantir/", external: false },
    label: CHART_LABEL,
  },
];

export default function Showcase() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [slow, setSlow] = useState(false);
  const [seen, setSeen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const total = active === 0 ? CHAT_RACE_MS : active === 1 ? SERVING_MS : chartRunMs(slow);

  const start = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const t0 = performance.now();
    setElapsed(0);
    const tick = (now: number) => {
      const ms = now - t0;
      setElapsed(Math.min(ms, total));
      if (ms < total) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [total]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          setSeen(true);
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Plays when the frame becomes visible and again whenever the tab or the speed changes.
  useEffect(() => {
    if (!seen || reduced) return;
    start();
    return () => cancelAnimationFrame(frame.current);
  }, [seen, reduced, start, active]);

  const select = (i: number) => {
    if (i === active) return;
    cancelAnimationFrame(frame.current);
    setElapsed(null);
    setActive(i);
  };

  const onKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: (active + 1) % TABS.length,
      ArrowLeft: (active + TABS.length - 1) % TABS.length,
      Home: 0,
      End: TABS.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = keys[e.key];
    select(next);
    tabRefs.current[next]?.focus();
  };

  const tab = TABS[active];

  return (
    <section className="showcase" ref={root} aria-label="Measured results">
      <div className="show-frame">
        <div className="show-tabs" role="tablist" aria-label="Results" onKeyDown={onKey}>
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`show-tab-${t.id}`}
              aria-selected={i === active}
              aria-controls={`show-panel-${t.id}`}
              tabIndex={i === active ? 0 : -1}
              className="show-tab"
              onClick={() => select(i)}
            >
              <strong>{t.figureShort}</strong>
              <span className="show-tab-sep" aria-hidden="true">
                {" · "}
              </span>
              <span>{t.topic}</span>
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`show-panel-${tab.id}`} aria-labelledby={`show-tab-${tab.id}`} tabIndex={0} className="show-panel">
          <div className="show-source-row">
            <p className="show-source">
              {tab.measured}
              <span aria-hidden="true">{" · "}</span>
              {tab.source.external ? (
                <a href={tab.source.href} target="_blank" rel="noopener noreferrer">
                  {tab.source.label}
                  <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <a href={tab.source.href}>{tab.source.label}</a>
              )}
            </p>
            {reduced ? null : (
              <span className="show-controls">
                {active === 2 ? (
                  <button type="button" role="switch" aria-checked={slow} className="show-switch" onClick={() => setSlow((s) => !s)}>
                    <span className="show-switch-track" aria-hidden="true" />
                    slow motion 10x
                  </button>
                ) : null}
                <button type="button" className="race-replay" onClick={start} aria-label="Replay">
                  <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
                  <span className="race-replay-text" aria-hidden="true">
                    replay
                  </span>
                </button>
              </span>
            )}
          </div>
          <div role="img" aria-label={tab.label}>
            {active === 0 ? <ChatRace elapsed={elapsed} reduced={reduced} /> : null}
            {active === 1 ? <ServingGrid elapsed={elapsed} reduced={reduced} /> : null}
            {active === 2 ? <ChartLoad elapsed={elapsed} slow={slow} reduced={reduced} /> : null}
          </div>
          <div className="show-card">
            <strong className="show-figure">{tab.figure}</strong>
            <p className="proof-meaning">{tab.meaning}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
