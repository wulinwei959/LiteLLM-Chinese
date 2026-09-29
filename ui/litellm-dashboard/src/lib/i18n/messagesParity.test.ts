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

describe("message catalogs", () => {
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

  /** Drops every apostrophe-quoted span, which ICU already treats as literal. */
  const unquoted = (value: string) => value.replace(/'[^']*'/g, "");

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
