import { sectors, STATUS } from "../data.js";

// Stat tiles double as status filters. "Усього" clears the status filter;
// "Працює" / "У розробці" toggle it. "Сектори" is informational only.
export default function StatTiles({ tools, status, onStatus }) {
  const live = tools.filter((t) => t.status === STATUS.live).length;
  const inDev = tools.filter((t) => t.status === STATUS.dev).length;

  const tiles = [
    { label: "Усього інструментів", value: tools.length, status: null },
    { label: STATUS.live, value: live, status: STATUS.live },
    { label: STATUS.dev, value: inDev, status: STATUS.dev },
    { label: "Сектори", value: sectors.length, status: undefined },
  ];

  return (
    <div className="stat-tiles">
      {tiles.map((t) => {
        const clickable = t.status !== undefined;
        const active = clickable && status === t.status;
        return (
          <button
            key={t.label}
            className={`stat-tile${active ? " active" : ""}${clickable ? "" : " static"}`}
            onClick={clickable ? () => onStatus(t.status) : undefined}
            disabled={!clickable}
          >
            <div className="stat-value">{t.value}</div>
            <div className="stat-label">{t.label}</div>
          </button>
        );
      })}
    </div>
  );
}
