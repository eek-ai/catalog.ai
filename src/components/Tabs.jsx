import { types, tools } from "../data.js";

// Primary axis: filter by record `type`. Counts are the totals per type
// (independent of the other filters).
export default function Tabs({ active, onSelect }) {
  return (
    <div className="tabs" role="tablist">
      {types.map((t) => {
        const count = tools.filter((x) => x.type === t.id).length;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            className={`tab${active === t.id ? " active" : ""}`}
            onClick={() => onSelect(t.id)}
          >
            {t.label} <span className="tab-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
