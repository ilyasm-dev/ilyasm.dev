// Rolantir dashboard chart load time before and after the move to TimescaleDB (hub projects/rolantir/README.md).
export default function LatencyBars() {
  const max = 900;
  return (
    <figure className="bars" aria-label="Dashboard chart load time, before and after">
      <div className="bar-row">
        <span className="bar-label">before</span>
        <div className="bar-track">
          <div className="bar bar-before" style={{ width: `${(400 / max) * 100}%` }} />
          <div className="bar bar-range" style={{ left: `${(400 / max) * 100}%`, width: `${(500 / max) * 100}%` }} />
        </div>
        <span className="bar-value">400 to 900 ms</span>
      </div>
      <div className="bar-row">
        <span className="bar-label">after</span>
        <div className="bar-track">
          <div className="bar bar-after" style={{ width: `${(8 / max) * 100}%` }} />
        </div>
        <span className="bar-value">3 to 8 ms</span>
      </div>
    </figure>
  );
}
