import { useMemo } from "react";
import { tools, toolCount } from "../data.js";
import StatTiles from "../components/StatTiles.jsx";
import SectorChart from "../components/SectorChart.jsx";
import FilterChips from "../components/FilterChips.jsx";
import ToolCard from "../components/ToolCard.jsx";

export default function ListPage({ filters }) {
  const { query, sector, status, setFilter, resetFilters } = filters;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (sector && t.sector !== sector) return false;
      if (status && t.status !== status) return false;
      if (!q) return true;
      return `${t.name} ${t.category} ${t.description} ${t.target_users}`
        .toLowerCase()
        .includes(q);
    });
  }, [query, sector, status]);

  // Clicking an already-active tile clears it (toggle behaviour).
  const toggleSector = (s) => setFilter("sector", sector === s ? null : s);
  const toggleStatus = (s) => setFilter("status", status === s ? null : s);

  return (
    <>
      <StatTiles
        tools={tools}
        status={status}
        onStatus={toggleStatus}
      />

      <SectorChart tools={tools} active={sector} onSelect={toggleSector} />

      <input
        className="search"
        type="search"
        placeholder="Пошук за назвою, описом, користувачами…"
        value={query}
        onChange={(e) => setFilter("q", e.target.value)}
      />

      <FilterChips
        query={query}
        sector={sector}
        status={status}
        onClear={(key) =>
          key === "all" ? resetFilters() : setFilter(key === "query" ? "q" : key, null)
        }
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
    </>
  );
}
