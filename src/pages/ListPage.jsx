import { useMemo } from "react";
import { tools, sectors, statuses, origins, vocabLabel, originShort } from "../data.js";
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

  const label = (v) => vocabLabel(v, lang);
  const groups = [
    { key: "sector", title: t("facet_sector"), options: sectors, selected: sector, counts: counts.sector, labelFn: label },
    { key: "status", title: t("facet_status"), options: statuses, selected: status, counts: counts.status, labelFn: label },
    { key: "origin", title: t("facet_origin"), options: origins, selected: origin, counts: counts.origin, labelFn: (v) => originShort(v, lang) },
  ];

  return (
    <>
      <Tabs active={type} onSelect={setType} />

      <div className="catalog">
        <FilterRail groups={groups} toggle={toggle} />

        <div className="results">
          <div className="search-row">
            <svg
              className="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
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
