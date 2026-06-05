import { Routes, Route, Link, useSearchParams } from "react-router-dom";
import ListPage from "./pages/ListPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import { useLang } from "./i18n.jsx";

function LangToggle() {
  const { lang, setLang } = useLang();
  const options = [
    { id: "uk", label: "UA", title: "Українська" },
    { id: "en", label: "EN", title: "English" },
  ];

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {options.map((option) => (
        <button
          key={option.id}
          className={lang === option.id ? "active" : ""}
          onClick={() => setLang(option.id)}
          aria-pressed={lang === option.id}
          title={option.title}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const { t } = useLang();
  // All filter state lives in the URL: `type` (single, default "tool"),
  // `q` (search), and multi-value `sector`/`status`/`origin`. Shareable,
  // survives refresh, restored when navigating back from a detail page.
  const [sp, setSp] = useSearchParams();

  const filters = {
    type: sp.get("type") || "tool",
    q: sp.get("q") || "",
    sector: sp.getAll("sector"),
    status: sp.getAll("status"),
    origin: sp.getAll("origin"),
    showAll: sp.get("showAll") === "true",
  };

  const update = (mut) =>
    setSp(
      (prev) => {
        const n = new URLSearchParams(prev);
        mut(n);
        return n;
      },
      { replace: true }
    );

  filters.setType = (t) => update((n) => (t === "tool" ? n.delete("type") : n.set("type", t)));
  filters.setQuery = (v) => update((n) => (v ? n.set("q", v) : n.delete("q")));
  filters.remove = (key, val) =>
    update((n) => {
      if (key === "q") {
        n.delete("q");
        return;
      }

      const cur = n.getAll(key);
      n.delete(key);
      cur.filter((x) => x !== val).forEach((v) => n.append(key, v));
    });
  filters.toggle = (key, val) =>
    update((n) => {
      const cur = n.getAll(key);
      n.delete(key);
      (cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]).forEach((v) =>
        n.append(key, v)
      );
    });
  filters.clearAll = () =>
    setSp(
      {
        ...(filters.type === "tool" ? {} : { type: filters.type }),
        ...(filters.showAll ? { showAll: "true" } : {}),
      },
      { replace: true }
    );

  return (
    <div className="app">
      <header className="header">
        <div>
          <Link to="/" className="header-link">
            <h1>{t("title")}</h1>
          </Link>
          <p className="subtitle">{t("subtitle")}</p>
        </div>
        <LangToggle />
      </header>

      <Routes>
        <Route path="/" element={<ListPage filters={filters} />} />
        <Route path="/tool/:id" element={<DetailPage />} />
      </Routes>
    </div>
  );
}
