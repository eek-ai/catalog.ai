import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { getEntry } from "../data.server.js";
import DetailPage from "../pages/DetailPage.jsx";

export function loader({ params }) {
  const tool = getEntry(params.id);
  if (!tool) throw new Response("Not Found", { status: 404 });
  return { tool };
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
        pathname: `${prefix}/tool/${loaderData.tool.id}`,
        search,
        hash,
      },
      { replace: true }
    );
  }, [hash, id, loaderData.tool.id, navigate, pathname, search]);

  return <DetailPage tool={loaderData.tool} />;
}
