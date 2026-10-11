import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import en from "@/messages/en.json";

/**
 * Guards the direction messagesParity does not cover: parity only compares en
 * against zh, so a t() call naming a key neither catalog has passes there while
 * next-intl throws MISSING_MESSAGE at runtime.
 *
 * next-intl resolves a key strictly relative to the namespace it was handed:
 * under useTranslations("usage"), t("common.save") looks up usage.common.save
 * and throws, because there is no root-qualified fallback. Verified against the
 * installed next-intl by rendering such a call, so the guard must not treat a
 * key whose first segment happens to name a top-level namespace as absolute.
 */

const SRC = "src";

function walkPath(root: unknown, dotted: string): unknown {
  return dotted.split(".").reduce<unknown>((node, key) => {
    if (typeof node !== "object" || node === null) return undefined;
    return (node as Record<string, unknown>)[key];
  }, root);
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry !== "node_modules" && entry !== ".next") walk(full, out);
    } else if (/\.tsx?$/.test(entry) && !/\.test\.[tj]sx?$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * A bare t("x") resolves against whichever namespace the file pulled in with
 * useTranslations, so it is satisfied when any of them has the key and broken
 * only when none does. Call sites that receive `t` as a prop cannot be resolved
 * statically, so they are skipped rather than guessed.
 */
function unresolvedKeys(source: string): string[] {
  const scopes = [
    ...new Set(
      [...source.matchAll(/useTranslations\(\s*"([A-Za-z0-9_.-]+)"/g)]
        .map((match) => match[1])
        .filter((namespace) => walkPath(en, namespace) !== undefined),
    ),
  ];
  if (scopes.length === 0) return [];

  const out: string[] = [];
  const seen = new Set<string>();
  for (const call of source.matchAll(/\bt\(\s*"([A-Za-z0-9_-]+(?:\.[A-Za-z0-9_]+)*)"/g)) {
    const key = call[1];
    if (seen.has(key)) continue;
    seen.add(key);

    if (scopes.every((namespace) => walkPath(en, `${namespace}.${key}`) === undefined)) {
      out.push(`${scopes.join("|")}.${key}`);
    }
  }
  return out;
}

describe("message catalog coverage", () => {
  it("should resolve every t() call that names a namespace via useTranslations", () => {
    const unresolved: string[] = [];

    for (const file of walk(SRC)) {
      for (const key of unresolvedKeys(readFileSync(file, "utf8"))) {
        unresolved.push(`${file}: ${key}`);
      }
    }

    expect(unresolved).toEqual([]);
  });
});
