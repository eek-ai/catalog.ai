import { useEffect, useRef, useState } from "react";

// Keeps the sticky rail inside the visible part of the catalog: from its
// pinned top (or lower, while the header is in view) down to the viewport
// bottom or the end of the results column, whichever comes first. Otherwise
// the footer pushes the rail up at the page end and its first filters become
// unreachable. Disabled on mobile, where the rail flows inline.
function useRailHeight(ref) {
  useEffect(() => {
    const rail = ref.current;
    const results = rail?.nextElementSibling;
    if (!rail || !results) return;

    const update = () => {
      if (window.innerWidth <= 760) {
        rail.style.maxHeight = "";
        return;
      }
      const top = Math.max(rail.getBoundingClientRect().top, 16);
      const bottom = Math.min(window.innerHeight - 16, results.getBoundingClientRect().bottom);
      rail.style.maxHeight = `${bottom - top}px`;
    };

    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(results);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref]);
}

function FacetGroup({ title, options, selected, counts, onToggle, labelFn = (x) => x }) {
  // Open by default on desktop, collapsed on mobile so results aren't pushed
  // far down. Local state keeps the user's toggle through count re-renders.
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 760) setOpen(false);
  }, []);
  return (
    <details className="facet" open={open}>
      <summary
        onClick={(event) => {
          event.preventDefault();
          setOpen((current) => !current);
        }}
      >
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
          labelFn={g.labelFn}
        />
      ))}
    </aside>
  );
}
