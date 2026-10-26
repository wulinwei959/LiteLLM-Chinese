// List the English display strings in a set of files.
//
// Usage: node scripts/scan-english.mjs <file> [...] [--all] [--json]

import { readFileSync } from "node:fs";

import { scanSource } from "./english-scan-lib.mjs";

const args = process.argv.slice(2);
const all = args.includes("--all");
const json = args.includes("--json");
const files = args.filter((argument) => !argument.startsWith("--"));
const results = [];

for (const file of files) {
  const hits = scanSource(file, readFileSync(file, "utf8"), { all });
  if (hits.length === 0) continue;
  if (json) {
    for (const hit of hits) results.push({ file, ...hit });
    continue;
  }
  process.stdout.write(`### ${file}\n`);
  for (const hit of hits) process.stdout.write(`${hit.kind}\t${hit.count}\t${hit.text}\n`);
}

if (json) process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
