import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { findNewEnglishHits, findResolvedEnglishHits } from "./english-leaks-lib.mjs";
import { scanSource } from "./english-scan-lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DASHBOARD_ROOT = join(HERE, "..");
const BASELINE_PATH = join(DASHBOARD_ROOT, "english-leaks-baseline.json");
const writeBaseline = process.argv.includes("--write");

const SCANNABLE_FILE = /^src\/.*\.(ts|tsx)$/;
const EXCLUDED_FILE = /\.(test|test-d)\.(ts|tsx)$|\.d\.ts$/;
const isScannable = (file) => SCANNABLE_FILE.test(file) && !EXCLUDED_FILE.test(file);

const files = execFileSync("git", ["ls-files", "-z"], { cwd: DASHBOARD_ROOT, encoding: "utf-8" })
  .split("\0")
  .filter(isScannable);

const hits = files
  .flatMap((file) =>
    scanSource(file, readFileSync(join(DASHBOARD_ROOT, file), "utf-8")).map((hit) => ({ file, ...hit })),
  )
  .map(({ file, kind, text }) => ({ file, kind, text }))
  .sort((a, b) => `${a.file}\t${a.kind}\t${a.text}`.localeCompare(`${b.file}\t${b.kind}\t${b.text}`));

if (writeBaseline) {
  writeFileSync(BASELINE_PATH, `${JSON.stringify({ hits }, null, 2)}\n`, "utf-8");
  process.stderr.write(`english-leaks-baseline.json rewritten with ${hits.length} entries.\n`);
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf-8")).hits;
const added = findNewEnglishHits(hits, baseline);
const resolved = findResolvedEnglishHits(hits, baseline);

process.stderr.write(`english hits: ${hits.length} | baseline: ${baseline.length}\n`);

if (resolved.length > 0) {
  process.stderr.write(`${resolved.length} baseline entries are no longer present:\n`);
  for (const hit of resolved) process.stderr.write(`  resolved: ${hit.file} (${hit.kind}) ${hit.text}\n`);
}

if (added.length > 0) {
  const repoPrefix = execFileSync("git", ["rev-parse", "--show-prefix"], {
    cwd: DASHBOARD_ROOT,
    encoding: "utf-8",
  }).trim();
  for (const hit of added) {
    process.stdout.write(
      `::error file=${repoPrefix}${hit.file}::New English display string (${hit.kind}): ${hit.text}\n`,
    );
  }
  process.stderr.write(`${added.length} new English display strings. Translate them or add them to the baseline.\n`);
  process.exit(1);
}

if (resolved.length > 0) {
  process.stderr.write("english-leaks-baseline.json is stale. Re-run with --write to refresh it.\n");
  process.exit(1);
}
