import { useLayoutEffect, useRef } from "react";
import type { ShowcaseCopy } from "@/content/copy/types";
import { fill, num, type Lang } from "@/lib/i18n";
import { AFTER_TPS, BEFORE_TPS, raceMs, tokenize } from "@/lib/race";

export const chatRaceMs = (count: number) => raceMs(count, BEFORE_TPS);

export const chatRaceLabel = (copy: ShowcaseCopy, count: number, lang: Lang) =>
  fill(copy.chatLabel, { before: num(raceMs(count, BEFORE_TPS) / 1000, lang, 1), after: num(raceMs(count, AFTER_TPS) / 1000, lang, 1) });

type Side = { name: "before" | "after"; tps: number };
const SIDES: Side[] = [
  { name: "before", tps: BEFORE_TPS },
  { name: "after", tps: AFTER_TPS },
];

type Props = { copy: ShowcaseCopy; lang: Lang; count: number; elapsed: number | null };

// `count` is the timing token count. The answer shown is in the page's language and fills at the same pace.
function ChatWindow({ side, copy, lang, count, elapsed, finalOnly }: Props & { side: Side; finalOnly: boolean }) {
  const doneMs = raceMs(count, side.tps);
  const time = finalOnly ? doneMs : Math.min(elapsed ?? 0, doneMs);
  const shown = finalOnly ? count : elapsed === null ? 0 : Math.min(count, Math.floor((time / 1000) * side.tps));
  const done = shown >= count;
  const tokens = tokenize(copy.chatAnswer);
  const typed = tokens.slice(0, Math.round((shown / count) * tokens.length)).join("");
  const rest = copy.chatAnswer.slice(typed.length);
  const stream = useRef<HTMLDivElement>(null);

  // Scrolling the window, rather than moving the text, keeps the page free of layout shift.
  useLayoutEffect(() => {
    const el = stream.current;
    if (!el) return;
    const over = el.scrollHeight > el.clientHeight;
    el.toggleAttribute("data-over", over);
    if (over) el.scrollTop = el.scrollHeight;
  }, [shown]);

  return (
    <div className={`race-col race-col-${side.name}`}>
      <div className="race-chat">
        <span className="race-tag">{copy[side.name]}</span>
        <p className="race-msg race-msg-user">{copy.chatQuestion}</p>
        {/* On phones this window shows only the latest lines, so both chats fit on one screen. */}
        <div className="race-stream" ref={stream}>
          <p className="race-msg race-msg-bot" aria-hidden="true">
            <span>{typed}</span>
            {!done && elapsed !== null ? <span className="race-caret" /> : null}
            <span className="race-rest">{rest}</span>
          </p>
        </div>
        <div className="race-progress" aria-hidden="true">
          <i style={{ transform: `scaleX(${shown / count})` }} />
        </div>
        <span className={done ? "show-outcome race-done" : "show-outcome"} aria-hidden="true">
          {done ? fill(copy.doneIn, { s: num(doneMs / 1000, lang, 1) }) : fill(copy.seconds, { s: num(time / 1000, lang, 1) })}
        </span>
      </div>
    </div>
  );
}

export default function ChatRace({ reduced, ...props }: Props & { reduced: boolean }) {
  return (
    <div className="show-body show-body-stack">
      <p className="race-msg race-msg-user race-q-shared" aria-hidden="true">
        {props.copy.chatQuestion}
      </p>
      {SIDES.map((s) => (
        <ChatWindow key={s.name} side={s} finalOnly={reduced} {...props} />
      ))}
    </div>
  );
}
