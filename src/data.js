import raw from "../data/final.json";

// The catalog data is in Ukrainian and the `category` field has ~100
// near-unique values, which is useless for filtering. We collapse each tool
// into one broad sector by keyword-matching its (Ukrainian) category +
// description. First match wins, so order matters.
const SECTOR_RULES = [
  ["Оборона", ["оборон", "дрон", "бпла", "військ", "бойов", "ракет", "безпілот", "перехоплюв", "артилер", "радіоелектрон", "акустичн", "розвідуваль", "defense"]],
  ["Державний сектор", ["державн", "govtech", "публічного сектор", "публічних послуг", "муніципал", "урядов"]],
  ["Медицина", ["медичн", "здоров", "телемедицин", "діабет", "екг", "пацієнт", "діагност", "лікар", "лаборатор", "ментальн", "health"]],
  ["Право", ["юридичн", "судов", "правов", "комплаєнс", "законодав", "інтелектуальн"]],
  ["Освіта", ["освіт", "навчанн", "школ", "вчител", "lms", "студент", "едтех"]],
  ["Медіа та інформація", ["медіа", "дезінформац", "моніторинг", "наратив", "інфлюенсер", "соцмереж", "osint", "фейк", "інформаційн загроз", "детектор контенту", "narrative", "social media"]],
  ["Голос і мовлення", ["голос", "мовлен", "tts", "телефон", "дзвінк", "озвуч"]],
  ["Генеративні медіа", ["генеративн", "відео", "зображен", "genai"]],
  ["Маркетинг", ["маркетинг", "marketing"]],
  ["Розробка та платформи", ["api", "llm", "rag", "інференс", "gpu", "cloud", "машинн", "мовна модель", "хостинг", "інфраструктур"]],
  ["Бізнес і продажі", ["бізнес", "продаж", "crm", "агент", "автоматизац", "e-commerce", "ecommerce", "enterprise", "корпоратив", "маркетплейс", "клієнт", "рекрут"]],
];

function sectorFor(tool) {
  const haystack = `${tool.category} ${tool.description}`.toLowerCase();
  for (const [sector, keywords] of SECTOR_RULES) {
    if (keywords.some((k) => haystack.includes(k))) return sector;
  }
  return "Інше";
}

// Status labels (also used as filter values). A stable CSS class is mapped
// separately so the coloured badges don't depend on the Ukrainian text.
export const STATUS = { live: "Працює", dev: "У розробці", other: "Інше" };

export const statusClass = (s) =>
  s === STATUS.live ? "live" : s === STATUS.dev ? "in-development" : "other";

// `maturity` has ~60 free-text Ukrainian variants; collapse to three buckets.
// In-development is checked first so "анонсовано/прототип" wins over an
// incidental "активна".
function statusFor(tool) {
  const m = (tool.maturity || "").toLowerCase();
  if (/(розробц|анонсов|прототип|фіналіст|планов)/.test(m)) return STATUS.dev;
  if (/(працює|працююч|запущен|розгорнут|комерційн|впровадж|операційн|стартап|використовується|активн|масштабується|бета|реальн|грант)/.test(m)) return STATUS.live;
  return STATUS.other;
}

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// `borderline` and `excluded` stay in the data file but are intentionally not
// surfaced anywhere in the UI.
export const tools = raw.tools.map((t) => ({
  ...t,
  id: slug(t.name),
  sector: sectorFor(t),
  status: statusFor(t),
}));

export const getTool = (id) => tools.find((t) => t.id === id);

export const sectors = [...new Set(tools.map((t) => t.sector))].sort();

// Ukrainian count + noun, e.g. 1 інструмент, 3 інструменти, 5 інструментів.
export function toolCount(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  let noun = "інструментів";
  if (mod10 === 1 && mod100 !== 11) noun = "інструмент";
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) noun = "інструменти";
  return `${n} ${noun}`;
}
