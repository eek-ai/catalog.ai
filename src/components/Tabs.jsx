import { types, tools } from "../data.js";
import { useLang } from "../i18n.jsx";

// Primary axis: filter by record `type`. Counts are the totals per type
// (independent of the other filters).
export default function Tabs({ active, onSelect }) {
  const { t } = useLang();
  return (
    <div className="tabs" role="tablist">
      {types.map((id) => {
        const count = tools.filter((x) => x.type === id).length;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active === id}
            className={`tab${active === id ? " active" : ""}`}
            onClick={() => onSelect(id)}
          >
            {t(`tab_${id}`)} <span className="tab-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
