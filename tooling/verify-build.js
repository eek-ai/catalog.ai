import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import raw from "../data/data.json" with { type: "json" };
import {
  canonicalBrowsePath,
  canonicalDetailPath,
  canonicalUrl,
} from "../src/seo.js";
import { createStaticServer } from "./static-server.js";

const BUILD_ROOT = "build/client";
const entries = raw.tools.map((entry) => ({ ...entry, id: entry.slug }));
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

const escapeText = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll(">", "&gt;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");

const escapeAttribute = escapeText;
const withoutScripts = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

const fileExists = (path) => stat(path).then((value) => value.isFile()).catch(() => false);
const routeFile = (route) =>
  route === "/" ? join(BUILD_ROOT, "index.html") : join(BUILD_ROOT, route.slice(1), "index.html");
const dataPath = (route) => route === "/" ? "/_root.data" : `${route.slice(0, -1)}.data`;
const dataFile = (route) => join(BUILD_ROOT, dataPath(route).slice(1));

const browseRoutes = [
  { route: "/", type: "tool", heading: "Українські AI-інструменти" },
  { route: "/company/", type: "company", heading: "Українські AI-компанії" },
  { route: "/platform/", type: "platform", heading: "Українські AI-платформи" },
  { route: "/en/", type: "tool", heading: "Ukrainian AI Tools" },
  { route: "/en/company/", type: "company", heading: "Ukrainian AI Companies" },
  { route: "/en/platform/", type: "platform", heading: "Ukrainian AI Platforms" },
];

const detailRoutes = entries.flatMap((entry) =>
  ["", "/en"].map((prefix) => ({
    route: `${prefix}/tool/${entry.id}/`,
    entry,
  }))
);

const expectedRoutes = [...browseRoutes, ...detailRoutes];

async function filesWithExtension(directory, extension) {
  const items = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    items.map((item) => {
      const path = join(directory, item.name);
      if (item.isDirectory()) return filesWithExtension(path, extension);
      return item.isFile() && item.name.endsWith(extension) ? [path] : [];
    })
  );
  return nested.flat();
}

function inspectHead(html, canonical, label) {
  const head = html.split("</head>")[0];
  const titles = head.match(/<title>/g) || [];
  const descriptions = head.match(/<meta name="description"/g) || [];
  const canonicals = [...head.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(
    (match) => match[1]
  );

  check(titles.length === 1, `${label}: expected one title, found ${titles.length}`);
  check(descriptions.length === 1, `${label}: expected one description, found ${descriptions.length}`);
  check(canonicals.length === 1, `${label}: expected one canonical, found ${canonicals.length}`);
  check(canonicals[0] === canonical, `${label}: incorrect canonical ${canonicals[0]}`);
}

for (const entry of entries) {
  check(
    typeof entry.id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id),
    `${entry.name}: invalid canonical slug ${JSON.stringify(entry.id)}`
  );
}
check(new Set(entries.map(({ id }) => id)).size === entries.length, "duplicate canonical slugs");

for (const page of browseRoutes) {
  const htmlPath = routeFile(page.route);
  check(await fileExists(htmlPath), `${page.route}: missing HTML`);
  check(await fileExists(dataFile(page.route)), `${page.route}: missing data file`);
  const html = await readFile(htmlPath, "utf8");
  const rendered = withoutScripts(html);
  inspectHead(rendered, canonicalUrl(canonicalBrowsePath(page.type)), page.route);
  check(rendered.includes(`<h1 class="browse-title">${page.heading}</h1>`), `${page.route}: missing h1`);

  const prefix = page.route.startsWith("/en/") ? "/en" : "";
  for (const type of ["tool", "company", "platform"]) {
    check(
      rendered.includes(`href="${prefix}${canonicalBrowsePath(type)}"`),
      `${page.route}: missing ${type} discovery link`
    );
  }
  for (const entry of entries.filter(({ type }) => type === page.type)) {
    check(
      rendered.includes(`href="${prefix}${canonicalDetailPath(entry.id)}"`),
      `${page.route}: missing ${entry.id} detail link`
    );
  }
}

for (const page of detailRoutes) {
  const htmlPath = routeFile(page.route);
  check(await fileExists(htmlPath), `${page.route}: missing HTML`);
  check(await fileExists(dataFile(page.route)), `${page.route}: missing data file`);
  const html = await readFile(htmlPath, "utf8");
  const rendered = withoutScripts(html);
  const { entry } = page;
  inspectHead(rendered, canonicalUrl(canonicalDetailPath(entry.id)), page.route);
  check(rendered.includes(`>${escapeText(entry.name)}</h1>`), `${page.route}: missing name`);
  check(
    rendered.includes(`name="description" content="${escapeAttribute(entry.descr_short)}"`),
    `${page.route}: incorrect description`
  );
  if (entry.deep_research?.date) {
    check(rendered.includes(escapeText(entry.deep_research.date)), `${page.route}: missing research date`);
  }
  if (entry.deep_research?.long_description) {
    for (const paragraph of entry.deep_research.long_description.split(/\n\s*\n/)) {
      check(rendered.includes(escapeText(paragraph)), `${page.route}: missing research paragraph`);
    }
  }
}

const rootHtml = await readFile(join(BUILD_ROOT, "index.html"), "utf8");
const renderedRoot = withoutScripts(rootHtml);
check(rootHtml.includes('"routeDiscovery":{"mode":"initial"}'), "initial route discovery is missing");
check(!rootHtml.includes("/__manifest"), "HTML references a runtime route manifest");

