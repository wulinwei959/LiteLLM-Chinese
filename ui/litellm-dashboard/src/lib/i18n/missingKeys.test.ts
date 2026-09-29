import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import en from "@/messages/en.json";

/**
 * Guards the direction messagesParity does not cover: parity only compares en
 * against zh, so a t() call naming a key neither catalog has passes there while
 * next-intl throws MISSING_MESSAGE at runtime.
 */

const SRC = "src";
const NAMESPACES = new Set(Object.keys(en));

function resolve(namespace: string, dotted: string): unknown {
  return dotted.split(".").reduce<unknown>(
    (node, key) => {
      if (typeof node !== "object" || node === null) return undefined;
      return (node as Record<string, unknown>)[key];
    },
    (en as Record<string, unknown>)[namespace],
  );
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
 * next-intl resolves a bare t("x") against whichever namespace the file pulled
 * in with useTranslations. Call sites that receive `t` as a prop cannot be
 * resolved statically, so they are skipped rather than guessed.
 */
function unresolvedKeys(source: string): string[] {
  const scopes = new Set(
    [...source.matchAll(/useTranslations\(\s*"([A-Za-z0-9_-]+)"/g)].map((m) => m[1]).filter((ns) => NAMESPACES.has(ns)),
  );
  if (scopes.size === 0) return [];

  const out: string[] = [];
  const seen = new Set<string>();
  for (const call of source.matchAll(/\bt\(\s*"([A-Za-z0-9_-]+(?:\.[A-Za-z0-9_]+)*)"/g)) {
    const key = call[1];
    if (seen.has(key)) continue;
    seen.add(key);

    const explicit = call[0].match(/"([A-Za-z0-9_-]+)\./);
    const namespaces = explicit && NAMESPACES.has(explicit[1]) ? [explicit[1]] : [...scopes];
    // A bare t("x") resolves against whichever namespace the file brought into
    // scope, so it is satisfied when any of them has the key. Only a key that
    // exists in none of them is genuinely broken.
    if (namespaces.every((ns) => resolve(ns, key) === undefined)) {
      out.push(`${namespaces.join("|")}.${key}`);
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
