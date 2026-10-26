import raw from "./data/data.json" with { type: "json" };

const browsePaths = ["/", "/model", "/company", "/en", "/en/model", "/en/company"];
const detailPaths = raw.tools.flatMap(({ slug }) => [`/tool/${slug}`, `/en/tool/${slug}`]);

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
