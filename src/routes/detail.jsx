import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { getEntry } from "../data.server.js";
import { getLangFromPath, textForLang, titleForLang } from "../i18n.jsx";
import DetailPage from "../pages/DetailPage.jsx";
import { canonicalDetailPath, pageMetadata } from "../seo.js";

export function loader({ params }) {
  const tool = getEntry(params.id);
  if (!tool) throw new Response("Not Found", { status: 404 });
  return { tool };
}

export function meta({ loaderData, location }) {
  const lang = getLangFromPath(location.pathname);
  const tool = loaderData?.tool;

  if (!tool) {
    return pageMetadata({
      title: textForLang(lang, "not_found"),
      description: textForLang(lang, "subtitle"),
    });
  }

  return pageMetadata({
    title: `${tool.name} — ${titleForLang(lang)}`,
    description: tool.descr_short,
    canonicalPath: canonicalDetailPath(tool.id),
  });
}

export default function DetailRoute({ loaderData }) {
  const { id } = useParams();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (id === loaderData.tool.id) return;

    const prefix = pathname.startsWith("/en/") ? "/en" : "";
    navigate(
      {
        pathname: `${prefix}${canonicalDetailPath(loaderData.tool.id)}`,
        search,
        hash,
      },
      { replace: true }
    );
  }, [hash, id, loaderData.tool.id, navigate, pathname, search]);

  return <DetailPage tool={loaderData.tool} />;
}
