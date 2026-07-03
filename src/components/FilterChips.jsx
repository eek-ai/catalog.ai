import { originShort, vocabLabel } from "../data.js";
import { useLang } from "../i18n.jsx";

// Shows every active filter as a removable pill. `type` is intentionally not
// shown here — it's the tab, always set.
export default function FilterChips({ q, sector, status, origin, onRemove, onClearAll }) {
  const { t, lang } = useLang();
  const chips = [];
  if (q.trim()) chips.push(["q", q.trim(), `“${q.trim()}”`]);
  sector.forEach((v) => chips.push(["sector", v, vocabLabel(v, lang)]));
  status.forEach((v) => chips.push(["status", v, vocabLabel(v, lang)]));
  origin.forEach((v) => chips.push(["origin", v, originShort(v, lang)]));

  if (chips.length === 0) return null;

  return (
    <div className="chips">
      {chips.map(([key, value, label]) => (
        <button
          key={key + value}
          className="chip"
          onClick={() => onRemove(key, value)}
          aria-label={`${t("remove_filter")}: ${label}`}
        >
          <span>{label}</span>
          <span className="chip-x" aria-hidden="true">
            ×
          </span>
        </button>
      ))}
      {chips.length > 1 && (
        <button className="chip chip-clear" onClick={onClearAll}>
          {t("clear_all")}
        </button>
      )}
    </div>
  );
}
