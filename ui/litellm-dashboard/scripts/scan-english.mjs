// List the English display strings in a set of files.
//
// The upstream sync brought in components that were never translated. This
// walks the given files with the TypeScript parser and prints the strings a
// user can see: JSX text, the props that carry copy, toast messages and thrown
// error text. The output is the work list, not a verdict; every hit still has
// to be classified.
//
// Usage: node scripts/scan-english.mjs <file> [...]

import { readFileSync } from "node:fs";
import ts from "typescript";

const COPY_PROPS = new Set([
  "aria-label",
  "alt",
  "description",
  "emptyText",
  "errorMessage",
  "helperText",
  "hint",
  "label",
  "message",
  "placeholder",
  "sublabel",
  "subtitle",
  "title",
  "tooltip",
]);

const LETTERS = /[A-Za-z]/;
const showAll = process.argv.includes("--all");

for (const file of process.argv.slice(2).filter((argument) => !argument.startsWith("--"))) {
  const source = readFileSync(file, "utf8");
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind);
  const hits = new Map();

  const add = (text, kind) => {
    const value = text.replace(/\s+/g, " ").trim();
    if (!LETTERS.test(value)) return;
    if (/^[a-z0-9_.-]+$/.test(value)) return;
    const key = `${kind}\t${value}`;
    hits.set(key, (hits.get(key) ?? 0) + 1);
  };

  const visit = (node) => {
    if (ts.isJsxText(node)) {
      add(node.getText(), "jsx");
    }
    if (ts.isJsxAttribute(node) && node.initializer && ts.isStringLiteral(node.initializer)) {
      const name = node.name.getText();
      if (COPY_PROPS.has(name)) add(node.initializer.text, `prop:${name}`);
    }
    if (ts.isCallExpression(node)) {
      const text = node.getText();
      if (/^toast\.(success|error|warning|info)\(/.test(text) && node.arguments.length === 1) {
        const first = node.arguments[0];
        if (ts.isStringLiteral(first)) add(first.text, "toast");
      }
    }
    if (ts.isNewExpression(node) && node.arguments.length === 1 && ts.isStringLiteral(node.arguments[0])) {
      add(node.arguments[0].text, "error");
    }
    if (showAll && ts.isStringLiteral(node) && !ts.isJsxAttribute(node.parent)) {
      add(node.text, "string");
    }
    if (showAll && (ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateExpression(node))) {
      const chunks = ts.isTemplateExpression(node)
        ? [node.head.text, ...node.templateSpans.map((span) => span.literal.text)]
        : [node.text];
      for (const chunk of chunks) {
        add(chunk, "template");
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);

  if (hits.size === 0) continue;
  process.stdout.write(`### ${file}\n`);
  for (const [key, count] of [...hits.entries()].sort()) {
    const [kind, value] = key.split("\t");
    process.stdout.write(`${kind}\t${count}\t${value}\n`);
  }
}
