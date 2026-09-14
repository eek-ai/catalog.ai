const UKRAINIAN = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
};

const POSITIONAL = {
  є: ["ye", "ie"],
  ї: ["yi", "i"],
  й: ["y", "i"],
  ю: ["yu", "iu"],
  я: ["ya", "ia"],
};

const APOSTROPHES = new Set(["'", "’", "ʼ"]);

export function legacySlugify(name) {
  return name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
}

export function transliterateUkrainian(value) {
  const chars = [...value.toLowerCase()];
  let result = "";
  let wordStart = true;

  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index];

    if (char === "з" && chars[index + 1] === "г") {
      result += "zgh";
      wordStart = false;
      index += 1;
      continue;
    }

    if (char in POSITIONAL) {
      result += POSITIONAL[char][wordStart ? 0 : 1];
      wordStart = false;
      continue;
    }

    if (char in UKRAINIAN) {
      result += UKRAINIAN[char];
      if (char !== "ь") wordStart = false;
      continue;
    }

    if (APOSTROPHES.has(char)) continue;
    if (/[^\x00-\x7f]/u.test(char) && /\p{L}/u.test(char)) {
      throw new Error(`Unsupported letter in catalog slug: ${char}`);
    }

    result += char;
    wordStart = !/[a-z0-9]/.test(char);
  }

  return result;
}

export function slugify(name) {
  const legacyId = legacySlugify(name);
  if (/^[a-z0-9-]+$/.test(legacyId)) return legacyId;

  return transliterateUkrainian(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function addEntrySlugs(entries) {
  const withSlugs = entries.map((entry) => ({
    ...entry,
    id: slugify(entry.name),
    legacyId: legacySlugify(entry.name),
  }));
  const namesById = new Map();

  for (const entry of withSlugs) {
    if (!entry.id) throw new Error(`Empty slug for catalog entry: ${entry.name}`);

    for (const id of new Set([entry.id, entry.legacyId])) {
      if (namesById.has(id)) {
        const duplicate = namesById.get(id);
        throw new Error(`Duplicate catalog slug "${id}" for "${duplicate}" and "${entry.name}"`);
      }
      namesById.set(id, entry.name);
    }
  }

  return withSlugs;
}
