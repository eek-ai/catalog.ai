import { createContext, useContext, useEffect, useState } from "react";

// UI chrome only. Catalog content (sector/status/origin values, descriptions,
// taglines) stays Ukrainian by design.
const STRINGS = {
  uk: {
    title: "Українські AI-інструменти",
    subtitle: "Каталог AI-продуктів і платформ, створених в Україні або для України.",
    tab_tool: "Інструменти",
    tab_company: "Компанії",
    tab_platform: "Платформи",
    type_tool: "Інструмент",
    type_company: "Компанія",
    type_platform: "Платформа",
    facet_sector: "Сектор",
    facet_status: "Статус",
    facet_origin: "Походження",
    search_placeholder: "Пошук за назвою, описом, користувачами…",
    clear_search: "Очистити пошук",
    clear_all: "Очистити все",
    remove_filter: "Прибрати фільтр",
    details: "Детальніше →",
    unverified: "⚠ неперевірено",
    unverified_title: "Докази слабкі — потребує перевірки",
    sources_title: "Кількість джерел",
    empty: "Немає інструментів за вашими фільтрами.",
    back: "← Назад до всіх інструментів",
    meta_users: "Цільові користувачі",
    meta_access: "Доступ",
    meta_stage: "Стадія (як вказано)",
    meta_why: "Чому включено",
    meta_notes: "Нотатки",
    review_banner: "⚠ Публічні докази слабкі — запис потребує перевірки.",
    visit: "Перейти на сайт ↗",
    sources: "Джерела",
    not_found: "Інструмент не знайдено.",
  },
  en: {
    title: "Ukrainian AI Tools",
    subtitle: "A catalog of AI products and platforms built in or for Ukraine.",
    tab_tool: "Tools",
    tab_company: "Companies",
    tab_platform: "Platforms",
    type_tool: "Tool",
    type_company: "Company",
    type_platform: "Platform",
    facet_sector: "Sector",
    facet_status: "Status",
    facet_origin: "Origin",
    search_placeholder: "Search by name, description, users…",
    clear_search: "Clear search",
    clear_all: "Clear all",
    remove_filter: "Remove filter",
    details: "Details →",
    unverified: "⚠ unverified",
    unverified_title: "Weak evidence — needs review",
    sources_title: "Number of sources",
    empty: "No tools match your filters.",
    back: "← Back to all tools",
    meta_users: "Target users",
    meta_access: "Access",
    meta_stage: "Stage (as stated)",
    meta_why: "Why included",
    meta_notes: "Notes",
    review_banner: "⚠ Public evidence is weak — this entry needs review.",
    visit: "Visit site ↗",
    sources: "Sources",
    not_found: "Tool not found.",
  },
};

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "uk");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.title = STRINGS[lang].title;
  }, [lang]);

  const t = (key) => STRINGS[lang]?.[key] ?? key;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

// Count + noun, language-aware (Ukrainian has plural rules; English is simple).
export function countLabel(n, lang) {
  if (lang === "en") return `${n} ${n === 1 ? "tool" : "tools"}`;
  const m10 = n % 10;
  const m100 = n % 100;
  let noun = "інструментів";
  if (m10 === 1 && m100 !== 11) noun = "інструмент";
  else if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) noun = "інструменти";
  return `${n} ${noun}`;
}
