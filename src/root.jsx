import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteError,
} from "react-router";
import App from "./App.jsx";
import {
  getLangFromPath,
  LangProvider,
  textForLang,
  titleForLang,
  useLang,
} from "./i18n.jsx";
import { errorMetadata, pageMetadata } from "./seo.js";
import stylesheet from "./styles.css?url";

export function meta({ error, location }) {
  const lang = getLangFromPath(location.pathname);
  if (error) {
    const notFound = isRouteErrorResponse(error) && error.status === 404;
    return errorMetadata({
      title: textForLang(lang, notFound ? "page_not_found" : "error_title"),
      description: textForLang(lang, notFound ? "page_not_found_message" : "error_message"),
    });
  }

  return pageMetadata({
    title: titleForLang(lang),
    description: textForLang(lang, "subtitle"),
  });
}

export function links() {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "icon", type: "image/png", href: "/favicon.ico" },
  ];
}

export function Layout({ children }) {
  const location = useLocation();
  const lang = getLangFromPath(location.pathname);

  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-M1XRSX7FKQ" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-M1XRSX7FKQ');",
          }}
        />
      </head>
      <body>
        <LangProvider lang={lang}>
          {children}
        </LangProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <App />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { lang, t } = useLang();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const title = notFound ? t("page_not_found") : t("error_title");
  const message = notFound ? t("page_not_found_message") : t("error_message");

  return (
    <App>
      <main className="error-page">
        <h1>{notFound ? "404" : title}</h1>
        <p>{message}</p>
        <Link to={lang === "en" ? "/en/" : "/"}>{t("home")}</Link>
      </main>
    </App>
  );
}
