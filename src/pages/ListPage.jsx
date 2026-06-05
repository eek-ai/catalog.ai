import { useMemo } from "react";
import { tools, sectors, statuses, origins } from "../data.js";
import { useLang, countLabel } from "../i18n.jsx";
import Tabs from "../components/Tabs.jsx";
import FilterRail from "../components/FilterRail.jsx";
import FilterChips from "../components/FilterChips.jsx";
import ToolCard from "../components/ToolCard.jsx";

export default function ListPage({ filters }) {
  const { type, q, sector, status, origin, showAll, setType, setQuery, toggle, remove, clearAll } =
    filters;
  const { t, lang } = useLang();

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
    { key: "sector", title: t("facet_sector"), options: sectors, selected: sector, counts: counts.sector },
    { key: "status", title: t("facet_status"), options: statuses, selected: status, counts: counts.status },
    { key: "origin", title: t("facet_origin"), options: origins, selected: origin, counts: counts.origin },
  ];

  return (
    <>
      <Tabs active={type} onSelect={setType} />

      <div className="catalog">
        <FilterRail groups={groups} toggle={toggle} />

        <div className="results">
          <div className="search-row">
            <input
              className="search"
              type="search"
              placeholder={t("search_placeholder")}
              value={q}
              onChange={(e) => setQuery(e.target.value)}
            />
            {q && (
              <button className="search-clear" onClick={() => setQuery("")} aria-label={t("clear_search")}>
                ×
              </button>
            )}
          </div>

          <FilterChips
            q={q}
            sector={sector}
            status={status}
            origin={origin}
            onRemove={remove}
            onClearAll={clearAll}
          />

          <div className="result-count">{countLabel(visible.length, lang)}</div>

          <div className="grid">
            {visible.map((tool) => (
              <ToolCard key={tool.id} tool={tool} showAll={showAll} />
            ))}
          </div>

          {visible.length === 0 && <p className="empty">{t("empty")}</p>}
        </div>
      </div>
    </>
  );
}
