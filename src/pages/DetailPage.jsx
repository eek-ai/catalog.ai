import { useParams, Link, useLocation } from "react-router-dom";
import { getTool, statusClass, vocabLabel, originShort } from "../data.js";
import { useLang } from "../i18n.jsx";

const DETAIL_FIELDS = [
  "name",
  "url",
  "type",
  "descr_short",
  "sector",
  "origin",
  "description",
  "target_users",
  "access",
  "maturity",
  "status",
  "why_included",
  "notes",
  "needs_review",
  "sources",
];

function isEmptyValue(value) {
  return value == null || value === "" || (Array.isArray(value) && value.length === 0);
}

function FieldValue({ name, value, t, lang }) {
  if (name === "url") {
    return (
      <a href={value} target="_blank" rel="noreferrer">
        {value}
      </a>
    );
  }

  if (name === "type") return t(`type_${value}`);
  if (name === "needs_review") return value ? t("yes") : t("no");
  if (name === "sector" || name === "status" || name === "origin") return vocabLabel(value, lang);

  if (name === "sources") {
    return (
      <ul className="detail-source-list">
        {value.map((src) => (
          <li key={src}>
            <a href={src} target="_blank" rel="noreferrer">
              {src}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return value;
}

export default function DetailPage() {
  const { id } = useParams();
  const { search } = useLocation();
  const { t, lang } = useLang();
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
          {vocabLabel(tool.status, lang)}
        </span>
      </div>

      <p className="detail-tagline">{tool.descr_short}</p>

      <div className="tool-tags">
        <span className="tag sector-tag">{vocabLabel(tool.sector, lang)}</span>
        <span className="tag">{t(`type_${tool.type}`)}</span>
        <span className="tag origin-tag">{originShort(tool.origin, lang)}</span>
      </div>

      {tool.needs_review && <p className="review-banner">{t("review_banner")}</p>}

      <dl className="detail-meta detail-meta-all">
        {DETAIL_FIELDS.filter((field) => !isEmptyValue(tool[field])).map((field) => (
          <div className="detail-field" key={field}>
            <dt>{t(`field_${field}`)}</dt>
            <dd>
              <FieldValue name={field} value={tool[field]} t={t} lang={lang} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
