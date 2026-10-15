"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import ChatRace, { chatRaceLabel, chatRaceMs } from "@/components/ChatRace";
import ServingGrid, { servingLabel, SERVING_MS, SERVING_SPEEDUP } from "@/components/ServingGrid";
import ChartLoad, { chartLabel, chartRunMs } from "@/components/ChartLoad";
import type { ShowcaseCopy } from "@/content/copy/types";
import { fill, type Lang } from "@/lib/i18n";

// The text of each tab is in the copy, in the same order.
const TABS: { id: "llama" | "vllm" | "rolantir"; href: string; external: boolean }[] = [
  { id: "llama", href: "https://github.com/ggml-org/llama.cpp/pull/30077", external: true },
  { id: "vllm", href: "https://github.com/vllm-project/vllm/pull/60464", external: true },
  { id: "rolantir", href: "/work/rolantir/", external: false },
];

// `raceTokens` is the English answer's token count, which times the chat race in every language.
export default function Showcase({ copy, lang, raceTokens }: { copy: ShowcaseCopy; lang: Lang; raceTokens: number }) {
  const root = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [slow, setSlow] = useState(false);
  const [seen, setSeen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const total = active === 0 ? chatRaceMs(raceTokens) : active === 1 ? SERVING_MS : chartRunMs(slow);

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
  const text = copy.tabs[active];
  const label = active === 0 ? chatRaceLabel(copy, raceTokens, lang) : active === 1 ? servingLabel(copy, lang) : chartLabel(copy);

  return (
    <section className="showcase" ref={root} aria-label={copy.aria}>
      <div className="show-frame">
        <div className="show-tabs" role="tablist" aria-label={copy.tabsAria} onKeyDown={onKey}>
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
              <strong>{copy.tabs[i].figureShort}</strong>
              <span className="show-tab-sep" aria-hidden="true">
                {" · "}
              </span>
              <span>{copy.tabs[i].topic}</span>
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`show-panel-${tab.id}`} aria-labelledby={`show-tab-${tab.id}`} tabIndex={0} className="show-panel">
          <div className="show-source-row">
            <p className="show-source">
              {fill(text.measured, { speedup: SERVING_SPEEDUP })}
              <span aria-hidden="true">{" · "}</span>
              {tab.external ? (
                <a href={tab.href} target="_blank" rel="noopener noreferrer">
                  {text.source}
                  <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                  <span className="sr-only">{copy.newTab}</span>
                </a>
              ) : (
                <a href={tab.href} hrefLang={lang === "en" ? undefined : "en"}>
                  {text.source}
                </a>
              )}
            </p>
            {reduced ? null : (
              <span className="show-controls">
                {active === 2 ? (
                  <button type="button" role="switch" aria-checked={slow} className="show-switch" onClick={() => setSlow((s) => !s)}>
                    <span className="show-switch-track" aria-hidden="true" />
                    {copy.slowMotion}
                  </button>
                ) : null}
                <button type="button" className="race-replay" onClick={start} aria-label={copy.replayAria}>
                  <RotateCcw size={14} strokeWidth={2} aria-hidden="true" />
                  <span className="race-replay-text" aria-hidden="true">
                    {copy.replay}
                  </span>
                </button>
              </span>
            )}
          </div>
          <div role="img" aria-label={label}>
            {active === 0 ? <ChatRace copy={copy} lang={lang} count={raceTokens} elapsed={elapsed} reduced={reduced} /> : null}
            {active === 1 ? <ServingGrid copy={copy} lang={lang} elapsed={elapsed} reduced={reduced} /> : null}
            {active === 2 ? <ChartLoad copy={copy} elapsed={elapsed} slow={slow} reduced={reduced} /> : null}
          </div>
          <div className="show-card">
            <strong className="show-figure">{text.figure}</strong>
            <p className="proof-meaning">{text.meaning}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
