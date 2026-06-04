// Shows the currently-applied filters as removable pills.
export default function FilterChips({ query, sector, status, onClear }) {
  const chips = [];
  if (query.trim()) chips.push(["query", `“${query.trim()}”`]);
  if (sector) chips.push(["sector", sector]);
  if (status) chips.push(["status", status]);

  if (chips.length === 0) return null;

  return (
    <div className="chips">
      {chips.map(([key, label]) => (
        <button key={key} className="chip" onClick={() => onClear(key)}>
          {label} <span className="chip-x">×</span>
        </button>
      ))}
      {chips.length > 1 && (
        <button className="chip chip-clear" onClick={() => onClear("all")}>
          Очистити все
        </button>
      )}
    </div>
  );
}
