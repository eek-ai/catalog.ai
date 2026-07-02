import raw from "../data/data.json";

// Keep Unicode letters/digits so all-Cyrillic names still get a usable slug
// (a Latin-only filter left names like "Помічник ветерана (Львів)" empty,
// breaking their detail-page link).
const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");

// `sector`, `type`, `status`, `origin`, `needs_review` are authoritative fields
// in the data file (see ai-workflows/data/schema.json). The dashboard reads them
// directly — no keyword heuristics. `borderline`/`excluded` stay in the file
// but are intentionally not surfaced in the UI.
export const tools = raw.tools.map((t) => ({ ...t, id: slug(t.name) }));

export const getTool = (id) => tools.find((t) => t.id === id);

// Type tabs (the primary axis), in order. `tool` is the default tab.
// Labels are translated in the UI (see i18n.jsx).
export const types = ["tool", "company", "platform"];

// Facet value lists. Sectors are ordered by overall frequency (stable);
// statuses/origins follow schema.json order.
const sectorTotals = {};
for (const t of tools) sectorTotals[t.sector] = (sectorTotals[t.sector] || 0) + 1;
export const sectors = [...new Set(tools.map((t) => t.sector))].sort(
  (a, b) => sectorTotals[b] - sectorTotals[a]
);

export const origins = ["Українська", "Ukraine-linked", "Іноземна, орієнтована на Україну"];

// Origin is long; show a compact label in chips/cards/rail.
export const originShort = (o) => (o && o.startsWith("Іноземна") ? "Іноземна" : o);

// Canonical status order (matches schema.json) + a stable CSS class per status,
// so the coloured badges don't depend on the Ukrainian text.
export const statuses = ["Працює", "Пілот", "У розробці", "Анонсовано", "Невідомо"];

const STATUS_CLASS = {
  "Працює": "live",
  "Пілот": "pilot",
  "У розробці": "in-development",
  "Анонсовано": "announced",
  "Невідомо": "other",
};
export const statusClass = (s) => STATUS_CLASS[s] || "other";

const SECTOR_CLASS = {
  "Оборона та безпека": "defense",
  "Бізнес та продажі": "business",
  "Державний сектор": "government",
  "Інфраструктура та платформи": "infrastructure",
  "Право": "legal",
  "Медицина та здоров'я": "health",
  "Медіа та інформаційна безпека": "media",
  "Освіта": "education",
  "Голос і мовлення": "voice",
  "Інше": "other",
  "Маркетинг та реклама": "marketing",
  "Генеративний контент": "creative",
};
export const sectorClass = (s) => SECTOR_CLASS[s] || "other";
