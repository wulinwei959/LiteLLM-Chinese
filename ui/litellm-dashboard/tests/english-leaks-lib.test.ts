import { describe, expect, it } from "vitest";

import { findNewEnglishHits, findResolvedEnglishHits } from "../scripts/english-leaks-lib.mjs";

const hit = (file: string, kind: string, text: string) => ({ file, kind, text });

describe("findNewEnglishHits", () => {
  it("reports hits missing from the baseline", () => {
    expect(
      findNewEnglishHits([hit("a.tsx", "jsx", "Save"), hit("b.tsx", "jsx", "Cancel")], [hit("a.tsx", "jsx", "Save")]),
    ).toEqual([hit("b.tsx", "jsx", "Cancel")]);
  });

  it("treats the same text in a different file as new", () => {
    expect(findNewEnglishHits([hit("b.tsx", "jsx", "Save")], [hit("a.tsx", "jsx", "Save")])).toEqual([
      hit("b.tsx", "jsx", "Save"),
    ]);
  });
});

describe("findResolvedEnglishHits", () => {
  it("reports baseline entries no longer present", () => {
    expect(
      findResolvedEnglishHits(
        [hit("a.tsx", "jsx", "Save")],
        [hit("a.tsx", "jsx", "Save"), hit("b.tsx", "jsx", "Cancel")],
      ),
    ).toEqual([hit("b.tsx", "jsx", "Cancel")]);
  });

  it("reports nothing when the baseline matches", () => {
    expect(findResolvedEnglishHits([hit("a.tsx", "jsx", "Save")], [hit("a.tsx", "jsx", "Save")])).toEqual([]);
  });
});
