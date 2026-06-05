import { useMemo } from "react";
import { tools, sectors, statuses, origins, toolCount } from "../data.js";
import Tabs from "../components/Tabs.jsx";
import FilterRail from "../components/FilterRail.jsx";
import FilterChips from "../components/FilterChips.jsx";
import ToolCard from "../components/ToolCard.jsx";

export default function ListPage({ filters }) {
  const { type, q, sector, status, origin, setType, setQuery, toggle, clearAll } = filters;

  const { visible, counts } = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const inType = tools.filter((t) => t.type === type);
    const matchQ = (t) =>
      !needle ||
      `${t.name} ${t.descr_short} ${t.description} ${t.target_users}`
        .toLowerCase()
        .includes(needle);

    // A tool passes the facets, optionally ignoring one group (for its counts).
    const passes = (t, except) =>
      (except === "sector" || sector.length === 0 || sector.includes(t.sector)) &&
      (except === "status" || status.length === 0 || status.includes(t.status)) &&
      (except === "origin" || origin.length === 0 || origin.includes(t.origin));

    const countsFor = (key) => {
      const m = {};
      for (const t of inType) if (matchQ(t) && passes(t, key)) m[t[key]] = (m[t[key]] || 0) + 1;
      return m;
    };

    return {
      visible: inType.filter((t) => matchQ(t) && passes(t, null)),
      counts: { sector: countsFor("sector"), status: countsFor("status"), origin: countsFor("origin") },
    };
  }, [type, q, sector, status, origin]);

  const groups = [
    { key: "sector", title: "Сектор", options: sectors, selected: sector, counts: counts.sector },
    { key: "status", title: "Статус", options: statuses, selected: status, counts: counts.status },
    { key: "origin", title: "Походження", options: origins, selected: origin, counts: counts.origin },
  ];

  return (
    <>
      <Tabs active={type} onSelect={setType} />

      <div className="catalog">
        <FilterRail groups={groups} toggle={toggle} />

        <div className="results">
          <input
            className="search"
            type="search"
            placeholder="Пошук за назвою, описом, користувачами…"
            value={q}
            onChange={(e) => setQuery(e.target.value)}
          />

          <FilterChips
            q={q}
            sector={sector}
            status={status}
            origin={origin}
            onRemove={toggle}
            onClearAll={clearAll}
          />

          <div className="result-count">{toolCount(visible.length)}</div>

          <div className="grid">
            {visible.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>

          {visible.length === 0 && (
            <p className="empty">Немає інструментів за вашими фільтрами.</p>
          )}
        </div>
      </div>
    </>
  );
}
