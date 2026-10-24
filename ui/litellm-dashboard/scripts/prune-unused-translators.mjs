// Drop translator declarations that nothing in their function reads.
//
// The upstream sync left a few module-level helpers with a `const t =
// useTranslations(...)` line they never use. A hook call outside a component
// throws at runtime, so these helpers break the unit tests that call them
// directly.
//
// Usage: node scripts/prune-unused-translators.mjs <file> [...]

import { readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

for (const file of process.argv.slice(2)) {
  const source = readFileSync(file, "utf8");
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const cuts = [];

  const visit = (node) => {
    if (
      (ts.isFunctionDeclaration(node) ||
        ts.isFunctionExpression(node) ||
        ts.isArrowFunction(node)) &&
      node.body &&
      ts.isBlock(node.body)
    ) {
      for (const statement of node.body.statements) {
        if (!ts.isVariableStatement(statement)) continue;
        for (const declaration of statement.declarationList.declarations) {
          if (!ts.isIdentifier(declaration.name)) continue;
          const initializer = declaration.initializer;
          if (
            !initializer ||
            !ts.isCallExpression(initializer) ||
            !ts.isIdentifier(initializer.expression) ||
            initializer.expression.text !== "useTranslations"
          ) {
            continue;
          }
          const name = declaration.name.text;
          let used = false;
          const scan = (child) => {
            if (used) return;
            if (
              ts.isIdentifier(child) &&
              child.text === name &&
              child !== declaration.name &&
              child.getStart() !== declaration.name.getStart()
            ) {
              used = true;
              return;
            }
            ts.forEachChild(child, scan);
          };
          ts.forEachChild(node.body, scan);
          if (!used) {
            cuts.push({ start: statement.getFullStart(), end: statement.getEnd() });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);

  if (cuts.length === 0) {
    process.stdout.write(`${file}: nothing to prune\n`);
    continue;
  }
  let out = source;
  for (const cut of cuts.sort((a, b) => b.start - a.start)) {
    out = out.slice(0, cut.start) + out.slice(cut.end);
  }
  writeFileSync(file, out, "utf8");
  process.stdout.write(`${file}: pruned ${cuts.length} unused translator declarations\n`);
}
