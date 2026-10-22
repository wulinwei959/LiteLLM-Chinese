// Put a translator hook at the top of the named functions' bodies.
//
// The upstream sync brought in components that were never translated. Wiring
// them one file at a time means adding the same hook to several functions in
// each file, and a text-level insertion lands inside a destructured parameter
// list often enough to matter. The parser knows where a body starts.
//
// Usage: node scripts/add-i18n-hooks.mjs <file> <namespace> <function> [...]

import { readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const [file, namespace, ...names] = process.argv.slice(2);
if (!file || !namespace || names.length === 0) {
  process.stderr.write("usage: node scripts/add-i18n-hooks.mjs <file> <namespace> <function> [...]\n");
  process.exit(2);
}

const source = readFileSync(file, "utf8");
const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const hook = `  const t = useTranslations("${namespace}");`;
const cuts = [];

const isFunctionValue = (node) => ts.isArrowFunction(node) || ts.isFunctionExpression(node);

const isNamedFunctionValue = (node) => {
  const isDeclaration = ts.isVariableDeclaration(node);
  const hasName = isDeclaration && ts.isIdentifier(node.name);
  const hasInitializer = hasName && Boolean(node.initializer);
  return hasInitializer && isFunctionValue(node.initializer);
};

const nameOf = (node) => {
  if (isNamedFunctionValue(node)) {
    return node.name.text;
  }
  if (node.name && ts.isIdentifier(node.name)) {
    return node.name.text;
  }
  return null;
};

const bodyOf = (node) => {
  if (isNamedFunctionValue(node)) {
    return node.initializer.body;
  }
  return node.body;
};

const isTranslatorDeclaration = (declaration) => {
  const isNamed = ts.isIdentifier(declaration.name);
  const isT = isNamed && declaration.name.text === "t";
  const hasInitializer = Boolean(declaration.initializer);
  const isCall = hasInitializer && ts.isCallExpression(declaration.initializer);
  const isUseTranslations =
    isCall &&
    ts.isIdentifier(declaration.initializer.expression) &&
    declaration.initializer.expression.text === "useTranslations";
  return isT && isUseTranslations;
};

const hasHook = (body) =>
  body.statements.some(
    (statement) =>
      ts.isVariableStatement(statement) && statement.declarationList.declarations.some(isTranslatorDeclaration),
  );

const visit = (node) => {
  const name = nameOf(node);
  const body = bodyOf(node);
  const wanted = name !== null && names.includes(name);
  const block = body !== undefined && ts.isBlock(body);
  if (!wanted || !block) {
    ts.forEachChild(node, visit);
    return;
  }
  if (!hasHook(body)) {
    cuts.push({ at: body.getStart(tree) + 1, text: `\n${hook}` });
  }
  ts.forEachChild(node, visit);
};
visit(tree);

if (cuts.length === 0) {
  process.stdout.write(`${file}: no hook added\n`);
  process.exit(0);
}

let out = source;
for (const cut of cuts.sort((a, b) => b.at - a.at)) {
  out = out.slice(0, cut.at) + cut.text + out.slice(cut.at);
}
if (!/import \{ useTranslations \} from "next-intl";/.test(out)) {
  const match = out.match(/^import .*\n/m);
  if (match) {
    out = out.slice(0, match.index) + `import { useTranslations } from "next-intl";\n` + out.slice(match.index);
  }
}
writeFileSync(file, out, "utf8");
process.stdout.write(`${file}: added ${cuts.length} hooks\n`);
