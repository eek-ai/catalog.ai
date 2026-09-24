import { rm, writeFile } from "node:fs/promises";
import raw from "../data/data.json" with { type: "json" };
import {
  canonicalBrowsePath,
  canonicalDetailPath,
  canonicalUrl,
} from "../src/seo.js";

const paths = [
  ...["tool", "company", "platform"].map(canonicalBrowsePath),
  ...raw.tools.map(({ slug }) => canonicalDetailPath(slug)),
];

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paths.map((path) => `  <url><loc>${escapeXml(canonicalUrl(path))}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

const robots = [
  "User-agent: *",
  "Allow: /",
  `Sitemap: ${canonicalUrl("/sitemap.xml")}`,
  "",
].join("\n");

await Promise.all([
  writeFile("build/client/sitemap.xml", sitemap),
  writeFile("build/client/robots.txt", robots),
  rm("build/client/__spa-fallback.html", { force: true }),
]);
