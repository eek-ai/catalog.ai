import { Link, Outlet } from "react-router";
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
  const { t, lang } = useLang();
  const home = lang === "en" ? "/en" : "/";

  return (
    <div className="app">
      <header className="header">
        <div>
          <Link to={home} className="header-link" aria-label={t("title")}>
            <img className="header-logo" src="/logo3.png" alt="" aria-hidden="true" />
          </Link>
          <p className="subtitle">{t("subtitle")}</p>
        </div>
        <LangToggle />
      </header>

      <Outlet />

      <footer className="footer">
        <p>
          Контакти: <a href="mailto:info@ai.ua">info@ai.ua</a>
        </p>
      </footer>
    </div>
  );
}
