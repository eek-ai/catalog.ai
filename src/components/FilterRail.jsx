import { useState } from "react";
import { originShort } from "../data.js";

function FacetGroup({ title, options, selected, counts, onToggle, labelFn = (x) => x }) {
  // Open by default on desktop, collapsed on mobile so results aren't pushed
  // far down. Local state keeps the user's toggle through count re-renders.
  const [open, setOpen] = useState(() => window.innerWidth > 760);
  return (
    <details className="facet" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>{title}</summary>
      <ul className="facet-list">
        {options.map((opt) => {
          const n = counts[opt] || 0;
          return (
            <li key={opt}>
              <label className={`facet-row${n === 0 && !selected.includes(opt) ? " is-empty" : ""}`}>
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => onToggle(opt)}
                />
                <span className="facet-label">{labelFn(opt)}</span>
                <span className="facet-count">{n}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </details>
  );
}

// Faceted filters for the dimensions that aren't the primary (type) axis.
// Each group's counts reflect the other active filters but not its own
// selection (standard faceted-search behaviour).
export default function FilterRail({ groups, toggle }) {
  return (
    <aside className="rail">
      {groups.map((g) => (
        <FacetGroup
          key={g.key}
          title={g.title}
          options={g.options}
          selected={g.selected}
          counts={g.counts}
          onToggle={(val) => toggle(g.key, val)}
          labelFn={g.key === "origin" ? originShort : undefined}
        />
      ))}
    </aside>
  );
}
