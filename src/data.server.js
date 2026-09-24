import raw from "../data/data.json" with { type: "json" };

const entries = raw.tools.map((entry) => ({ ...entry, id: entry.slug })).sort(
  (a, b) => (b.rating ?? -1) - (a.rating ?? -1) || a.name.localeCompare(b.name, "uk")
);

const listingEntries = entries.map(
  ({
    id,
    name,
    type,
    descr_short,
    sector,
    origin,
    description,
    target_users,
    status,
    needs_review,
    sources,
    maturity,
    access,
  }) => ({
    id,
    name,
    type,
    descr_short,
    sector,
    origin,
    description,
    target_users,
    status,
    needs_review,
    sourceCount: sources?.length ?? 0,
    maturity,
    access,
  })
);

const sectorTotals = {};
for (const entry of entries) sectorTotals[entry.sector] = (sectorTotals[entry.sector] || 0) + 1;

const sectors = [...new Set(entries.map((entry) => entry.sector))].sort(
  (a, b) => sectorTotals[b] - sectorTotals[a]
);

const typeCounts = Object.fromEntries(
  ["tool", "company", "platform"].map((type) => [
    type,
    entries.filter((entry) => entry.type === type).length,
  ])
);

export function getListingData() {
  return { entries: listingEntries, sectors, typeCounts };
}

export function getEntry(id) {
  return entries.find((entry) => entry.id === id) ?? null;
}
