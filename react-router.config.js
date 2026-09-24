import raw from "./data/data.json" with { type: "json" };

const browsePaths = ["/", "/company", "/platform", "/en", "/en/company", "/en/platform"];
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
