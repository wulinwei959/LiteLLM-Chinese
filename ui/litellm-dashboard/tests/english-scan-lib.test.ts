import { describe, expect, it } from "vitest";

import { scanSource } from "../scripts/english-scan-lib.mjs";

describe("scanSource", () => {
  it("reports JSX text and copy props", () => {
    const hits = scanSource("sample.tsx", `export const View = () => <div title="Panel">No data</div>;`);
    expect(hits).toEqual([
      { kind: "jsx", text: "No data", count: 1 },
      { kind: "prop:title", text: "Panel", count: 1 },
    ]);
  });

  it("keeps lowercase JSX words that a class-name filter would drop", () => {
    const hits = scanSource("sample.tsx", `export const View = () => <div>{count} selected</div>;`);
    expect(hits).toContainEqual({ kind: "jsx", text: "selected", count: 1 });
  });

  it("reports toast and thrown error strings", () => {
    const hits = scanSource("sample.ts", `toast.info("Request cancelled"); throw new Error("Failed to save");`);
    expect(hits).toContainEqual({ kind: "toast", text: "Request cancelled", count: 1 });
    expect(hits).toContainEqual({ kind: "error", text: "Failed to save", count: 1 });
  });

  it("does not treat other constructors as errors", () => {
    const hits = scanSource("sample.ts", `const cutoff = new Date("2026-09-01T00:00:00Z");`);
    expect(hits.filter((hit) => hit.kind === "error")).toEqual([]);
  });

  it("only reports bare strings when asked for the wide pass", () => {
    const source = `const label = "Wide pass";`;
    expect(scanSource("sample.ts", source)).toEqual([]);
    expect(scanSource("sample.ts", source, { all: true })).toContainEqual({
      kind: "string",
      text: "Wide pass",
      count: 1,
    });
  });
});
