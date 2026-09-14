import { Link } from "react-router";
import { types } from "../data.js";
import { useLang } from "../i18n.jsx";

// Primary axis: filter by record `type`. Counts are the totals per type
// (independent of the other filters).
export default function Tabs({ active, counts, search }) {
  const { t, lang } = useLang();
  const searchParams = new URLSearchParams(search);
  searchParams.delete("type");
  const cleanSearch = searchParams.toString();
  const prefix = lang === "en" ? "/en" : "";
  const paths = { tool: prefix || "/", company: `${prefix}/company`, platform: `${prefix}/platform` };

  return (
    <div className="tabs" role="tablist">
      {types.map((id) => {
        return (
          <Link
            key={id}
            to={{ pathname: paths[id], search: cleanSearch }}
            replace
            role="tab"
            aria-selected={active === id}
            className={`tab${active === id ? " active" : ""}`}
          >
            {t(`tab_${id}`)} <span className="tab-count">{counts[id]}</span>
          </Link>
        );
      })}
    </div>
  );
}
