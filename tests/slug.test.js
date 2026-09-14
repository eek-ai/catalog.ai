import assert from "node:assert/strict";
import test from "node:test";
import { addEntrySlugs, legacySlugify, slugify, transliterateUkrainian } from "../src/slug.js";

test("preserves existing ASCII slugs", () => {
  assert.equal(slugify("a-Gnostics"), "a-gnostics");
  assert.equal(slugify("YouControl ESG/Profile AI module"), "youcontrol-esg-profile-ai-module");
});

test("transliterates Ukrainian names using the official national system", () => {
  assert.equal(slugify("AI Методист"), "ai-metodyst");
  assert.equal(slugify("Помічник ветерана (Львів)"), "pomichnyk-veterana-lviv");
  assert.equal(slugify("Вільний Відеоперекладач"), "vilnyi-videoperekladach");
  assert.equal(
    transliterateUkrainian("Єдність, Україна, їжак, Юрій, Згурівка, м'який"),
    "yednist, ukraina, yizhak, yurii, zghurivka, miakyi"
  );
});

test("keeps the previous Unicode slug as a compatibility alias", () => {
  const [entry] = addEntrySlugs([{ name: "AI Методист" }]);
  assert.equal(entry.id, "ai-metodyst");
  assert.equal(entry.legacyId, "ai-методист");
  assert.equal(legacySlugify(entry.name), entry.legacyId);
});

test("rejects collisions across canonical and alias IDs", () => {
  assert.throws(
    () => addEntrySlugs([{ name: "ШІ" }, { name: "shi" }]),
    /Duplicate catalog slug "shi"/
  );
});

test("rejects entries with the same name", () => {
  assert.throws(
    () => addEntrySlugs([{ name: "Same name" }, { name: "Same name" }]),
    /Duplicate catalog slug "same-name"/
  );
});

test("rejects an empty slug", () => {
  assert.throws(() => addEntrySlugs([{ name: "---" }]), /Empty slug for catalog entry/);
});
