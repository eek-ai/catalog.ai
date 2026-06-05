import raw from "../data/data.json";

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// `sector`, `type`, `status`, `origin`, `needs_review` are authoritative fields
// in the data file (see data.local/schema.json). The dashboard reads them
// directly — no keyword heuristics. `borderline`/`excluded` stay in the file
// but are intentionally not surfaced in the UI.
export const tools = raw.tools.map((t) => ({ ...t, id: slug(t.name) }));

export const getTool = (id) => tools.find((t) => t.id === id);

// Type tabs (the primary axis). `tool` is the default tab.
export const types = [
  { id: "tool", label: "Інструменти" },
  { id: "company", label: "Компанії" },
  { id: "platform", label: "Платформи" },
];

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

// Ukrainian count + noun, e.g. 1 інструмент, 3 інструменти, 5 інструментів.
export function toolCount(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  let noun = "інструментів";
  if (mod10 === 1 && mod100 !== 11) noun = "інструмент";
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) noun = "інструменти";
  return `${n} ${noun}`;
}
