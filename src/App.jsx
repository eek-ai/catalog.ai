import { Routes, Route, Link, useSearchParams } from "react-router-dom";
import ListPage from "./pages/ListPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";

export default function App() {
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
  filters.toggle = (key, val) =>
    update((n) => {
      const cur = n.getAll(key);
      n.delete(key);
      (cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]).forEach((v) =>
        n.append(key, v)
      );
    });
  filters.clearAll = () =>
    setSp(filters.type === "tool" ? {} : { type: filters.type }, { replace: true });

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="header-link">
          <h1>Українські AI-інструменти</h1>
        </Link>
        <p className="subtitle">
          Каталог AI-продуктів і платформ, створених в Україні або для України.
        </p>
      </header>

      <Routes>
        <Route path="/" element={<ListPage filters={filters} />} />
        <Route path="/tool/:id" element={<DetailPage />} />
      </Routes>
    </div>
  );
}
