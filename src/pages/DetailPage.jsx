import { useParams, Link, useLocation } from "react-router-dom";
import { getTool, statusClass } from "../data.js";
import { useLang } from "../i18n.jsx";

export default function DetailPage() {
  const { id } = useParams();
  const { search } = useLocation();
  const { t } = useLang();
  const tool = getTool(id);
  const backTo = { pathname: "/", search };

  if (!tool) {
    return (
      <div className="detail">
        <Link to={backTo} className="back-link">{t("back")}</Link>
        <p className="empty">{t("not_found")}</p>
      </div>
    );
  }

  return (
    <div className="detail">
      <Link to={backTo} className="back-link">{t("back")}</Link>

      <div className="detail-head">
        <h2>{tool.name}</h2>
        <span className={`status status-${statusClass(tool.status)}`}>
          {tool.status}
        </span>
      </div>

      <p className="detail-tagline">{tool.descr_short}</p>

      <div className="tool-tags">
        <span className="tag sector-tag">{tool.sector}</span>
        <span className="tag">{t(`type_${tool.type}`)}</span>
        <span className="tag origin-tag">{tool.origin}</span>
      </div>

      {tool.needs_review && <p className="review-banner">{t("review_banner")}</p>}

      <p className="detail-desc">{tool.description}</p>

      <dl className="detail-meta">
        <dt>{t("meta_users")}</dt>
        <dd>{tool.target_users}</dd>
        <dt>{t("meta_access")}</dt>
        <dd>{tool.access}</dd>
        <dt>{t("meta_stage")}</dt>
        <dd>{tool.maturity}</dd>
        {tool.why_included && (
          <>
            <dt>{t("meta_why")}</dt>
            <dd>{tool.why_included}</dd>
          </>
        )}
        {tool.notes && (
          <>
            <dt>{t("meta_notes")}</dt>
            <dd>{tool.notes}</dd>
          </>
        )}
      </dl>

      {tool.url && (
        <a className="detail-visit" href={tool.url} target="_blank" rel="noreferrer">
          {t("visit")}
        </a>
      )}

      {tool.sources?.length > 0 && (
        <div className="sources">
          <h3>{t("sources")}</h3>
          <ul>
            {tool.sources.map((src) => (
              <li key={src}>
                <a href={src} target="_blank" rel="noreferrer">{src}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
