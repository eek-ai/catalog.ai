import raw from "./data/data.json" with { type: "json" };
import { addEntrySlugs } from "./src/slug.js";

const browsePaths = ["/", "/company", "/platform", "/en", "/en/company", "/en/platform"];
const detailPaths = addEntrySlugs(raw.tools).flatMap(({ id, legacyId }) =>
  [...new Set([id, legacyId])].flatMap((slug) => [`/tool/${slug}`, `/en/tool/${slug}`])
);

export default {
  appDirectory: "src",
  buildDirectory: "build",
  ssr: false,
  routeDiscovery: { mode: "initial" },
  prerender: {
    paths: [...browsePaths, ...detailPaths],
    concurrency: 4,
  },
};
