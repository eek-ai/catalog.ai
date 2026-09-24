import { isRouteErrorResponse } from "react-router";
import { getEntry } from "../data.server.js";
import { getLangFromPath, textForLang, titleForLang } from "../i18n.jsx";
import DetailPage from "../pages/DetailPage.jsx";
import { canonicalDetailPath, errorMetadata, pageMetadata } from "../seo.js";

export function loader({ params }) {
  const tool = getEntry(params.id);
  if (!tool) throw new Response("Not Found", { status: 404 });
  return { tool };
}

export function meta({ error, loaderData, location }) {
  const lang = getLangFromPath(location.pathname);
  const tool = loaderData?.tool;

  if (error || !tool) {
    const notFound = !error || (isRouteErrorResponse(error) && error.status === 404);
    return errorMetadata({
      title: textForLang(lang, notFound ? "page_not_found" : "error_title"),
      description: textForLang(lang, notFound ? "page_not_found_message" : "error_message"),
    });
  }

  return pageMetadata({
    title: `${tool.name} — ${titleForLang(lang)}`,
    description: tool.descr_short,
    canonicalPath: canonicalDetailPath(tool.id),
  });
}

export default function DetailRoute({ loaderData }) {
  return <DetailPage tool={loaderData.tool} />;
}
