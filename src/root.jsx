import { Links, Meta, Scripts, ScrollRestoration, useLocation } from "react-router";
import App from "./App.jsx";
import { getLangFromPath, LangProvider, textForLang, titleForLang } from "./i18n.jsx";
import { pageMetadata } from "./seo.js";
import stylesheet from "./styles.css?url";

export function meta({ location }) {
  const lang = getLangFromPath(location.pathname);
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

export default function Root() {
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
          <App />
        </LangProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
