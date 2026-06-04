import { Link, useLocation } from "react-router-dom";
import { statusClass } from "../data.js";

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
        <span className={`status status-${statusClass(tool.status)}`}>
          {tool.status}
        </span>
      </div>

      <div className="tool-tags">
        <span className="tag sector-tag">{tool.sector}</span>
        <span className="tag">{tool.category}</span>
      </div>

      <p className="tool-desc">{tool.description}</p>

      <dl className="tool-meta">
        <dt>Користувачі</dt>
        <dd>{tool.target_users}</dd>
        <dt>Доступ</dt>
        <dd>{tool.access}</dd>
        <dt>Стадія</dt>
        <dd>{tool.maturity}</dd>
      </dl>

      <Link to={to} className="tool-link">
        Детальніше →
      </Link>
    </article>
  );
}
