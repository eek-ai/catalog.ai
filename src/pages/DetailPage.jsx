import { Link, useLocation } from "react-router";
import { statusClass, vocabLabel, originShort } from "../data.js";
import { useHydrated } from "../hydration.js";
import { useLang } from "../i18n.jsx";
import { canonicalBrowsePath } from "../seo.js";

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
  if (name === "sector" || name === "status" || name === "origin") return vocabLabel(value, lang);

  return <span lang={lang === "en" ? "uk" : undefined}>{value}</span>;
}

export default function DetailPage({ tool }) {
  const location = useLocation();
  const search = useHydrated() ? location.search : "";
  const { t, lang } = useLang();
  const prefix = lang === "en" ? "/en" : "";
  const backTo = { pathname: `${prefix}${canonicalBrowsePath(tool?.type)}`, search };

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
        <h1 lang={lang === "en" ? "uk" : undefined}>{tool.name}</h1>
        <span className={`status status-${statusClass(tool.status)}`}>
          {vocabLabel(tool.status, lang)}
        </span>
      </div>

      <p className="detail-tagline" lang={lang === "en" ? "uk" : undefined}>
        {tool.descr_short}
      </p>

      <div className="tool-tags">
        <span className="tag sector-tag">{vocabLabel(tool.sector, lang)}</span>
        <span className="tag">{t(`type_${tool.type}`)}</span>
        <span className="tag origin-tag">{originShort(tool.origin, lang)}</span>
      </div>

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
