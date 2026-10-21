// Give every function that calls a translator its own hook.
//
// The upstream sync rebuilt translated files against upstream's newer
// structure, and some of the functions that call `t(...)` lost the hook that
// binds the translator to a namespace. This finds those functions with the
// TypeScript parser and inserts the hook at the top of their body.
//
// Usage: node scripts/add-translator-hooks.mjs <file> <namespace>

import { readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const [file, namespace] = process.argv.slice(2);
if (!file || !namespace) {
  console.error("usage: node scripts/add-translator-hooks.mjs <file> <namespace>");
  process.exit(2);
}

const source = readFileSync(file, "utf8");
const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

const hook = `\n  const t = useTranslations("${namespace}");\n`;

/** Every function-like node whose body calls `t(...)`. */
const targets = [];

const visit = (node) => {
  if (
    (ts.isFunctionDeclaration(node) ||
      ts.isFunctionExpression(node) ||
      ts.isArrowFunction(node) ||
      ts.isMethodDeclaration(node)) &&
    node.body &&
    ts.isBlock(node.body)
  ) {
    let calls = false;
    let declares = false;
    const scan = (child) => {
      if (ts.isCallExpression(child) && ts.isIdentifier(child.expression) && child.expression.text === "t") {
        calls = true;
      }
      if (
        ts.isVariableDeclaration(child) &&
        ts.isIdentifier(child.name) &&
        child.name.text === "t" &&
        child.initializer &&
        ts.isCallExpression(child.initializer) &&
        ts.isIdentifier(child.initializer.expression) &&
        child.initializer.expression.text === "useTranslations"
      ) {
        declares = true;
      }
      ts.forEachChild(child, scan);
    };
    scan(node.body);
    if (calls && !declares) {
      targets.push(node.body);
    }
  }
  ts.forEachChild(node, visit);
};
visit(tree);

if (targets.length === 0) {
  console.log(`${file}: no function needs a hook`);
  process.exit(0);
}

// Insert from the bottom up so the earlier offsets stay valid.
const insertions = targets
  .map((body) => body.getStart(tree) + 1)
  .sort((a, b) => b - a);

let out = source;
for (const at of insertions) {
  out = out.slice(0, at) + hook + out.slice(at);
}

writeFileSync(file, out, "utf8");
console.log(`${file}: added ${insertions.length} hooks`);
