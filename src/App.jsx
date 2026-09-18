import { Link, Outlet, useLocation, useMatches } from "react-router";
import { useHydrated } from "./hydration.js";
import { useLang } from "./i18n.jsx";
import { canonicalDetailPath, pathForLang } from "./seo.js";

function LangToggle() {
  const { lang } = useLang();
  const location = useLocation();
  const tool = useMatches().find((match) => match.loaderData?.tool)?.loaderData.tool;
  const hydrated = useHydrated();
  const contentPath = tool
    ? `${lang === "en" ? "/en" : ""}${canonicalDetailPath(tool.id)}`
    : location.pathname;
  const options = [
    { id: "uk", label: "UA", title: "Українська" },
    { id: "en", label: "EN", title: "English" },
  ];

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {options.map((option) => (
        <Link
          key={option.id}
          to={
            pathForLang(contentPath, option.id) +
            (hydrated ? location.search + location.hash : "")
          }
          reloadDocument
          className={lang === option.id ? "active" : ""}
          aria-current={lang === option.id ? "page" : undefined}
          title={option.title}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}

export default function App() {
  const { t, lang } = useLang();
  const home = lang === "en" ? "/en/" : "/";

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
