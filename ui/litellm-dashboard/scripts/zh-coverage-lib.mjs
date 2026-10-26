export const HAN = /\p{Script=Han}/u;

export function leafEntries(node, prefix = "") {
  const entries = [];
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") entries.push(...leafEntries(value, path));
    else entries.push([path, String(value)]);
  }
  return entries;
}

const selectKeys = (entries, holds) =>
  entries
    .filter(([, value]) => holds(value))
    .map(([key]) => key)
    .sort();

export const keysWithoutHan = (entries) => selectKeys(entries, (value) => !HAN.test(value));

export const keysWithHan = (entries) => selectKeys(entries, (value) => HAN.test(value));

export function findNewKeys(current, baseline) {
  const known = new Set(baseline);
  return current.filter((key) => !known.has(key));
}

export function findResolvedKeys(current, baseline) {
  const seen = new Set(current);
  return baseline.filter((key) => !seen.has(key));
}
