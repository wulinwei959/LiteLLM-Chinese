import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { findNewKeys, findResolvedKeys, keysWithHan, keysWithoutHan, leafEntries } from "./zh-coverage-lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DASHBOARD_ROOT = join(HERE, "..");
const ZH_FILE = "src/messages/zh-CN.json";
const EN_FILE = "src/messages/en.json";
const BASELINE_PATH = join(DASHBOARD_ROOT, "zh-coverage-baseline.json");
const writeBaseline = process.argv.includes("--write");

const catalog = (file) => leafEntries(JSON.parse(readFileSync(join(DASHBOARD_ROOT, file), "utf-8")));

const untranslated = keysWithoutHan(catalog(ZH_FILE));
const hanInEnglish = keysWithHan(catalog(EN_FILE));

if (writeBaseline) {
  writeFileSync(BASELINE_PATH, `${JSON.stringify({ untranslated, hanInEnglish }, null, 2)}\n`, "utf-8");
  process.stderr.write(
    `zh-coverage-baseline.json rewritten: ${untranslated.length} untranslated, ${hanInEnglish.length} with Chinese in en\n`,
  );
  process.exit(0);
}

const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf-8"));
const newUntranslated = findNewKeys(untranslated, baseline.untranslated);
const newHanInEnglish = findNewKeys(hanInEnglish, baseline.hanInEnglish);
const resolved = [
  ...findResolvedKeys(untranslated, baseline.untranslated),
  ...findResolvedKeys(hanInEnglish, baseline.hanInEnglish),
];

process.stderr.write(
  `zh 未译 ${untranslated.length} | en 夹中文 ${hanInEnglish.length} | 基线 ${baseline.untranslated.length}/${baseline.hanInEnglish.length}\n`,
);

const repoPrefix = execFileSync("git", ["rev-parse", "--show-prefix"], {
  cwd: DASHBOARD_ROOT,
  encoding: "utf-8",
}).trim();

const annotate = (file, keys, label) => {
  for (const key of keys) process.stdout.write(`::error file=${repoPrefix}${file}::${label}: ${key}\n`);
};

annotate(ZH_FILE, newUntranslated, "zh value carries no Chinese");
annotate(EN_FILE, newHanInEnglish, "en value carries Chinese");

const hasNew = newUntranslated.length > 0 || newHanInEnglish.length > 0;
if (hasNew) {
  process.stderr.write("Update the catalogs, or add the key to zh-coverage-baseline.json with a reason.\n");
  process.exit(1);
}

if (resolved.length > 0) {
  for (const key of resolved) process.stderr.write(`  resolved: ${key}\n`);
  process.stderr.write("zh-coverage-baseline.json is stale. Re-run with --write to refresh it.\n");
  process.exit(1);
}
