import { useLocation, useSearchParams } from "react-router";
import { getListingData } from "../data.server.js";
import { useHydrated } from "../hydration.js";
import { getLangFromPath, textForLang, titleForLang } from "../i18n.jsx";
import ListPage from "../pages/ListPage.jsx";
import { canonicalBrowsePath, pageMetadata } from "../seo.js";

export function loader() {
  return getListingData();
}

function typeFromPath(pathname) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized.endsWith("/company")) return "company";
  if (normalized.endsWith("/platform")) return "platform";
  return "tool";
}

export function meta({ location }) {
  const lang = getLangFromPath(location.pathname);
  const type = typeFromPath(location.pathname);
  const heading = textForLang(lang, `browse_heading_${type}`);

  return pageMetadata({
    title: type === "tool" ? heading : `${heading} — ${titleForLang(lang)}`,
    description: textForLang(lang, "subtitle"),
    canonicalPath: canonicalBrowsePath(type),
  });
}

export default function BrowseRoute({ loaderData }) {
  const [sp, setSp] = useSearchParams();
  const { pathname } = useLocation();
  const routeType = typeFromPath(pathname);
  const current = useHydrated() ? sp : new URLSearchParams();
  const type = current.get("type") || routeType;

  const update = (mutate) =>
    setSp(
      (previous) => {
        const next = new URLSearchParams(previous);
        mutate(next);
        return next;
      },
      { replace: true }
    );

  const filters = {
    type,
    q: current.get("q") || "",
    sector: current.getAll("sector"),
    status: current.getAll("status"),
    origin: current.getAll("origin"),
    showAll: current.get("showAll") === "true",
    search: current.toString(),
    setQuery: (value) => update((next) => (value ? next.set("q", value) : next.delete("q"))),
    remove: (key, value) =>
      update((next) => {
        if (key === "q") {
          next.delete("q");
          return;
        }

        const current = next.getAll(key);
        next.delete(key);
        current.filter((item) => item !== value).forEach((item) => next.append(key, item));
      }),
    toggle: (key, value) =>
      update((next) => {
        const current = next.getAll(key);
        next.delete(key);
        (current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value]
        ).forEach((item) => next.append(key, item));
      }),
    clearAll: () =>
      setSp(
        {
          ...(type === routeType ? {} : { type }),
          ...(current.get("showAll") === "true" ? { showAll: "true" } : {}),
        },
        { replace: true }
      ),
  };

  return <ListPage filters={filters} {...loaderData} />;
}
