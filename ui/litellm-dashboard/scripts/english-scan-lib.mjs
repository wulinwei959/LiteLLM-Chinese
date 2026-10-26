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

const scanJsxText = (node, add) => {
  if (ts.isJsxText(node)) add(node.getText(), "jsx");
};

const scanJsxAttribute = (node, add) => {
  if (!ts.isJsxAttribute(node) || !node.initializer || !ts.isStringLiteral(node.initializer)) return;
  const name = node.name.getText();
  if (COPY_PROPS.has(name)) add(node.initializer.text, `prop:${name}`);
};

const scanCall = (node, add) => {
  if (!ts.isCallExpression(node)) return;
  if (!/^toast\.(success|error|warning|info)\(/.test(node.getText()) || node.arguments.length !== 1) return;
  const first = node.arguments[0];
  if (ts.isStringLiteral(first)) add(first.text, "toast");
};

const scanNewExpression = (node, add) => {
  if (!ts.isNewExpression(node) || node.arguments?.length !== 1 || !ts.isStringLiteral(node.arguments[0])) return;
  if (node.expression.getText().endsWith("Error")) add(node.arguments[0].text, "error");
};

const scanWide = (node, add) => {
  if (ts.isStringLiteral(node) && !ts.isJsxAttribute(node.parent)) {
    add(node.text, "string");
  }
  if (ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateExpression(node)) {
    const chunks = ts.isTemplateExpression(node)
      ? [node.head.text, ...node.templateSpans.map((span) => span.literal.text)]
      : [node.text];
    for (const chunk of chunks) add(chunk, "template");
  }
};

export function scanSource(file, source, { all = false } = {}) {
  const scriptKind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind);
  const hits = new Map();

  const add = (text, kind) => {
    const value = text.replace(/\s+/g, " ").trim();
    if (!LETTERS.test(value)) return;
    if (kind !== "jsx" && /^[a-z0-9_.-]+$/.test(value)) return;
    const key = `${kind}\t${value}`;
    const existing = hits.get(key);
    if (existing) existing.count += 1;
    else hits.set(key, { kind, text: value, count: 1 });
  };

  const visit = (node) => {
    scanJsxText(node, add);
    scanJsxAttribute(node, add);
    scanCall(node, add);
    scanNewExpression(node, add);
    if (all) scanWide(node, add);
    ts.forEachChild(node, visit);
  };
  visit(tree);

  return [...hits.values()].sort((a, b) => a.kind.localeCompare(b.kind) || a.text.localeCompare(b.text));
}
