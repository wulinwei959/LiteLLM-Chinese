/**
 * Localize the vendored Lens package.
 *
 * The package ships as third-party source with its English copy inline, so
 * none of it reached the dashboard's message catalogs. This tool rewrites the
 * copy into catalog lookups: every user-facing literal becomes a `t("key")`
 * call, the components that render it read the translator from the host, the
 * pure helpers and the module-level tables read it from the package's own
 * registry, and the English text is written out for the catalog.
 *
 * The registry is the same seam the package already uses for its HTTP
 * client: the host registers what it has, the package asks for it. A
 * component asks through the hook, because a component has to re-render when
 * the host switches language; everything else asks through the registry,
 * because a helper cannot call a hook.
 *
 * Usage:
 *   node scripts/lens-localize.mjs --propose   # list the copy and the keys
 *   node scripts/lens-localize.mjs --catalog   # print the English catalog
 *   node scripts/lens-localize.mjs --plan      # print the rewrite plan
 *   node scripts/lens-localize.mjs --apply     # rewrite the package
 *
 * `--apply` is idempotent: a literal that already reads `t("…")` is left
 * alone, so the tool can be re-run after a change to the vendored source.
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const HERE = dirname(fileURLToPath(import.meta.url));
const DASHBOARD_ROOT = join(HERE, "..");
const PACKAGE_ROOT = join(DASHBOARD_ROOT, "vendor/lens-ui/src");
const DECISIONS_PATH = join(HERE, "lens-localize-decisions.json");
const CATALOG_PATH = join(HERE, "lens-localize-catalog.json");
const PLAN_PATH = join(HERE, "lens-localize-plan.json");

const TRANSLATE_MODULE = "../../host/LensHost";

/* ------------------------------------------------------------------ files */

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const packageFiles = () =>
  walk(PACKAGE_ROOT).filter(
    (file) => /\.tsx?$/.test(file) && !/\.test\./.test(file) && !file.includes("/lib/http/schema"),
  );

/* --------------------------------------------------------------- compiler */

const compilerOptions = () => {
  const configFile = ts.readConfigFile(join(DASHBOARD_ROOT, "tsconfig.json"), ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, DASHBOARD_ROOT);
  return { ...parsed.options, incremental: false, noEmit: true };
};

export const program = ts.createProgram({ rootNames: packageFiles(), options: compilerOptions() });
export const checker = program.getTypeChecker();

const sourceOf = (file) => program.getSourceFile(file);

/* ---------------------------------------------------------------- filters */

const decodeEntities = (text) =>
  text
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&middot;/g, "·")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

/**
 * Text that is not copy: class names, urls, code, and the identifiers the
 * interface shows as data. Anything that looks like a Tailwind class list,
 * a path, or a source excerpt stays as it is.
 */
