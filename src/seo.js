export const SITE_ORIGIN = "https://catalog.ai.ua";
const EN_PREFIX = /^\/en(?=\/|$)/;

export function canonicalUrl(pathname) {
  return new URL(pathname, SITE_ORIGIN).href;
}

export function pageMetadata({ title, description, canonicalPath }) {
  return [
    { title },
    { name: "description", content: description },
    ...(canonicalPath
      ? [{ tagName: "link", rel: "canonical", href: canonicalUrl(canonicalPath) }]
      : []),
  ];
}

export function errorMetadata({ title, description }) {
  return [...pageMetadata({ title, description }), { name: "robots", content: "noindex" }];
}

export function canonicalBrowsePath(type) {
  if (type === "company") return "/company/";
  if (type === "platform") return "/platform/";
  return "/";
}

export function canonicalDetailPath(id) {
  return `/tool/${id}/`;
}

export function pathForLang(pathname, lang) {
  const bare = pathname.replace(EN_PREFIX, "") || "/";
  const path = bare.endsWith("/") ? bare : `${bare}/`;
  return lang === "en" ? `/en${path}` : path;
}
