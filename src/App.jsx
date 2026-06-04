import { Routes, Route, Link, useSearchParams } from "react-router-dom";
import ListPage from "./pages/ListPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";

export default function App() {
  // Filter state lives in the URL query string, so a filtered view is
  // shareable, survives a refresh, and is restored when navigating back from
  // a tool's detail page. `replace` keeps each keystroke out of history.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const sector = searchParams.get("sector");
  const status = searchParams.get("status");

  const setFilter = (key, value) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );
  const resetFilters = () => setSearchParams({}, { replace: true });

  const filters = { query, sector, status, setFilter, resetFilters };

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
