const hitKey = ({ file, kind, text }) => `${file}\t${kind}\t${text}`;

export function findNewEnglishHits(hits, baseline) {
  const known = new Set(baseline.map(hitKey));
  return hits.filter((hit) => !known.has(hitKey(hit))).sort((a, b) => hitKey(a).localeCompare(hitKey(b)));
}

export function findResolvedEnglishHits(hits, baseline) {
  const current = new Set(hits.map(hitKey));
  return baseline.filter((hit) => !current.has(hitKey(hit))).sort((a, b) => hitKey(a).localeCompare(hitKey(b)));
}
