import { describe, expect, it } from "vitest";

import en from "@/messages/en.json";
import zhCN from "@/messages/zh-CN.json";

function collectEntries(node: unknown, prefix: string): [path: string, value: string][] {
  if (typeof node === "object" && node !== null) {
    return Object.entries(node).flatMap(([key, value]) =>
      collectEntries(value, prefix === "" ? key : `${prefix}.${key}`),
    );
  }
  return [[prefix, node as string]];
}

function collectKeyPaths(node: unknown, prefix: string): string[] {
  if (typeof node === "object" && node !== null) {
    return Object.entries(node).flatMap(([key, value]) =>
      collectKeyPaths(value, prefix === "" ? key : `${prefix}.${key}`),
    );
  }
  return [prefix];
}

/**
 * Top-level ICU argument names of a message, e.g. `{name}` and the `count` in
 * `{count, plural, one {...} other {...}}`. Rich-text tags (`{strong}`, `{/link}`)
 * are not arguments and are skipped; `#` inside a plural arm refers to the
 * enclosing number and is always legitimate.
 */
/**
 * The message with ICU-quoted spans removed. ICU only treats an apostrophe as
 * opening a quoted span when the next character is a syntax character
 * (`{`, `}`, `#`, `|`, `<`, or another apostrophe); a possessive like
 * "caller's" stays literal. `''` is an escaped apostrophe.
 */
function stripIcuQuotes(value: string): string {
  const SYNTAX = new Set(["{", "}", "#", "|", "<", "'"]);
  let out = "";
  let i = 0;
  while (i < value.length) {
    if (value[i] === "'" && SYNTAX.has(value[i + 1] ?? "")) {
      if (value[i + 1] === "'") {
        out += "'";
        i += 2;
        continue;
      }
      let j = i + 1;
      while (j < value.length) {
        if (value[j] === "'") {
          if (value[j + 1] === "'") {
            j += 2;
            continue;
          }
          break;
        }
        j++;
      }
      i = Math.min(j + 1, value.length);
      continue;
    }
    out += value[i];
    i++;
  }
  return out;
}

function collectArgumentNames(value: string): string[] {
  const unquoted = stripIcuQuotes(value);
  const names: string[] = [];
  let depth = 0;
  let headStart = -1;
  for (let i = 0; i < unquoted.length; i++) {
    const char = unquoted[i];
    if (char === "{") {
      if (depth === 0) headStart = i + 1;
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0 && headStart >= 0) {
        const head = unquoted.slice(headStart, i).split(",")[0].trim();
        if (head !== "" && !head.startsWith("/") && head !== "#") names.push(head);
        headStart = -1;
      }
    }
  }
  return [...new Set(names)];
}

describe("message contract", () => {
  const enEntries = collectEntries(en, "");
  const zhMap = new Map(collectEntries(zhCN, ""));

  it("should not have empty translations on either side", () => {
    const empty = [
      ...enEntries.filter(([, value]) => value.trim() === "").map(([path]) => `en.${path}`),
      ...[...zhMap.entries()].filter(([, value]) => value.trim() === "").map(([path]) => `zh-CN.${path}`),
    ];

    expect(empty).toEqual([]);
  });

  it("should use the same argument names in both languages", () => {
    const mismatched = enEntries.flatMap(([path, enValue]) => {
      const zhValue = zhMap.get(path);
      if (zhValue === undefined) return [];
      const enArgs = collectArgumentNames(enValue);
      const zhArgs = collectArgumentNames(zhValue);
      return [
        ...enArgs.filter((name) => !zhArgs.includes(name)).map((name) => `${path}: en has {${name}}, zh-CN does not`),
        ...zhArgs.filter((name) => !enArgs.includes(name)).map((name) => `${path}: zh-CN has {${name}}, en does not`),
      ];
    });

    expect(mismatched).toEqual([]);
  });
});

