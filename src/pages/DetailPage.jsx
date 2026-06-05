import { useParams, Link, useLocation } from "react-router-dom";
import { getTool, statusClass } from "../data.js";

const TYPE_LABEL = { tool: "Інструмент", company: "Компанія", platform: "Платформа" };

export default function DetailPage() {
  const { id } = useParams();
  const { search } = useLocation();
  const tool = getTool(id);
  const backTo = { pathname: "/", search };

  if (!tool) {
    return (
      <div className="detail">
        <Link to={backTo} className="back-link">← Назад до всіх інструментів</Link>
        <p className="empty">Інструмент не знайдено.</p>
      </div>
    );
  }

  return (
    <div className="detail">
      <Link to={backTo} className="back-link">← Назад до всіх інструментів</Link>

      <div className="detail-head">
        <h2>{tool.name}</h2>
        <span className={`status status-${statusClass(tool.status)}`}>
          {tool.status}
        </span>
      </div>

      <p className="detail-tagline">{tool.descr_short}</p>

      <div className="tool-tags">
        <span className="tag sector-tag">{tool.sector}</span>
        <span className="tag">{TYPE_LABEL[tool.type] || tool.type}</span>
        <span className="tag origin-tag">{tool.origin}</span>
      </div>

      {tool.needs_review && (
        <p className="review-banner">
          ⚠ Публічні докази слабкі — запис потребує перевірки.
        </p>
      )}

      <p className="detail-desc">{tool.description}</p>

      <dl className="detail-meta">
        <dt>Цільові користувачі</dt>
        <dd>{tool.target_users}</dd>
        <dt>Доступ</dt>
        <dd>{tool.access}</dd>
        <dt>Стадія (як вказано)</dt>
        <dd>{tool.maturity}</dd>
        {tool.why_included && (
          <>
            <dt>Чому включено</dt>
            <dd>{tool.why_included}</dd>
          </>
        )}
        {tool.notes && (
          <>
            <dt>Нотатки</dt>
            <dd>{tool.notes}</dd>
          </>
        )}
      </dl>

      {tool.url && (
        <a className="detail-visit" href={tool.url} target="_blank" rel="noreferrer">
          Перейти на сайт ↗
        </a>
      )}

      {tool.sources?.length > 0 && (
        <div className="sources">
          <h3>Джерела</h3>
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
