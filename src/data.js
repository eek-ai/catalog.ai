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
// directly — no keyword heuristics. The file holds published entries only;
// borderline/excluded live in the pipeline's DB and never reach the site.
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

// English labels for the controlled vocabularies (sector/status/origin),
// keyed by the canonical Ukrainian value. UK renders the value as-is; EN maps
// through here. Values are language-neutral concepts, so this is a plain lookup
// — entry content (names, descriptions, taglines) stays Ukrainian.
const VOCAB_EN = {
  // sectors
  "Оборона та безпека": "Defense & security",
  "Бізнес та продажі": "Business & sales",
  "Державний сектор": "Government",
  "Інфраструктура та платформи": "Infrastructure & platforms",
  "Право": "Legal",
  "Медицина та здоров'я": "Healthcare",
  "Медіа та інформаційна безпека": "Media & information security",
  "Освіта": "Education",
  "Голос і мовлення": "Voice & speech",
  "Інше": "Other",
  "Маркетинг та реклама": "Marketing & advertising",
  "Генеративний контент": "Generative content",
  // statuses
  "Працює": "Live",
  "Пілот": "Pilot",
  "У розробці": "In development",
  "Анонсовано": "Announced",
  "Невідомо": "Unknown",
  // origins
  "Українська": "Ukrainian",
  "Ukraine-linked": "Ukraine-linked",
  "Іноземна, орієнтована на Україну": "Foreign, Ukraine-focused",
};

// Display label for a vocabulary value. Unknown values fall back to the raw
// Ukrainian text, so new data never renders blank.
export const vocabLabel = (value, lang) =>
  lang === "en" ? VOCAB_EN[value] ?? value : value;

// Origin is long; show a compact label in chips/cards/rail.
export const originShort = (o, lang) => {
  if (o && o.startsWith("Іноземна")) return lang === "en" ? "Foreign" : "Іноземна";
  return vocabLabel(o, lang);
};

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