describe("message catalogs", () => {
  it("should not contain flat dotted keys", () => {
    // next-intl resolves "a.b" by walking objects, so a literal property named
    // "a.b" never resolves at runtime — yet key-tree walks, the TS types, and
    // missingKeys all see the same path string and stay green. Only this test
    // looks at the raw property names.
    const flat: string[] = [];
    const scan = (node: unknown, prefix: string) => {
      if (typeof node === "object" && node !== null) {
        for (const [key, value] of Object.entries(node)) {
          if (key.includes(".")) flat.push(prefix === "" ? key : `${prefix}.${key}`);
          scan(value, prefix === "" ? key : `${prefix}.${key}`);
        }
      }
    };
    scan(en, "");
    scan(zhCN, "");

    expect([...new Set(flat)]).toEqual([]);
  });

  it("should keep the zh-CN key tree identical to en", () => {
    const enKeys = collectKeyPaths(en, "").sort();
    const zhKeys = collectKeyPaths(zhCN, "").sort();
    expect(zhKeys).toEqual(enKeys);
  });

  it("should not be empty", () => {
    expect(collectKeyPaths(en, "").length).toBeGreaterThan(0);
    expect(collectKeyPaths(zhCN, "").length).toBeGreaterThan(0);
  });
});

describe("message syntax", () => {
  // ICU reads <...> as a rich-text tag, so an RFC example such as
  // api://<app-id>/.default makes t() throw INVALID_MESSAGE: UNCLOSED_TAG at
  // render time. The brackets have to be quoted ('<app-id>') to render literally.
  // A <...> already inside a quoted span is literal to ICU, so it needs no help,
  // and a message rendered through t.rich is allowed to keep its real tags.
  const RICH_TAGS = new Set(["strong", "b", "i", "em", "link", "code", "br"]);
  const pairs = [...collectEntries(en, ""), ...collectEntries(zhCN, "")];

  /** Drops ICU-quoted spans; a possessive like "caller's" stays literal. */
  const unquoted = (value: string) => stripIcuQuotes(value);

  it("should only leave angle brackets that belong to a rich-text tag", () => {
    const offenders = pairs
      .filter(([, value]) => typeof value === "string")
      .flatMap(([path, value]) =>
        [...unquoted(value).matchAll(/<\/?([^<>]+)>/g)]
          .filter((match) => !RICH_TAGS.has(match[1].trim().toLowerCase()))
          .map((match) => `${path}: <${match[1]}>`),
      );

    expect([...new Set(offenders)]).toEqual([]);
  });

  it("should close every rich-text tag it opens", () => {
    // The handler is keyed by the tag name, so <strong>{name}</strong> needs no
    // {strong} placeholder; only the matching close matters.
    const unpaired = pairs
      .filter(([, value]) => typeof value === "string")
      .flatMap(([path, value]) => {
        const body = unquoted(value);
        const opened = [...body.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)\s*>/g)].map((m) => m[1].toLowerCase());
        return opened.filter((tag) => !body.includes(`</${tag}>`)).map((tag) => `${path}: <${tag}>`);
      });

    expect([...new Set(unpaired)]).toEqual([]);
  });

  it("should quote every brace that is not a placeholder", () => {
    // ICU reads {...} as an argument, so a JSON example embedded in a tooltip
    // makes t() throw INVALID_MESSAGE: MALFORMED_ARGUMENT. Legitimate forms are a
    // bare identifier, a t.rich close tag {/tag}, a plural/select body carrying a
    // comma, and the {#} number placeholder inside a plural body.
    const isLegitimate = (body: string) =>
      body === "#" || /^[a-zA-Z][a-zA-Z0-9_]*$/.test(body) || /^\/[a-zA-Z][a-zA-Z0-9_]*$/.test(body) || /,/.test(body);

    const offenders = pairs
      .filter(([, value]) => typeof value === "string")
      .flatMap(([path, value]) =>
        [...unquoted(value).matchAll(/\{([^}]*)\}/g)]
          .filter((match) => !isLegitimate(match[1].trim()))
          .map((match) => `${path}: {${match[1]}}`),
      );

    expect([...new Set(offenders)]).toEqual([]);
  });
});
