// Inventory the non-test `.tsx` files that have no translator hook.
//
// Coverage is counted by the presence of `useTranslations(`/`getTranslations(`,
// which cannot tell "this file has no copy" from "this file has copy nobody
// wired". This walks every non-test `.tsx` without a hook and prints what a
// user could see, so each file gets an entry in the ledger instead of an
// inferred excuse. Two of the categories are blind spots of `scan-english.mjs`:
// copy sitting in an object property (table column defs, config maps) and copy
// sitting in a parameter default.
//
// Usage: node scripts/i18n-file-inventory.mjs [--root=src]

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import ts from "typescript";

const WIRED = /\b(?:useTranslations|getTranslations)\(/;

const VISIBLE_ATTRS = [
  "alt",
  "aria-label",
  "description",
  "emptyText",
  "header",
  "helperText",
  "hint",
  "label",
  "message",
  "placeholder",
  "sublabel",
  "subtitle",
  "title",
  "tooltip",
];

const VISIBLE_KEYS = [...VISIBLE_ATTRS, "content", "heading", "text", "titleText"];

const NON_COPY = /^(@?use client|use strict)$/i;

const isProse = (value) => {
  const text = value.replace(/\s+/g, " ").trim();
  if (!text || NON_COPY.test(text)) return false;
  if (text.includes("://") || text.startsWith("@") || text.includes("/")) return false;
  const tokens = text.split(" ");
  const words = tokens.filter((token) => /^[A-Za-z][A-Za-z'-]*$/.test(token));
  return words.length >= 2 && words.length / tokens.length >= 0.6;
};

const propertyName = (node) => node.name.getText().replace(/^["']|["']$/g, "");

const collect = (source, file) => {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const hits = [];
  const seen = new Set();
  const add = (category, value) => {
    const text = value.replace(/\s+/g, " ").trim();
    if (!/[A-Za-z]/.test(text)) return;
    const key = `${category}\u0000${text}`;
    if (seen.has(key)) return;
    seen.add(key);
    hits.push([category, text]);
  };

  const visit = (node) => {
    if (ts.isJsxText(node)) add("jsx", node.getText());
    if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const name = node.name.getText();
      if (VISIBLE_ATTRS.includes(name)) add(`attr:${name}`, node.initializer.text);
    }
    if (ts.isPropertyAssignment(node) && ts.isStringLiteral(node.initializer)) {
      const name = propertyName(node);
      if (VISIBLE_KEYS.includes(name)) add(`object:${name}`, node.initializer.text);
    }
    if (ts.isParameter(node) && node.initializer && ts.isStringLiteral(node.initializer)) {
      add(`default:${node.name.getText()}`, node.initializer.text);
    }
    if (ts.isCallExpression(node) && /^toast\.(success|error|warning|info)\(/.test(node.getText())) {
      const first = node.arguments[0];
      if (first && ts.isStringLiteral(first)) add("toast", first.text);
    }
    if (ts.isNewExpression(node) && node.arguments.length === 1 && ts.isStringLiteral(node.arguments[0])) {
      add("error", node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
  return hits.filter(([category, text]) => !category.startsWith("object:") || isProse(text));
};

const listTsx = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listTsx(path);
    return entry.name.endsWith(".tsx") && !entry.name.includes(".test.") ? [path] : [];
  });

const root = process.argv.find((argument) => argument.startsWith("--root="))?.slice(7) ?? "src";
const cwd = process.cwd();
const ledger = [];
for (const file of listTsx(join(cwd, root))) {
  const source = readFileSync(file, "utf8");
  if (WIRED.test(source)) continue;
  ledger.push([relative(cwd, file), source.split("\n").length, collect(source, file)]);
}

const silent = ledger.filter(([, , hits]) => hits.length === 0);
const noisy = ledger.filter(([, , hits]) => hits.length > 0);
const report = (text) => process.stdout.write(`${text}\n`);

report(`# 未接入翻译器的非测试 .tsx 清单（自动产出，共 ${ledger.length} 个）`);
report("");
report(`## 有可见文案证据（${noisy.length} 个，逐条判定）`);
report("");
for (const [path, lines, hits] of noisy.sort((a, b) => b[2].length - a[2].length)) {
  report(`- ${path}（${lines} 行）`);
  for (const [category, text] of hits) report(`  - ${category}: ${text.slice(0, 120)}`);
}
report("");
report(`## 四类口径与两个盲区口径均无命中（${silent.length} 个）`);
report("");
for (const [path, lines] of silent.sort((a, b) => a[0].localeCompare(b[0]))) report(`- ${path} (${lines})`);
