// Small inline drawings. They explain a mechanism or a symptom and carry no data, so none of them shows a number
// that is not already in the text next to it.

function Cylinder({ cx, top, h, rx = 10, className, plain }: { cx: number; top: number; h: number; rx?: number; className: string; plain?: boolean }) {
  const ry = plain ? 8 : rx * 0.38;
  const l = cx - rx;
  const r = cx + rx;
  return (
    <g className={className}>
      <path d={`M${l} ${top}V${top + h}A${rx} ${ry} 0 0 0 ${r} ${top + h}V${top}`} />
      {!plain && <path d={`M${l} ${top + h / 2}A${rx} ${ry} 0 0 0 ${r} ${top + h / 2}`} />}
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} />
    </g>
  );
}

/** A GPU gauge stuck at half: the hardware could do twice as much. */
export function GaugeHalf() {
  return (
    <svg className="il il-symptom" viewBox="0 0 72 48" aria-hidden="true">
      <path className="il-track" d="M10 40A26 26 0 0 1 62 40" />
      <path className="il-hot-stroke" d="M10 40A26 26 0 0 1 36 14" />
      <path className="il-line" d="M36 40L36 20" />
      <circle className="il-dot" cx="36" cy="40" r="3.5" />
      <path className="il-tick" d="M8 40h-3M67 40h-3M36 10V6" />
    </svg>
  );
}

/** A database copied to a new one, with a check that nothing was lost. */
export function DatabaseMove() {
  return (
    <svg className="il il-symptom" viewBox="0 0 88 48" aria-hidden="true">
      <Cylinder cx={17} top={12} h={24} className="il-line" />
      <path className="il-line" d="M34 24h16m-5-5 5 5-5 5" />
      <Cylinder cx={67} top={12} h={24} className="il-accent" />
      <circle className="il-ok-fill" cx="79" cy="36" r="7" />
      <path className="il-on-ok" d="M75.8 36.2l2.2 2.2 4.2-4.6" />
    </svg>
  );
}

/** A cloud bill climbing steeply while the number of users barely moves. */
export function BillClimb() {
  return (
    <svg className="il il-symptom" viewBox="0 0 80 48" aria-hidden="true">
      <path className="il-track" d="M8 42H74M8 6V42" style={{ strokeWidth: 2 }} />
      <path className="il-line" d="M10 36L30 33L50 30L72 26" />
      <path className="il-hot-line" d="M10 38L30 30L48 20L70 7M60 6.5l10 0.5-1.5 9" />
    </svg>
  );
}

/** llama.cpp: before the fix a small value detoured through slow local memory, after it stays in registers. */
export function MemoryDetour() {
  return (
    <figure className="il-figure il-figure-wide il-verdict">
      <svg
        className="il il-diagram"
        viewBox="0 0 330 150"
        role="img"
        aria-label="Illustration. Before the fix, the kernel stored a small value in slow local memory and read it back before using it. After the fix, the value goes straight from where it is read to where it is used."
      >
        <text className="il-text il-muted" x="0" y="31">before</text>
        <rect className="il-box" x="56" y="14" width="74" height="26" rx="6" />
        <text className="il-text" x="93" y="31" textAnchor="middle">read value</text>
        <rect className="il-box" x="252" y="14" width="74" height="26" rx="6" />
        <text className="il-text" x="289" y="31" textAnchor="middle">use value</text>
        <path className="il-hot-line il-arrow-path" d="M130 27h8q6 0 6 6v26q0 6 6 6h4" />
        <rect className="il-hot-box" x="154" y="52" width="80" height="26" rx="6" />
        <text className="il-text il-hot-text" x="194" y="69" textAnchor="middle">slow memory</text>
        <path className="il-hot-line il-arrow-path" d="M234 65h4q6 0 6-6V33q0-6 6-6h0" />
        <path className="il-hot-line" d="M246 22l5 5-5 5" />

        <text className="il-text il-muted" x="0" y="123">after</text>
        <rect className="il-box" x="56" y="106" width="74" height="26" rx="6" />
        <text className="il-text" x="93" y="123" textAnchor="middle">read value</text>
        <rect className="il-box" x="252" y="106" width="74" height="26" rx="6" />
        <text className="il-text" x="289" y="123" textAnchor="middle">use value</text>
        <path className="il-accent-line" d="M130 119h118m-5-5 5 5-5 5" />
        <text className="il-text il-accent-text" x="190" y="112" textAnchor="middle">kept in registers</text>
      </svg>
      <figcaption className="il-caption">Illustration of the fix</figcaption>
    </figure>
  );
}

/** Rolantir: the move from SQLite to PostgreSQL with TimescaleDB, and the two code paths checked against each other. */
export function MigrationDiagram() {
  return (
    <figure className="il-figure il-figure-wide">
      <svg
        className="il il-diagram"
        viewBox="0 0 340 178"
        role="img"
        aria-label="Diagram of the database move. The 13.9 GB SQLite database was pre-loaded into PostgreSQL with TimescaleDB, then only what had changed was copied. The old and new database code ran behind the same interface and were checked against each other."
      >
        <Cylinder cx={52} top={16} h={56} rx={46} className="il-cyl" plain />
        <text className="il-text il-strong" x="52" y="48" textAnchor="middle">SQLite</text>
        <text className="il-text il-muted" x="52" y="64" textAnchor="middle">13.9 GB</text>

        <Cylinder cx={284} top={16} h={56} rx={54} className="il-cyl il-cyl-new" plain />
        <text className="il-text il-strong" x="284" y="48" textAnchor="middle">PostgreSQL</text>
        <text className="il-text il-muted" x="284" y="64" textAnchor="middle">+ TimescaleDB</text>

        <text className="il-text" x="166" y="24" textAnchor="middle">pre-load</text>
        <path className="il-thick" d="M106 34h108" />
        <path className="il-thick-head" d="M212 27l8 7-8 7z" />
        <path className="il-line" d="M106 56h112m-5-5 5 5-5 5" />
        <text className="il-text" x="166" y="76" textAnchor="middle">copy what changed</text>

        <rect className="il-box" x="8" y="112" width="124" height="28" rx="14" />
        <text className="il-text" x="70" y="130" textAnchor="middle">old database code</text>
        <rect className="il-box il-box-accent" x="208" y="112" width="124" height="28" rx="14" />
        <text className="il-text" x="270" y="130" textAnchor="middle">new database code</text>
        <path className="il-ok-line" d="M142 126h56m-5-5 5 5-5 5m-51-10-5 5 5 5" />
        <text className="il-text il-muted" x="170" y="164" textAnchor="middle">checked against each other, behind one interface</text>
      </svg>
      <figcaption className="il-caption">How the database move kept the history</figcaption>
    </figure>
  );
}
