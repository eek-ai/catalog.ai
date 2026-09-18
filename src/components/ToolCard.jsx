import { Link } from "react-router";
import { statusClass, sectorClass, vocabLabel } from "../data.js";
import { useLang } from "../i18n.jsx";
import { canonicalDetailPath } from "../seo.js";

export default function ToolCard({ tool, showAll = false, search = "" }) {
  const { t, lang } = useLang();
  // Carry the active filters into the detail URL so "back" restores the list.
  const prefix = lang === "en" ? "/en" : "";
  const to = { pathname: `${prefix}${canonicalDetailPath(tool.id)}`, search };

  return (
    <article className="tool-card">
      <div className="tool-head">
        <Link to={to} className="tool-title">
          <h3>{tool.name}</h3>
        </Link>
        {showAll ? (
          <span className={`status status-${statusClass(tool.status)}`}>{vocabLabel(tool.status, lang)}</span>
        ) : null}
      </div>

      <p className="tool-tagline">{tool.descr_short}</p>
      <p className="tool-desc">{tool.description}</p>
      <div className="card-sector-row">
        <span className={`tag sector-tag sector-${sectorClass(tool.sector)}`}>{vocabLabel(tool.sector, lang)}</span>
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
        {tool.sourceCount > 0 && (
          <span className="src-count" title={t("sources_title")}>🔗 {tool.sourceCount}</span>
        )}
        <Link to={to} className="tool-link">
          {t("details")}
        </Link>
      </div>
    </article>
  );
}
