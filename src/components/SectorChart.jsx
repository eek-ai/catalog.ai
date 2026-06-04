// Bar chart of tools per sector. Each row is also a filter toggle: click a
// sector to filter the grid, click the active one again to clear.
export default function SectorChart({ tools, active, onSelect }) {
  const counts = {};
  for (const t of tools) counts[t.sector] = (counts[t.sector] || 0) + 1;

  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...rows.map(([, n]) => n));

  return (
    <div className="chart">
      <h2>Інструменти за секторами</h2>
      {rows.map(([sector, n]) => (
        <button
          key={sector}
          className={`bar-row${active === sector ? " active" : ""}`}
          onClick={() => onSelect(sector)}
        >
          <div className="bar-label">{sector}</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(n / max) * 100}%` }} />
          </div>
          <div className="bar-value">{n}</div>
        </button>
      ))}
    </div>
  );
}
