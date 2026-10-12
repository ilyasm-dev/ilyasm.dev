import { useLayoutEffect, useRef } from "react";

const QUESTION ="Summarize the key risks in this 40-page contract.";

const ANSWER =
  "Here are the main risks I found. First, the termination clause lets the supplier end the agreement with only " +
  "thirty days notice, while you must give ninety. Second, liability is capped at the fees paid in the last " +
  "three months, which is far below the cost of a serious outage. Third, the contract renews automatically for " +
  "a full year unless you cancel in writing sixty days before the end date. Fourth, intellectual property " +
  "created during the project stays with the supplier, so you would only hold a license to use it. Fifth, " +
  "prices may rise once a year by up to twelve percent without your approval. Finally, disputes must go to " +
  "arbitration in a foreign court, which makes any claim slow and expensive. I would negotiate the notice " +
  "period, the liability cap and the renewal terms before signing.";

// Tokens are approximated as word pieces, an optional leading space plus up to 4 characters each.
const TOKENS = ANSWER.match(/ ?[^ ]{1,4}/g) ?? [];
const COUNT = TOKENS.length;

// Measured llama.cpp decode speeds at 32k context, RTX 5090, q4_0 KV cache, CUDA 12.8 (PR #30077).
const BEFORE_TPS = 65.1;
const AFTER_TPS = 134.4;
const BEFORE_MS = (COUNT / BEFORE_TPS) * 1000;
const AFTER_MS = (COUNT / AFTER_TPS) * 1000;

export const CHAT_RACE_MS = BEFORE_MS;
export const CHAT_RACE_LABEL = `Two chats answer the same question about a long contract. Before the fix the answer takes ${(BEFORE_MS / 1000).toFixed(1)} seconds. After the fix it takes ${(AFTER_MS / 1000).toFixed(1)} seconds.`;

function seconds(ms: number) {
  return (ms / 1000).toFixed(1);
}

type Side = { name: "before" | "after"; tps: number; doneMs: number };const SIDES: Side[] = [
  { name: "before", tps: BEFORE_TPS, doneMs: BEFORE_MS },
  { name: "after", tps: AFTER_TPS, doneMs: AFTER_MS },
];

function ChatWindow({ side, elapsed, finalOnly }: { side: Side; elapsed: number | null; finalOnly: boolean }) {
  const time = finalOnly ? side.doneMs : Math.min(elapsed ?? 0, side.doneMs);
  const shown = finalOnly ? COUNT : elapsed === null ? 0 : Math.min(COUNT, Math.floor((time / 1000) * side.tps));
  const done = shown >= COUNT;
  const typed = TOKENS.slice(0, shown).join("");
  const rest = ANSWER.slice(typed.length);
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
        <span className="race-tag">{side.name}</span>
        <p className="race-msg race-msg-user">{QUESTION}</p>
        {/* On phones this window shows only the latest lines, so both chats fit on one screen. */}
        <div className="race-stream" ref={stream}>
          <p className="race-msg race-msg-bot" aria-hidden="true">
            <span>{typed}</span>
            {!done && elapsed !== null ? <span className="race-caret" /> : null}
            <span className="race-rest">{rest}</span>
          </p>
        </div>
        <div className="race-progress" aria-hidden="true">
          <i style={{ transform: `scaleX(${shown / COUNT})` }} />
        </div>
        <span className={done ? "show-outcome race-done" : "show-outcome"} aria-hidden="true">
          {done ? `done in ${seconds(side.doneMs)} s` : `${seconds(time)} s`}
        </span>
      </div>
    </div>
  );
}

export default function ChatRace({ elapsed, reduced }: { elapsed: number | null; reduced: boolean }) {
  return (
    <div className="show-body show-body-stack">
      <p className="race-msg race-msg-user race-q-shared" aria-hidden="true">
        {QUESTION}
      </p>
      {SIDES.map((s) => (
        <ChatWindow key={s.name} side={s} elapsed={elapsed} finalOnly={reduced} />
      ))}
    </div>
  );
}
