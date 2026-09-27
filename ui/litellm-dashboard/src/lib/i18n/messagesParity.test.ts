import { describe, expect, it } from "vitest";

import en from "@/messages/en.json";
import zhCN from "@/messages/zh-CN.json";

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
