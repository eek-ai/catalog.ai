import { originShort } from "../data.js";

// Shows every active filter as a removable pill. `type` is intentionally not
// shown here — it's the tab, always set.
export default function FilterChips({ q, sector, status, origin, onRemove, onClearAll }) {
  const chips = [];
  if (q.trim()) chips.push(["q", q.trim(), `“${q.trim()}”`]);
  sector.forEach((v) => chips.push(["sector", v, v]));
  status.forEach((v) => chips.push(["status", v, v]));
  origin.forEach((v) => chips.push(["origin", v, originShort(v)]));

  if (chips.length === 0) return null;

  return (
    <div className="chips">
      {chips.map(([key, value, label]) => (
        <button key={key + value} className="chip" onClick={() => onRemove(key, value)}>
          {label} <span className="chip-x">×</span>
        </button>
      ))}
      {chips.length > 1 && (
        <button className="chip chip-clear" onClick={onClearAll}>
          Очистити все
        </button>
      )}
    </div>
  );
}
