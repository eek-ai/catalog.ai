import { Link, useLocation } from "react-router-dom";
import { statusClass, originShort } from "../data.js";

export default function ToolCard({ tool }) {
  // Carry the active filters into the detail URL so "back" restores the list.
  const { search } = useLocation();
  const to = { pathname: `/tool/${tool.id}`, search };

  return (
    <article className="tool-card">
      <div className="tool-head">
        <Link to={to} className="tool-title">
          <h3>{tool.name}</h3>
        </Link>
        <span className={`status status-${statusClass(tool.status)}`}>{tool.status}</span>
      </div>

      <p className="tool-tagline">{tool.descr_short}</p>
      <p className="tool-desc">{tool.description}</p>

      <div className="tool-foot">
        <span className="tag sector-tag">{tool.sector}</span>
        <span className="tag origin-tag">{originShort(tool.origin)}</span>
        {tool.needs_review && (
          <span className="flag-review" title="Докази слабкі — потребує перевірки">
            ⚠ неперевірено
          </span>
        )}
        {tool.sources?.length > 0 && (
          <span className="src-count" title="Кількість джерел">🔗 {tool.sources.length}</span>
        )}
        <Link to={to} className="tool-link">
          Детальніше →
        </Link>
      </div>
    </article>
  );
}
