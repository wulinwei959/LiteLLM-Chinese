import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { IntlMessageFormat } from "intl-messageformat";
import ts from "typescript";

import en from "@/messages/en.json";

/**
 * Guards the direction neither messagesParity nor missingKeys covers: the
 * arguments a call site hands to t()/t.rich() against the arguments the message
 * itself demands.
 *
 * next-intl reads a message's `<tag>` as a variable the call site must supply.
 * When a values object is given but does not carry the tag, t.rich() throws
 * FORMATTING_ERROR. When no values object is given at all, the tag is not
 * thrown but rendered as literal text, so the user reads "<code>foo</code>" in
 * the interface. A message's `{name}` is missing the same way, only that one
 * always throws.
 *
 * The legacy next-intl v3 spelling `{code}...{/code}` is not recognised at all:
 * the handler the call site passes is ignored and the braces show up verbatim.
 *
 * Both are invisible to the existing guards: parity compares the two catalogs
 * against each other, and missingKeys only checks that the key exists. A
 * message whose tag names drift away from the handlers its call site passes
 * therefore reaches the browser and breaks there.
 */

const SRC = "src";

type Catalog = { [key: string]: string | Catalog };

type Element = {
  type: number;
  value?: string;
  options?: Record<string, { value: Element[] }>;
  children?: Element[];
};

const flatten = (node: Catalog, prefix = ""): [string, string][] =>
  Object.entries(node).flatMap(([key, value]) =>
    typeof value === "object" && value !== null
      ? flatten(value, prefix ? `${prefix}.${key}` : key)
      : [[prefix ? `${prefix}.${key}` : key, value as string]],
  );

const CATALOG = new Map(flatten(en as unknown as Catalog));

/**
 * ICU quoting: a single quote opens a literal only when the next character is
 * one of `{ } # | < '`, and it runs until the next single quote. A message
 * that shows a URL or a JSON snippet quotes it, and the braces inside that
 * literal are text, not placeholders.
 */
const readQuoted = (message: string, start: number): { text: string; end: number } => {
  let text = "";
  let index = start + 2;
  while (index < message.length) {
    if (message[index] === "'") {
      if (message[index + 1] === "'") {
        text += "'";
        index += 2;
        continue;
      }
      return { text, end: index + 1 };
    }
    text += message[index];
    index += 1;
  }
  return { text, end: index };
};

const stripQuoted = (message: string): string => {
  let out = "";
  let index = 0;
  while (index < message.length) {
    const char = message[index];
    const next = message[index + 1] ?? "";
    if (char === "'" && "{ } # | < '".includes(next)) {
      const quoted = readQuoted(message, index);
      out += quoted.text;
      index = quoted.end;
      continue;
    }
    out += char;
    index += 1;
  }
  return out;
};

/**
 * The element kinds are read off a probe message rather than hardcoded, so the
 * guard keeps working if the parser renumbers them.
 */
const PROBE = new IntlMessageFormat(
  "<probeTag>probeText</probeTag>{probeArg} {probeArg, plural, one {probeOne} other {probeOther}}",
);

const astOf = (message: string): Element[] => new IntlMessageFormat(message).getAst() as unknown as Element[];

const kindOf = (element: Element): "tag" | "argument" | "select" | "other" => {
  if (element.options) return "select";
  if (element.children) return "tag";
  if (element.value === "probeArg") return "argument";
  return "other";
};

type Requirements = { tags: string[]; variables: string[]; legacy: string[] };

/** The tag and variable names a message asks the call site for. */
const requirements = (message: string): Requirements => {
  const tags = new Set<string>();
  const variables = new Set<string>();

  let ast: Element[] | null = null;
  try {
    ast = astOf(message);
  } catch {
    ast = null;
  }

  if (ast) {
    const walk = (elements: Element[]): void => {
      for (const element of elements) {
        const kind = kindOf(element);
        if (kind === "tag" && element.value) {
          tags.add(element.value);
          walk(element.children ?? []);
        } else if (kind === "argument" && element.value) {
          variables.add(element.value);
        } else if (kind === "select") {
          if (element.value) variables.add(element.value);
          for (const option of Object.values(element.options ?? {})) walk(option.value);
        }
      }
    };
    walk(ast);
  } else {
    // The parser rejects a few messages next-intl tolerates (an unquoted JSON
    // example, for one), so those fall back to a scan of the message text.
    const text = stripQuoted(message);
    for (const match of text.matchAll(/<([a-zA-Z][\w-]*)>/g)) tags.add(match[1]);
    for (const match of text.matchAll(/\{(\w+)\}/g)) variables.add(match[1]);
  }

  // A name that also closes a tag is the next-intl v3 spelling of rich text.
  const text = stripQuoted(message);
  const legacy = [...variables].filter((name) => text.includes(`</${name}>`) || text.includes(`{/${name}}`));
  for (const name of legacy) variables.delete(name);

  return { tags: [...tags], variables: [...variables], legacy };
};

