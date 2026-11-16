import raw from "../data/data.json" with { type: "json" };

const entries = raw.tools.map((entry) => ({ ...entry, id: entry.slug })).sort(
  (a, b) => (b.rating ?? -1) - (a.rating ?? -1) || a.name.localeCompare(b.name, "uk")
);

// Only these fields reach page payloads; sources, notes, research and ratings stay internal.
const PUBLIC_FIELDS = [
  "id",
  "name",
  "url",
  "type",
  "descr_short",
  "sector",
  "origin",
  "description",
  "target_users",
  "access",
  "maturity",
  "status",
];

const publicEntry = (entry) =>
  Object.fromEntries(PUBLIC_FIELDS.filter((field) => field in entry).map((field) => [field, entry[field]]));

const listingEntries = entries.map(publicEntry);

const sectorTotals = {};
for (const entry of entries) sectorTotals[entry.sector] = (sectorTotals[entry.sector] || 0) + 1;

const sectors = [...new Set(entries.map((entry) => entry.sector))].sort(
  (a, b) => sectorTotals[b] - sectorTotals[a]
);

const typeCounts = Object.fromEntries(
  ["tool", "model", "company"].map((type) => [
    type,
    entries.filter((entry) => entry.type === type).length,
  ])
);

export function getListingData() {
  return { entries: listingEntries, sectors, typeCounts };
}

export function getEntry(id) {
  const entry = entries.find((candidate) => candidate.id === id);
  return entry ? publicEntry(entry) : null;
}