const isNotCopy = (text) => {
  const trimmed = text.trim();
  if (trimmed === "") return true;
  if (/https?:\/\//.test(trimmed)) return true;
  if (/^\.{0,2}\/[a-z0-9_\-/.]/.test(trimmed)) return true;
  if (trimmed.includes("\n")) return true;
  if (/^[✕✓×–—…·•\s]+$/.test(trimmed)) return true;
  if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) return true;
  if (/^rgba?\(/.test(trimmed)) return true;
  if (/^(var|calc|min|max|clamp)\(/.test(trimmed)) return true;
  if (/^\([^)]*:\s*[\d.]+(px|rem|em|%)?\)$/.test(trimmed)) return true;
  if (/^\[[^\]]*\]/.test(trimmed)) return true;
  if (/\[(role|data-[a-z-]+)=/.test(trimmed)) return true;
  if (
    /^-?[\d.]+(?:px|rem|em|%)\s+-?[\d.]+(?:px|rem|em|%)\s+[\d.]+(?:px|rem|em|%)\s+-?[\d.]+(?:px|rem|em|%)$/.test(
      trimmed,
    )
  )
    return true;
  if (
    /^(?:YYYY|YY|MMM|MM|DD|D|HH|H|hh|h|mm|m|ss|s|S|A|a)(?:[-/: .,'"]*(?:YYYY|YY|MMM|MM|DD|D|HH|H|hh|h|mm|m|ss|s|S|A|a))+$/.test(
      trimmed,
    )
  )
    return true;
  if (/^[a-z0-9:_.\-[\]/%!@]+$/.test(trimmed) && !/[A-Z]/.test(trimmed)) return true;
  const tokens = trimmed.split(/\s+/);
  if (
    tokens.length > 1 &&
    tokens.every((token) => /^[a-z0-9@[\]&>:/%.!#*_~=()',\"-]+$/.test(token)) &&
    tokens.some((token) => /[-[\]/:.%!#*_~=()@&>,]/.test(token))
  ) {
    return true;
  }
  return false;
};

/* -------------------------------------------------------------- tree shape */

const UNWRAP_KINDS = new Set([
  ts.SyntaxKind.ParenthesizedExpression,
  ts.SyntaxKind.AsExpression,
  ts.SyntaxKind.TypeAssertionExpression,
  ts.SyntaxKind.SatisfiesExpression,
  ts.SyntaxKind.NonNullExpression,
]);

const unwrap = (node) => {
  let current = node;
  while (current && UNWRAP_KINDS.has(current.kind)) {
    current = current.expression;
  }
  return current;
};

const returnsJsx = (fn) => {
  const body = fn.body;
  if (!body) return false;
  if (!ts.isBlock(body)) {
    const expression = unwrap(body);
    return !!expression && (ts.isJsxElement(expression) || ts.isJsxFragment(expression));
  }
  let found = false;
  const visit = (node) => {
    if (found) return;
    if (ts.isReturnStatement(node) && node.expression) {
      const expression = unwrap(node.expression);
      if (expression && (ts.isJsxElement(expression) || ts.isJsxFragment(expression))) found = true;
    }
    ts.forEachChild(node, visit);
  };
  visit(body);
  return found;
};

const FUNCTION_KINDS = new Set([
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.FunctionExpression,
  ts.SyntaxKind.ArrowFunction,
  ts.SyntaxKind.MethodDeclaration,
]);

const functionChain = (node) => {
  const chain = [];
  let current = node.parent;
  while (current) {
    if (FUNCTION_KINDS.has(current.kind)) chain.push(current);
    current = current.parent;
  }
  return chain;
};

/**
 * The declaration a copy site belongs to.
 *
 * The outermost top-level function that encloses the site owns it: a
 * component owns the sites in its own body and the sites in the functions
 * nested inside it, because both see the component's translator. A top-level
 * function that renders no JSX is a helper, and it owns the sites in its body
 * because a helper cannot call a hook. A site outside every function sits in a
 * module-level declaration.
 */
const ownerOf = (node) => {
  const chain = functionChain(node);
  const outermost = chain[chain.length - 1];
  if (!outermost) {
    let current = node.parent;
    while (current && !ts.isSourceFile(current)) {
      if (ts.isVariableDeclaration(current)) return { kind: "module", fn: null, decl: current };
      current = current.parent;
    }
    return { kind: "module", fn: null, decl: null };
  }
  if (isComponentFn(outermost)) return { kind: "component", fn: outermost, decl: null };
  return { kind: "helper", fn: outermost, decl: null };
};

/** The name a function is known by. */
const fnName = (fn) => {
  if (fn.name) return fn.name.getText();
  const parent = fn.parent;
  if (parent && ts.isVariableDeclaration(parent)) return parent.name.getText();
  if (parent && ts.isPropertyAssignment(parent)) return parent.name.getText();
  return "";
};

/** Whether a declaration leaves the module. */
const isExported = (node) => {
  let current = node;
  while (current && !ts.isSourceFile(current)) {
    if (current.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) return true;
    current = current.parent;
  }
  return false;
};

/**
 * The symbol a name points at.
 *
 * An imported name resolves to the alias the import made, so the symbol that
 * matters is the one behind it.
 */
const resolveSymbol = (node) => {
  const symbol = checker.getSymbolAtLocation(node);
  if (!symbol) return undefined;
  if (symbol.flags & ts.SymbolFlags.Alias) return checker.getAliasedSymbol(symbol);
  return symbol;
};

/**
 * The functions the program renders as components.
 *
 * A component is a function the program puts into the tree as an element, so
 * the tree is where the answer comes from: a function whose name shows up as
 * a JSX tag, or as the argument of a higher-order component, is a component
 * wherever it is defined.
 */
const collectComponents = () => {
  const components = new Set();
  const remember = (node) => {
    const symbol = resolveSymbol(node);
    for (const declaration of symbol?.declarations ?? []) components.add(declaration);
  };
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.fileName.startsWith(PACKAGE_ROOT)) continue;
    const visit = (node) => {
      if (isJsxTagBoundary(node)) remember(node.tagName);
      if (isWrapperCall(node)) remember(node.arguments[0]);
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }
  return components;
};

const JSX_TAG_KINDS = new Set([
  ts.SyntaxKind.JsxOpeningElement,
  ts.SyntaxKind.JsxSelfClosingElement,
  ts.SyntaxKind.JsxClosingElement,
]);

const isJsxTagBoundary = (node) => JSX_TAG_KINDS.has(node.kind) && ts.isIdentifier(node.tagName);

const WRAPPER_CALLS = new Set(["memo", "forwardRef", "observer"]);

const isWrapperCall = (node) => {
  if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression)) return false;
  if (!WRAPPER_CALLS.has(node.expression.getText())) return false;
  return node.arguments.length === 1 && ts.isIdentifier(node.arguments[0]);
};

const COMPONENTS = collectComponents();

/** Whether a function is rendered as a component rather than called. */
const isComponentFn = (fn) => {
  if (!returnsJsx(fn)) return false;
  if (COMPONENTS.has(fn)) return true;
  const name = fnName(fn);
  if (!/^[A-Z]/.test(name)) return false;
  if (COMPONENTS.has(fn.parent) && ts.isVariableDeclaration(fn.parent)) return true;
  return isExported(fn);
};

/** The area a file belongs to, used as the catalog namespace. */
const areaOf = (rel) => {
  const parts = rel.split("/");
  if (parts[0] !== "components") return parts[0];
  const section = parts[1];
  if (section === "lens") {
    if (parts.length > 2 && !parts[2].includes(".")) return parts[2];
    return kebab(parts[2].replace(/\.tsx?$/, "").replace(/^Lens/, ""));
  }
  if (section === "shared") {
    if (parts.length > 2 && !parts[2].includes(".")) return `shared${parts[2][0].toUpperCase()}${parts[2].slice(1)}`;
    return "shared";
  }
  return section;
};

/** `AgentTracesTable` reads as `agentTracesTable`. */
const kebab = (name) => {
  if (!name) return "app";
  return name[0].toLowerCase() + name.slice(1);
};

/* ------------------------------------------------------------------ types */

const isTextualType = (type) => {
  if (!type) return false;
  if (type.isUnion()) {
    const parts = type.types.filter((part) => part.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null));
    const rest = type.types.filter((part) => !(part.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)));
    if (rest.length !== type.types.length) return rest.every(isTextualType);
    return parts.length > 0 && rest.every(isTextualType);
  }
  return Boolean(type.flags & (ts.TypeFlags.StringLike | ts.TypeFlags.NumberLike));
};

const typeOf = (node) => checker.getTypeAtLocation(node);

/* -------------------------------------------------------------- jsx text */

/**
 * The text a JSX text child renders.
 *
 * JSX drops the whitespace that sits at the start or the end of a line and
 * condenses the rest, so the raw source text is not what the user reads. The
 * rules below mirror the transform JSX itself applies.
 */
const cleanJsxText = (text) => {
  const lines = text.split(/\r\n|\n|\r/);
  let lastNonEmpty = 0;
  lines.forEach((line, index) => {
    if (/[^ \t]/.test(line)) lastNonEmpty = index;
  });
  let out = "";
  lines.forEach((line, index) => {
    let trimmed = line.replace(/\t/g, " ");
    if (index !== 0) trimmed = trimmed.replace(/^ +/, "");
    if (index !== lines.length - 1) trimmed = trimmed.replace(/ +$/, "");
    if (!trimmed) return;
    if (index !== lastNonEmpty) trimmed += " ";
    out += trimmed;
  });
  return out;
};

/**
 * The space a JSX text child keeps after its words.
 *
 * JSX drops the whitespace at the end of a line, so only a text child that
 * stays on one line keeps the space that separates it from what follows.
 */
const jsxTrailSpace = (text) => {
  if (/[\r\n]$/.test(text)) return "";
  const lastLine = text.split(/\r\n|\n|\r/).pop() ?? "";
  return /[ \t]$/.test(lastLine) ? " " : "";
};

/* ------------------------------------------------------------- collection */

const COMPARISON_OPERATORS = new Set([
  ts.SyntaxKind.EqualsEqualsEqualsToken,
  ts.SyntaxKind.ExclamationEqualsEqualsToken,
  ts.SyntaxKind.EqualsEqualsToken,
  ts.SyntaxKind.ExclamationEqualsToken,
]);

/** Calls whose string argument is data the program compares against. */
const DATA_CALLS = new Set([
  "includes",
  "includesIgnoreCase",
  "startsWith",
  "endsWith",
  "indexOf",
  "lastIndexOf",
  "split",
  "join",
  "replace",
  "replaceAll",
  "concat",
  "padStart",
  "padEnd",
  "trim",
  "trimStart",
  "trimEnd",
  "localeCompare",
  "querySelector",
  "getElementById",
  "fetch",
  "console.log",
  "console.warn",
  "console.error",
  "console.info",
  "console.debug",
  "Error",
  "TypeError",
  "RangeError",
  "URL",
  "encodeURIComponent",
  "decodeURIComponent",
  "JSON.parse",
  "JSON.stringify",
  "structuredClone",
  "setTimeout",
  "setInterval",
  "clearTimeout",
  "clearInterval",
]);

/** JSX attributes whose value the user reads. */
const DISPLAY_ATTRIBUTES = new Set([
  "aria-label",
  "aria-description",
  "aria-placeholder",
  "aria-roledescription",
  "alt",
  "backLabel",
  "copyLabel",
  "copiedLabel",
  "description",
  "detail",
  "emptyText",
  "goal",
  "heading",
  "helperText",
  "hint",
  "label",
  "message",
  "noun",
  "placeholder",
  "sublabel",
  "subtitle",
  "summary",
  "title",
  "tooltip",
]);

/** Object properties whose value the user reads. */
const DISPLAY_PROPERTIES = new Set([
  "answer",
  "body",
  "check",
  "code",
  "content",
  "description",
  "detail",
  "error",
  "header",
  "history",
  "instruction",
  "label",
  "limitation",
  "message",
  "note",
  "prompt",
  "question",
  "reason",
  "result",
  "status",
  "suggestion",
  "summary",
  "title",
  "tool",
  "value",
]);

/**
 * A form field path.
 *
 * react-hook-form reads the path back by name when it collects the form, so
 * the spelling has to survive on both sides of the form. The path is not copy.
 */
const isFieldPath = (node) => {
  const parent = node.parent;
  if (!parent || !ts.isCallExpression(parent)) return false;
  if (parent.expression.getText() !== "register") return false;
  return parent.arguments[0] === node;
};

/**
 * Whether the program gives the literal a fixed set of values to be.
 *
 * A parameter typed as a union of string literals takes a value, not copy: the
 * code compares it later, so the spelling has to survive on both sides of the
 * comparison.
 */
const isFixedValue = (node) => {
  const contextual = checker.getContextualType(node);
  if (!contextual) return false;
  const members = contextual.isUnion() ? contextual.types : [contextual];
  return members.some((member) => member.isStringLiteral() && member.value === node.text);
};

/**
 * Whether a literal sits where the program reads it back.
 *
 * A string the code compares, switches on, or hands to a string helper is
 * data: the value comes from the API and the same spelling has to survive on
 * both sides of the comparison.
 */
const DATA_TRUE_PARENT_KINDS = new Set([
  ts.SyntaxKind.ImportDeclaration,
  ts.SyntaxKind.ExportDeclaration,
  ts.SyntaxKind.ImportTypeNode,
  ts.SyntaxKind.ImportEqualsDeclaration,
  ts.SyntaxKind.ExternalModuleReference,
  ts.SyntaxKind.ElementAccessExpression,
  ts.SyntaxKind.CaseClause,
  ts.SyntaxKind.LiteralType,
  ts.SyntaxKind.ThrowStatement,
]);

const TYPE_CHECK_KINDS = new Set([
  ts.SyntaxKind.AsExpression,
  ts.SyntaxKind.TypeAssertionExpression,
  ts.SyntaxKind.SatisfiesExpression,
]);

const STRING_HELPER_CALLS = new Set(["cn", "clsx", "twMerge", "t"]);

const isDataCallArgument = (parent) => {
  if (!ts.isCallExpression(parent) && !ts.isNewExpression(parent)) return false;
  const callee = parent.expression.getText();
  return DATA_CALLS.has(callee) || STRING_HELPER_CALLS.has(callee);
};

const isDataLiteral = (node) => {
  const parent = node.parent;
  if (!parent) return true;
  if (isFieldPath(node)) return true;
  if (isFixedValue(node)) return true;
  if (DATA_TRUE_PARENT_KINDS.has(parent.kind)) return true;
  if (ts.isJsxExpression(parent) || ts.isTemplateHead(parent) || ts.isTemplateSpan(parent)) return false;
  if (ts.isPropertyAssignment(parent)) return parent.name === node;
  if (ts.isBinaryExpression(parent)) {
    const operatorKind = parent.operatorToken.kind;
    return COMPARISON_OPERATORS.has(operatorKind) || operatorKind >= ts.SyntaxKind.FirstAssignment;
  }
  if (TYPE_CHECK_KINDS.has(parent.kind)) return parent.type === node;
  if (isDataCallArgument(parent)) return true;
  if (ts.isExpressionStatement(parent) && parent.expression === node) {
    return parent.getSourceFile().statements[0] === parent;
  }
  return false;
};

const templateMessage = (template, sourceFile, prefix = "value") => {
  const parts = [template.head.text];
  const values = [];
  template.templateSpans.forEach((span, index) => {
    const name = `${prefix}${index}`;
    parts.push(`{${name}}`);
    values.push({ name, expression: span.expression.getText(sourceFile) });
    parts.push(span.literal.text);
  });
  return { message: parts.join(""), values };
};

const STRING_JSX_KINDS = new Set([ts.SyntaxKind.StringLiteral, ts.SyntaxKind.TemplateExpression]);

const isLiteralJsxChild = (child) =>
  ts.isJsxExpression(child) && !!child.expression && STRING_JSX_KINDS.has(child.expression.kind);

const isHoleJsxChild = (child) =>
  ts.isJsxExpression(child) && !!child.expression && !STRING_JSX_KINDS.has(child.expression.kind);

const jsxRuns = (children) => {
  const runs = [];
  let current = null;
  for (const child of children) {
    if (ts.isJsxText(child) || ts.isJsxExpression(child)) {
      if (!current) {
        current = [];
        runs.push(current);
      }
      current.push(child);
    } else {
      current = null;
    }
  }
  return runs;
};

/**
 * The copy sites of the vendored package.
 *
 * Every site knows the range it occupies, the English message it carries,
 * the arguments the message needs, and the declaration that has to hold the
 * translator for the call to work.
 */
const byFileThenLine = (a, b) => {
  if (a.file === b.file) return a.line - b.line;
  return a.file < b.file ? -1 : 1;
};

export const collect = () => {
  const sites = [];
  for (const file of packageFiles()) {
    const sourceFile = sourceOf(file);
    const rel = relative(PACKAGE_ROOT, file);
    /**
     * @param {Record<string, unknown>} bag
     */
    const add = (node, message, values, { shape, ...bag } = {}) => {
      const owner = bag.ownerNode ? ownerOf(bag.ownerNode) : ownerOf(node);
      const site = {
        file: rel,
        sourceFile,
        line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
        shape,
        message,
        values,
        owner,
        parent: node.parent ?? null,
        ...bag,
      };
      sites.push(site);
    };

    const mergeJsxRun = (literals, texts, holes) => {
      if (literals.length !== 0 || texts.length === 0 || holes.length === 0) return false;
      return holes.every((child) => isTextualType(typeOf(child.expression)));
    };

    const addMergedRun = (run, holes) => {
      const parts = [];
      const values = [];
      for (const child of run) {
        if (ts.isJsxText(child)) {
          parts.push(cleanJsxText(child.text));
          continue;
        }
        const name = `value${values.length}`;
        values.push({ name, expression: child.expression.getText(sourceFile) });
        parts.push(`{${name}}`);
      }
      const message = parts
        .join("")
        .replace(/[ \t]{2,}/g, " ")
        .trim();
      if (!/[A-Za-z]/.test(message)) return;
      const start = run[0].getStart(sourceFile);
      const end = run[run.length - 1].getEnd();
      const range = { start, end, lead: "", ownerNode: run[0] };
      add({ getStart: () => start, getEnd: () => end }, message, values, { shape: "jsxRun", ...range });
    };

    const visitJsxRun = (run) => {
      const literals = run.filter(isLiteralJsxChild);
      const texts = run.filter(ts.isJsxText);
      const holes = run.filter(isHoleJsxChild);
      if (mergeJsxRun(literals, texts, holes)) {
        addMergedRun(run, holes);
        return;
      }
      for (const child of run) visitJsxChild(child);
    };

    const addJsxTextChild = (child) => {
      const text = cleanJsxText(child.text).trim();
      if (!/[A-Za-z]/.test(text)) return;
      const range = {
        start: child.getStart(sourceFile),
        end: child.getEnd(),
        lead: "",
        trail: jsxTrailSpace(child.text),
      };
      add(child, text, [], { shape: "jsxText", ...range });
    };

    const addJsxExpressionChild = (expression) => {
      if (ts.isStringLiteral(expression)) {
        const range = {
          start: expression.getStart(sourceFile),
          end: expression.getEnd(),
          lead: "",
        };
        add(expression, decodeEntities(expression.text), [], { shape: "jsxExpr", ...range });
        return;
      }
      if (!ts.isTemplateExpression(expression)) return;
      const { message, values } = templateMessage(expression, sourceFile);
      if (!/[A-Za-z]/.test(message)) return;
      const range = { start: expression.getStart(sourceFile), end: expression.getEnd(), lead: "" };
      add(expression, message, values, { shape: "jsxExprTpl", ...range });
    };

    const visitJsxChild = (child) => {
      if (ts.isJsxText(child)) {
        addJsxTextChild(child);
        return;
      }
      if (child.expression) addJsxExpressionChild(child.expression);
    };

    const visitJsxRuns = (node) => {
      for (const run of jsxRuns(node.children)) visitJsxRun(run);
    };

    const visitJsxAttribute = (node) => {
      if (!DISPLAY_ATTRIBUTES.has(node.name.getText(sourceFile))) return;
      const init = node.initializer;
      if (!init) return;
      if (ts.isStringLiteral(init)) {
        const range = { start: init.getStart(sourceFile), end: init.getEnd() };
        add(init, decodeEntities(init.text), [], { shape: "attr", ...range });
        return;
      }
      if (!ts.isTemplateExpression(init?.expression)) return;
      const { message, values } = templateMessage(init.expression, sourceFile);
      if (!/[A-Za-z]/.test(message)) return;
      const range = { start: init.expression.getStart(sourceFile), end: init.expression.getEnd() };
      add(init.expression, message, values, { shape: "attrTpl", ...range });
    };

    const visitPropertyAssignment = (node) => {
      const name = node.name.getText(sourceFile).replace(/["']/g, "");
      if (!DISPLAY_PROPERTIES.has(name)) return;
      const init = node.initializer;
      if (!init) return;
      if (ts.isStringLiteral(init)) {
        const range = { start: init.getStart(sourceFile), end: init.getEnd() };
        add(init, decodeEntities(init.text), [], { shape: "prop", ...range });
        return;
      }
      if (!ts.isTemplateExpression(init)) return;
      const { message, values } = templateMessage(init, sourceFile);
      if (!/[A-Za-z]/.test(message)) return;
      const range = { start: init.getStart(sourceFile), end: init.getEnd() };
      add(init, message, values, { shape: "propTpl", ...range });
    };

    const visitConditional = (node) => {
      for (const branch of [node.whenTrue, node.whenFalse]) {
        if (ts.isStringLiteral(branch)) {
          const range = { start: branch.getStart(sourceFile), end: branch.getEnd() };
          add(branch, decodeEntities(branch.text), [], { shape: "cond", ...range });
          continue;
        }
        if (!ts.isTemplateExpression(branch)) continue;
        const { message, values } = templateMessage(branch, sourceFile);
        if (!/[A-Za-z]/.test(message)) continue;
        const range = { start: branch.getStart(sourceFile), end: branch.getEnd() };
        add(branch, message, values, { shape: "condTpl", ...range });
      }
    };

    const visitTemplate = (node) => {
      if (isFieldPath(node)) return;
      if (ts.isJsxExpression(node.parent)) return;
      const { message, values } = templateMessage(node, sourceFile);
      if (!/[A-Za-z]/.test(message)) return;
      const range = { start: node.getStart(sourceFile), end: node.getEnd() };
      add(node, message, values, { shape: "tpl", ...range });
    };

    const visitStringLiteral = (node) => {
      if (isDataLiteral(node)) return;
      const text = decodeEntities(node.text);
      if (!/[A-Za-z]/.test(text)) return;
      const range = {
        start: node.getStart(sourceFile),
        end: node.getEnd(),
        inJsxAttr: ts.isJsxAttribute(node.parent),
      };
      add(node, text, [], { shape: "expr", ...range });
    };

    const visit = (node) => {
      if (ts.isJsxElement(node) || ts.isJsxFragment(node)) visitJsxRuns(node);
      if (ts.isJsxAttribute(node)) visitJsxAttribute(node);
      if (ts.isPropertyAssignment(node)) visitPropertyAssignment(node);
      if (ts.isConditionalExpression(node)) visitConditional(node);
      if (ts.isTemplateExpression(node)) visitTemplate(node);
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) visitStringLiteral(node);
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }
  return sites;
};

export default collect;

/* ------------------------------------------------------------------- keys */

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "can",
  "do",
  "does",
  "for",
  "from",
  "has",
  "have",
  "here",
  "how",
  "if",
  "in",
  "into",
  "is",
  "it",
  "its",
  "no",
  "not",
  "of",
  "on",
  "or",
  "so",
  "than",
  "that",
  "the",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "this",
  "to",
  "was",
  "were",
  "what",
  "when",
  "where",
  "which",
  "will",
  "with",
  "you",
  "your",
]);

/** The words of a message, with the placeholders spelled out. */
const wordsOf = (text) =>
  decodeEntities(text)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\{value(\d+)\}/g, (_, index) => `value${index}`)
    .replace(/[^A-Za-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

/** A readable key for an English string. */
const slugOf = (text, words = 4) => {
  const tokens = wordsOf(text);
  const kept = tokens.filter((word) => !STOP_WORDS.has(word.toLowerCase()));
  const chosen = (kept.length > 0 ? kept : tokens).slice(0, words);
  if (chosen.length === 0) return "text";
  return chosen
    .map((word, index) =>
      index === 0 ? word.charAt(0).toLowerCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("")
    .slice(0, 60);
};

/**
 * The key a message falls back to when the short one is taken.
 *
 * The short key drops the filler words, so two messages that differ only in
 * one of them land on the same key. The long key keeps every word, which is
 * what tells them apart.
 */
const longSlugOf = (text) => {
  const chosen = wordsOf(text).slice(0, 8);
  if (chosen.length === 0) return "text";
  return chosen
    .map((word, index) =>
      index === 0 ? word.charAt(0).toLowerCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("")
    .slice(0, 60);
};

const loadDecisions = () => {
  try {
    return JSON.parse(readFileSync(DECISIONS_PATH, "utf8"));
  } catch {
    return { skip: [], skipFiles: [], keys: {} };
  }
};

/**
 * The name of a property, and whether it has to be computed.
 *
 * A getter needs a name the engine accepts. A plain name is used as it is, a
 * name that is not a plain identifier is computed.
 */
const propertyKey = (name) => {
  if (ts.isIdentifier(name)) return { text: name.text, computed: false };
  if (ts.isStringLiteral(name) && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name.text)) {
    return { text: name.text, computed: false };
  }
  if (ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return { text: name.text, computed: true };
  }
  return undefined;
};

/**
 * Whether a site sits in the parameter list of the component that owns it.
 *
 * A default value is read when the caller calls the component, which is
 * before the body runs, so the hook the body uses is not there yet. The
 * registry is.
 */
const inParameterList = (site) => {
  if (site.owner.kind !== "component") return false;
  return site.owner.fn.parameters.some((param) => param.getStart() <= site.start && site.end <= param.getEnd());
};

/**
 * Whether a site reads its copy through the hook.
 *
 * A component reads its copy through the hook, because a component has to
 * re-render when the host switches language. A default value cannot, because
 * the body has not run yet.
 */
const usesHook = (site) => site.owner.kind === "component" && !inParameterList(site);

/**
 * Whether the tool can rewrite a site on its own.
 *
 * A component and a helper are rewritten where they stand. A module-level
 * property becomes a getter, which keeps the table it sits in readable at the
 * moment somebody asks for it. Anything else at module level — a bare string,
 * an entry in an array — would be read while the module loads, before the
 * host has a translator, so it needs a human to look at it.
 */
const isRewritable = (site) => {
  if (site.owner.kind !== "module") return true;
  const parent = site.parent;
  if (!parent || !ts.isPropertyAssignment(parent)) return false;
  return propertyKey(parent.name) !== undefined;
};

/**
 * The copy sites that carry a message, with the manual decisions applied.
 *
 * A site is dropped when its file is a corpus rather than an interface (the
 * demo fixtures, the prompt the package hands to a coding agent), when its
 * text is an identifier the interface shows as data, or when the reviewer
 * judged it not to be copy.
 */
export const copySites = () => {
  const decisions = loadDecisions();
  const skipFiles = new Set(decisions.skipFiles ?? []);
  const skipTexts = new Set(decisions.skip ?? []);
  const sites = collect().filter((site) => {
    if (skipFiles.has(site.file)) return false;
    if (isNotCopy(site.message)) return false;
    if (!/[A-Za-z]{2,}/.test(site.message.replace(/\{value\d+\}/g, ""))) return false;
    if (skipTexts.has(site.message)) return false;
    return true;
  });
  for (const site of sites) site.rewritable = isRewritable(site);

  const byMessage = new Map();
  for (const site of [...sites].sort(byFileThenLine)) {
    if (!site.rewritable) continue;
    if (byMessage.has(site.message)) continue;
    byMessage.set(site.message, { area: areaOf(site.file), slug: slugOf(site.message) });
  }

  const used = new Set();
  for (const [message, { area, slug }] of byMessage) {
    let key = `${area}.${slug}`;
    if (used.has(key)) {
      const longer = `${area}.${longSlugOf(message)}`;
      key = used.has(longer)
        ? `${area}.${slug}${[...used].filter((taken) => taken.startsWith(`${area}.${slug}`)).length + 1}`
        : longer;
    }
    while (used.has(key)) key = `${key}x`;
    used.add(key);
    byMessage.set(message, key);
  }
  for (const [message, key] of Object.entries(decisions.keys ?? {})) {
    if (byMessage.has(message)) byMessage.set(message, key);
  }
  for (const site of sites) site.key = byMessage.get(site.message);
  return { sites, catalog: byMessage };
};

/** The English catalog, one nested object per area. */
export const catalogOf = (catalog) => {
  const out = {};
  for (const [message, key] of catalog) {
    const [area, slug] = key.split(".");
    out[area] = out[area] ?? {};
    out[area][slug] = message;
  }
  return out;
};

/* ------------------------------------------------------------------ apply */

const TRANSLATE_HOOK = join(PACKAGE_ROOT, "host/useLensTranslate");
const TRANSLATE_REGISTRY = join(PACKAGE_ROOT, "host/lensTranslate");

/** The specifier that reaches a module from a file. */
const importPath = (fromFile, toModule) => {
  let specifier = relative(dirname(fromFile), toModule).replace(/\\/g, "/");
  if (!specifier.startsWith(".")) specifier = `./${specifier}`;
  return specifier;
};

/** The call a site turns into. */
const callFor = (site, callee) => {
  if (!site.values.length) return `${callee}(${JSON.stringify(site.key)})`;
  const args = site.values.map((value) => `${value.name}: ${value.expression}`).join(", ");
  return `${callee}(${JSON.stringify(site.key)}, { ${args} })`;
};

/** The text that replaces a site. */
const replacementFor = (site) => {
  const callee = usesHook(site) ? "t" : "lensTranslate";
  const call = callFor(site, callee);
  switch (site.shape) {
    case "jsxText":
    case "jsxRun":
    case "attr":
      return `{${call}}`;
    case "expr":
      return site.inJsxAttr ? `{${call}}` : call;
    default:
      return call;
  }
};

/** The indentation of the line a position sits on. */
const indentAt = (sourceFile, position) => {
  const line = sourceFile.getLineAndCharacterOfPosition(position).line;
  const lines = sourceFile.getFullText().split(/\r\n|\n|\r/);
  const text = lines[line] ?? "";
  return /^[ \t]*/.exec(text)?.[0] ?? "";
};

/**
 * The edits that give a component its translator.
 *
 * A component that already has a body gets the hook at the top of it. A
 * component written as a single expression grows a body to hold it.
 */
const componentEdits = (fn, sourceFile) => {
  const body = fn.body;
  if (ts.isBlock(body)) {
    const indent = `${indentAt(sourceFile, fn.getStart(sourceFile))}  `;
    return [
      {
        start: body.getStart(sourceFile) + 1,
        end: body.getStart(sourceFile) + 1,
        text: `\n${indent}const t = useLensTranslate();`,
      },
    ];
  }
  const expression = body.getStart(sourceFile);
  const indent = indentAt(sourceFile, fn.getStart(sourceFile));
  return [
    {
      start: expression,
      end: body.getEnd(),
      text: `{\n${indent}  const t = useLensTranslate();\n${indent}  return ${body.getText(sourceFile)};\n${indent}}`,
    },
  ];
};

/**
 * The edit that turns a module-level property into a getter.
 *
 * A module-level table is built when the module loads, which is before the
 * host has registered a translator. Reading the copy through a getter keeps
 * the shape of the table and its type, and reads the copy at the moment
 * somebody asks for it.
 *
 * A property the tool cannot name as an identifier is left alone: it needs a
 * human to look at it.
 */
const getterEdit = (site, fileSites, sourceFile) => {
  const parent = site.parent;
  if (!parent || !ts.isPropertyAssignment(parent)) return undefined;
  const key = propertyKey(parent.name);
  if (!key) return undefined;
  const initializer = parent.initializer;
  if (!initializer) return undefined;

  const from = initializer.getStart(sourceFile);
  const to = initializer.getEnd(sourceFile);
  const editable = fileSites.filter((other) => other !== site && other.owner.kind === "module");
  const inside = editable.filter((other) => other.start >= from && other.end <= to);
  const edits = [site, ...inside].map((other) => ({
    start: other.start - from,
    end: other.end - from,
    text: replacementFor(other),
  }));
  const body = applyEdits(initializer.getText(sourceFile), edits);
  const name = key.computed ? `[${JSON.stringify(key.text)}]` : key.text;
  return {
    start: parent.getStart(sourceFile),
    end: parent.getEnd(sourceFile),
    text: `get ${name}() { return ${body}; }`,
  };
};

/** The edits that add the imports a rewritten file needs. */
const importEdits = (sourceFile, lines) => {
  const statements = sourceFile.statements;
  let last = 0;
  for (const statement of statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    last = Math.max(last, statement.getEnd());
  }
  const text = lines.join("\n");
  if (!last) {
    return [{ start: 0, end: 0, text: `${text}\n` }];
  }
  return [{ start: last, end: last, text: `\n${text}` }];
};

/** Applies a set of edits to a source text. */
const applyEdits = (text, edits) => {
  const sorted = [...edits].sort((a, b) => b.start - a.start || b.end - a.end);
  let out = text;
  let previousStart = Infinity;
  for (const edit of sorted) {
    if (edit.end > previousStart) continue;
    out = `${out.slice(0, edit.start)}${edit.text}${out.slice(edit.end)}`;
    previousStart = edit.start;
  }
  return out;
};

/**
 * The rewrite of the package.
 *
 * A component reads the translator from the host, because a component has to
 * re-render when the host switches language. Everything else reads it from
 * the package's registry, because a helper cannot call a hook and a
 * module-level table is built before any component renders.
 *
 * A module-level table keeps its shape: the copy in it becomes a getter, so
 * the table is still read at the moment somebody asks for it and the type of
 * the table does not change.
 */
export const apply = (sites) => {
  const byFile = new Map();
  for (const site of sites) {
    if (!byFile.has(site.file)) byFile.set(site.file, []);
    byFile.get(site.file).push(site);
  }

  const edited = [];
  for (const [file, fileSites] of byFile) {
    const sourceFile = sourceOf(join(PACKAGE_ROOT, file));
    if (!sourceFile) continue;
    const text = sourceFile.getFullText();
    const edits = [];

    const components = new Map();
    for (const site of fileSites) {
      if (usesHook(site)) components.set(site.owner.fn, site.sourceFile);
    }

    const ranges = [];
    const covered = (start, end) => ranges.some((range) => start >= range.start && end <= range.end);

    for (const site of fileSites) {
      if (site.owner.kind === "module") {
        if (!site.rewritable) continue;
        const getter = getterEdit(site, fileSites, sourceFile);
        if (!getter) continue;
        if (covered(getter.start, getter.end)) continue;
        ranges.push({ start: getter.start, end: getter.end });
        edits.push(getter);
        continue;
      }
      if (covered(site.start, site.end)) continue;
      ranges.push({ start: site.start, end: site.end });
      edits.push({ start: site.start, end: site.end, text: replacementFor(site) });
    }

    for (const [fn, ownerFile] of components) {
      if (ownerFile !== sourceFile) continue;
      edits.push(...componentEdits(fn, sourceFile));
    }

    const needsHook = components.size > 0;
    const needsRegistry = fileSites.some((site) => !usesHook(site) && site.rewritable);
    const imports = [];
    if (needsHook) {
      imports.push(
        `import { useLensTranslate } from ${JSON.stringify(importPath(join(PACKAGE_ROOT, file), TRANSLATE_HOOK))};`,
      );
    }
    if (needsRegistry) {
      imports.push(
        `import { lensTranslate } from ${JSON.stringify(importPath(join(PACKAGE_ROOT, file), TRANSLATE_REGISTRY))};`,
      );
    }
    if (imports.length) edits.push(...importEdits(sourceFile, imports));

    const out = applyEdits(text, edits);
    if (out !== text) edited.push({ file: join(PACKAGE_ROOT, file), text: out });
  }

  for (const entry of edited) writeFileSync(entry.file, entry.text);
  return edited.map((entry) => entry.file);
};

/* ------------------------------------------------------------------- main */

const main = () => {
  const mode = process.argv[2];
  const { sites, catalog } = copySites();
  if (mode === "--catalog") {
    writeFileSync(CATALOG_PATH, `${JSON.stringify(catalogOf(catalog), null, 2)}\n`);
    console.error(`catalog written: ${catalog.size} keys -> ${CATALOG_PATH}`);
    return;
  }
  if (mode === "--apply") {
    const written = apply(sites);
    console.error(`rewrote ${written.length} files`);
    return;
  }
  const rows = [...catalog].sort((a, b) => (a[1] < b[1] ? -1 : 1));
  for (const [message, key] of rows) {
    const list = sites.filter((site) => site.message === message);
    process.stdout.write(`${key}\t${list.length}\t${list[0].file}:${list[0].line}\t${JSON.stringify(message)}\n`);
  }
  for (const site of sites.filter((site) => !site.rewritable)) {
    process.stdout.write(`MANUAL\t${site.file}:${site.line}\t${JSON.stringify(site.message)}\n`);
  }
  const owners = { component: 0, helper: 0, module: 0 };
  for (const site of sites) owners[site.owner.kind] = (owners[site.owner.kind] ?? 0) + 1;
  console.error(`${sites.length} sites, ${catalog.size} keys`, owners);
};

if (process.argv[1] && process.argv[1].endsWith("lens-localize.mjs")) main();
