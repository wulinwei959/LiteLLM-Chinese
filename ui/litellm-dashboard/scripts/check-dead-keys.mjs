import { spawnSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import {
  findNewDeadKeys,
  findResolvedDeadKeys,
  parseDeadKeysOutput,
  selectPythonInterpreter,
} from "./dead-key-lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DASHBOARD_ROOT = join(HERE, "..");
const BASELINE_PATH = join(DASHBOARD_ROOT, "dead-keys-baseline.json");
const writeBaseline = process.argv.includes("--write");

const python = selectPythonInterpreter(
  (candidate) => spawnSync(candidate, ["--version"], { stdio: "ignore" }).status === 0,
);

if (python === null) {
  process.stderr.write("dead-keys.py needs Python 3 on PATH as python3 or python.\n");
  process.exit(1);
}

const scanner = spawnSync(python, [join(HERE, "dead-keys.py")], {
  cwd: DASHBOARD_ROOT,
  encoding: "utf-8",
});

if (scanner.status !== 0) {
  console.error(scanner.stderr || "dead-keys.py failed to run");
  process.exit(1);
}

const dead = parseDeadKeysOutput(scanner.stdout);
const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf-8")).deadKeys;
const added = findNewDeadKeys(dead, baseline);
const resolved = findResolvedDeadKeys(dead, baseline);

console.warn(`dead keys: ${dead.length} | baseline: ${baseline.length}`);

if (resolved.length > 0) {
  console.warn(`::notice::${resolved.length} baseline entries are no longer dead:`);
  for (const key of resolved) console.warn(`  resolved: ${key}`);
}

if (writeBaseline) {
  writeFileSync(BASELINE_PATH, `${JSON.stringify({ deadKeys: dead }, null, 2)}\n`, "utf-8");
  console.warn(`dead-keys-baseline.json rewritten with ${dead.length} entries.`);
  process.exit(0);
}

if (added.length > 0) {
  console.error(`::error::${added.length} new dead message keys. Remove them from en.json and zh-CN.json.`);
  for (const key of added) console.error(`  dead: ${key}`);
  process.exit(1);
}

if (resolved.length > 0) {
  console.error("::error::dead-keys-baseline.json is stale. Re-run with --write to refresh it.");
  process.exit(1);
}