function walkDir(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry !== "node_modules" && entry !== ".next") walkDir(full, out);
    } else if (/\.tsx?$/.test(entry) && !/\.test\.[tj]sx?$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

/** The namespace a `useTranslations("ns")` call binds, if that is what this is. */
const translationsNamespace = (initializer: ts.Expression): string | null => {
  if (!ts.isCallExpression(initializer)) return null;
  if (!ts.isIdentifier(initializer.expression)) return null;
  if (initializer.expression.text !== "useTranslations") return null;
  const [first] = initializer.arguments;
  return first && ts.isStringLiteral(first) ? first.text : null;
};

const scanFile = (file: string): string[] => {
  const source = readFileSync(file, "utf8");
  const parsed = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const namespaces = new Map<string, string>();
  const locals = new Map<string, ts.ObjectLiteralExpression>();
  const collect = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node) && node.initializer) {
      const name = node.name.getText(parsed);
      const namespace = translationsNamespace(node.initializer);
      if (namespace) namespaces.set(name, namespace);
      if (ts.isObjectLiteralExpression(node.initializer)) {
        locals.set(name, node.initializer);
      }
    }
    ts.forEachChild(node, collect);
  };
  collect(parsed);

  const problems: string[] = [];

  /** The names an object literal hands over, or null when one is unreadable. */
  const literalNames = (literal: ts.ObjectLiteralExpression): Set<string> | null => {
    const names = new Set<string>();
    for (const property of literal.properties) {
      if (ts.isPropertyAssignment(property)) {
        names.add(property.name.getText(parsed).replace(/^["']|["']$/g, ""));
      } else if (ts.isShorthandPropertyAssignment(property)) {
        names.add(property.name.getText(parsed));
      } else if (ts.isSpreadAssignment(property) && ts.isIdentifier(property.expression)) {
        const spread = locals.get(property.expression.text);
        if (!spread) return null;
        const spreadNames = literalNames(spread);
        if (!spreadNames) return null;
        for (const name of spreadNames) names.add(name);
      } else {
        return null;
      }
    }
    return names;
  };

  /** The names a call site hands over, or null when the object cannot be read. */
  const providedNames = (node: ts.Node | undefined): Set<string> | null => {
    if (!node) return new Set();
    if (ts.isObjectLiteralExpression(node)) return literalNames(node);
    if (ts.isIdentifier(node)) {
      const local = locals.get(node.text);
      return local ? literalNames(local) : null;
    }
    return null;
  };

  const check = (node: ts.CallExpression, full: string, message: string): void => {
    const { tags, variables, legacy } = requirements(message);
    const provided = providedNames(node.arguments[1]);
    if (provided === null) {
      // A values object this scanner cannot read: the call site is checked by
      // hand, so it is not reported here.
      return;
    }
    const { line } = parsed.getLineAndCharacterOfPosition(node.getStart(parsed));
    const where = `${file}:${line + 1}  ${full}`;
    if (legacy.length > 0) {
      problems.push(`${where}: 消息用的是旧式 {tag} 写法（${legacy.join(", ")}），next-intl 不认，标记会原样显示`);
      return;
    }
    if (node.arguments[1] === undefined) {
      if (tags.length > 0) {
        problems.push(`${where}: 消息带 ${tags.join(", ")} 标签但调用点没给 values，标签会当字面量渲染`);
      } else if (variables.length > 0) {
        problems.push(`${where}: 消息要 ${variables.join(", ")} 但调用点没给 values`);
      }
      return;
    }
    const missing = [...tags, ...variables].filter((name) => !provided.has(name));
    if (missing.length > 0) {
      problems.push(`${where}: 缺 ${missing.join(", ")}；给了 ${[...provided].join(", ") || "（无）"}`);
    }
  };

  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const method = node.expression.name.text;
      const variable = node.expression.expression.getText(parsed);
      if (["t", "rich", "raw"].includes(method) && ts.isStringLiteral(node.arguments[0])) {
        const namespace = namespaces.get(variable);
        if (namespace) {
          const key = node.arguments[0].text;
          const full = key.startsWith(`${namespace}.`) ? key : `${namespace}.${key}`;
          const message = CATALOG.get(full);
          if (message) check(node, full, message);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(parsed);
  return problems;
};

describe("message argument coverage", () => {
  it("should give every t()/t.rich() call the arguments its message asks for", () => {
    const problems: string[] = [];
    for (const file of walkDir(SRC)) {
      problems.push(...scanFile(file));
    }
    expect(problems).toEqual([]);
  });
});
