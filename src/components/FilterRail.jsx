import { useEffect, useRef, useState } from "react";
import { originShort } from "../data.js";

// Keeps the sticky rail's height equal to the space between its current top
// and the bottom of the viewport, so its own scrollbar always reaches the end
// — whether the header is still in view (rail sits lower) or scrolled away
// (rail pinned to the top). Disabled on mobile, where the rail flows inline.
function useRailHeight(ref) {
  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;

    const update = () => {
      if (window.innerWidth <= 760) {
        rail.style.maxHeight = "";
        return;
      }
      const top = rail.getBoundingClientRect().top;
      rail.style.maxHeight = `${window.innerHeight - top - 16}px`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref]);
}

function FacetGroup({ title, options, selected, counts, onToggle, labelFn = (x) => x }) {
  // Open by default on desktop, collapsed on mobile so results aren't pushed
  // far down. Local state keeps the user's toggle through count re-renders.
  const [open, setOpen] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth > 760
  );
  return (
    <details className="facet" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        <span className="facet-title">{title}</span>
        {selected.length > 0 && <span className="facet-selected">{selected.length}</span>}
      </summary>
      <ul className="facet-list">
        {options.map((opt) => {
          const n = counts[opt] || 0;
          const isSelected = selected.includes(opt);
          return (
            <li key={opt}>
              <label
                className={[
                  "facet-row",
                  isSelected ? "is-selected" : "",
                  n === 0 && !isSelected ? "is-empty" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
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
  const railRef = useRef(null);
  useRailHeight(railRef);

  return (
    <aside className="rail" aria-label="Filters" ref={railRef}>
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
