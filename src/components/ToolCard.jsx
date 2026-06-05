import { Link, useLocation } from "react-router-dom";
import { statusClass, sectorClass } from "../data.js";
import { useLang } from "../i18n.jsx";

export default function ToolCard({ tool, showAll = false }) {
  const { t } = useLang();
  // Carry the active filters into the detail URL so "back" restores the list.
  const { search } = useLocation();
  const to = { pathname: `/tool/${tool.id}`, search };

  return (
    <article className="tool-card">
      <div className="tool-head">
        <Link to={to} className="tool-title">
          <h3>{tool.name}</h3>
        </Link>
        {showAll ? (
          <span className={`status status-${statusClass(tool.status)}`}>{tool.status}</span>
        ) : null}
      </div>

      <p className="tool-tagline">{tool.descr_short}</p>
      <p className="tool-desc">{tool.description}</p>
      <div className="card-sector-row">
        <span className={`tag sector-tag sector-${sectorClass(tool.sector)}`}>{tool.sector}</span>
      </div>

      {showAll && (
        <dl className="card-extra">
          {tool.maturity && (
            <>
              <dt>{t("field_maturity")}</dt>
              <dd>{tool.maturity}</dd>
            </>
          )}
          {tool.access && (
            <>
              <dt>{t("field_access")}</dt>
              <dd>{tool.access}</dd>
            </>
          )}
        </dl>
      )}

      <div className="tool-foot">
        {tool.needs_review && (
          <span className="flag-review" title={t("unverified_title")}>
            {t("unverified")}
          </span>
        )}
        {tool.sources?.length > 0 && (
          <span className="src-count" title={t("sources_title")}>🔗 {tool.sources.length}</span>
        )}
        <Link to={to} className="tool-link">
          {t("details")}
        </Link>
      </div>
    </article>
  );
}