const internalHrefs = [...renderedRoot.matchAll(/href="(\/[^"]+)"/g)].map((match) => match[1]);
check(
  internalHrefs.every((href) => !/^\/(?:en\/)?(?:company|platform|tool\/[^/?#]+)$/.test(href)),
  "root page contains a slashless route link"
);

for (const route of browseRoutes) {
  const payload = await readFile(dataFile(route.route), "utf8");
  check(!payload.includes("long_description"), `${route.route}: listing contains research`);
  check(!payload.includes('"sources"'), `${route.route}: listing contains source arrays`);
  check(!payload.includes('"rating"'), `${route.route}: listing contains ratings`);
}

const assetNames = (await readdir(join(BUILD_ROOT, "assets"))).filter((name) => name.endsWith(".js"));
const clientJavaScript = (
  await Promise.all(assetNames.map((name) => readFile(join(BUILD_ROOT, "assets", name), "utf8")))
).join("\n");
for (const entry of entries.filter(({ deep_research }) => deep_research?.long_description)) {
  const sample = entry.deep_research.long_description.match(/[^"\\\n\r]{60,}/u)?.[0].slice(0, 80);
  if (sample) {
    check(!clientJavaScript.includes(sample), `client JavaScript contains research for ${entry.id}`);
  }
}

const sitemap = await readFile(join(BUILD_ROOT, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedSitemapUrls = [
  ...["tool", "company", "platform"].map((type) => canonicalUrl(canonicalBrowsePath(type))),
  ...entries.map(({ id }) => canonicalUrl(canonicalDetailPath(id))),
];
check(
  JSON.stringify(sitemapUrls) === JSON.stringify(expectedSitemapUrls),
  "sitemap URLs do not match the canonical catalog"
);
check(new Set(sitemapUrls).size === sitemapUrls.length, "sitemap contains duplicate URLs");
check(sitemapUrls.every((url) => /^[\x00-\x7f]+$/.test(url)), "sitemap contains a non-ASCII URL");

const robots = await readFile(join(BUILD_ROOT, "robots.txt"), "utf8");
check(robots.includes(`Sitemap: ${canonicalUrl("/sitemap.xml")}`), "robots.txt has no sitemap");
check((await readFile(join(BUILD_ROOT, "CNAME"), "utf8")).trim() === "catalog.ai.ua", "invalid CNAME");
check(!(await fileExists(join(BUILD_ROOT, "__spa-fallback.html"))), "SPA fallback was published");

const notFoundHtml = await readFile(join(BUILD_ROOT, "404.html"), "utf8");
check(notFoundHtml !== rootHtml, "404.html duplicates the catalog page");
check(!notFoundHtml.includes('rel="canonical"'), "404.html contains a canonical");
check(notFoundHtml.includes('name="robots" content="noindex"'), "404.html is not noindex");
check(!notFoundHtml.includes("<script"), "404.html contains scripts");
check((notFoundHtml.match(/<title>/g) || []).length === 1, "404.html must contain one title");

const htmlFiles = await filesWithExtension(BUILD_ROOT, ".html");
const dataFiles = await filesWithExtension(BUILD_ROOT, ".data");
check(htmlFiles.length === expectedRoutes.length + 1, `unexpected HTML count: ${htmlFiles.length}`);
check(dataFiles.length === expectedRoutes.length, `unexpected data count: ${dataFiles.length}`);

if (failures.length > 0) {
  throw new Error(`Artifact verification failed:\n${failures.slice(0, 30).join("\n")}`);
}

async function mapConcurrent(items, limit, task) {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next];
      next += 1;
      await task(item);
    }
  });
  await Promise.all(workers);
}

const server = createStaticServer(BUILD_ROOT);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;

try {
  await mapConcurrent(expectedRoutes, 24, async ({ route }) => {
    const [htmlResponse, dataResponse] = await Promise.all([
      fetch(origin + encodeURI(route), { redirect: "manual" }),
      fetch(origin + encodeURI(dataPath(route))),
    ]);
    assert.equal(htmlResponse.status, 200, `${route} returned ${htmlResponse.status}`);
    assert.equal(dataResponse.status, 200, `${dataPath(route)} returned ${dataResponse.status}`);
    assert.match(dataResponse.headers.get("content-type") || "", /^text\/x-script/);
    await Promise.all([htmlResponse.arrayBuffer(), dataResponse.arrayBuffer()]);
  });

  const filteredResponse = await fetch(`${origin}/?q=AI`);
  assert.equal(filteredResponse.status, 200, "filtered root URL failed");
  await filteredResponse.arrayBuffer();

  for (const route of expectedRoutes.map(({ route }) => route).filter((route) => route !== "/")) {
    const response = await fetch(origin + encodeURI(route.slice(0, -1)) + "?check=1", {
      redirect: "manual",
    });
    assert.equal(response.status, 301, `${route} slashless request did not redirect`);
    assert.equal(response.headers.get("location"), `${encodeURI(route)}?check=1`);
    await response.arrayBuffer();
  }

  for (const path of ["/missing-page/", "/tool/missing.data"]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 404, `${path} did not return 404`);
    assert.match(await response.text(), /<h1>404<\/h1>/);
  }
} finally {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve()))
  );
}

console.log(
  `Verified ${entries.length} entries, ${expectedRoutes.length} routes, ` +
    `${detailRoutes.length} detail pages, and ${sitemapUrls.length} sitemap URLs.`
);
