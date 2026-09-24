import assert from "node:assert/strict";
import test from "node:test";
import {
  canonicalBrowsePath,
  canonicalDetailPath,
  canonicalUrl,
  errorMetadata,
  pathForLang,
  pageMetadata,
} from "../src/seo.js";

test("builds canonical catalog URLs", () => {
  assert.equal(canonicalUrl(canonicalBrowsePath("tool")), "https://catalog.ai.ua/");
  assert.equal(canonicalUrl(canonicalBrowsePath("company")), "https://catalog.ai.ua/company/");
  assert.equal(canonicalUrl(canonicalDetailPath("khyzhak")), "https://catalog.ai.ua/tool/khyzhak/");
});

test("switches language prefixes without changing the content path", () => {
  assert.equal(pathForLang("/tool/khyzhak", "en"), "/en/tool/khyzhak/");
  assert.equal(pathForLang("/en/company", "uk"), "/company/");
  assert.equal(pathForLang("/en", "uk"), "/");
});

test("omits canonical metadata when no canonical path is provided", () => {
  const metadata = pageMetadata({ title: "Missing", description: "Missing page" });
  assert.equal(metadata.length, 2);
  assert.equal(metadata.some(({ rel }) => rel === "canonical"), false);
});

test("marks error metadata noindex without adding a canonical", () => {
  const metadata = errorMetadata({ title: "Missing", description: "Missing page" });
  assert.equal(metadata.filter(({ title }) => title).length, 1);
  assert.equal(metadata.some(({ rel }) => rel === "canonical"), false);
  assert.deepEqual(metadata.at(-1), { name: "robots", content: "noindex" });
});
