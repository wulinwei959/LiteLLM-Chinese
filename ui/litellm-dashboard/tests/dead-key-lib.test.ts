import { describe, it, expect } from "vitest";
import { findNewDeadKeys, findResolvedDeadKeys, parseDeadKeysOutput } from "../scripts/dead-key-lib.mjs";

const scannerOutput = `catalog=100 dead=3

## common  (2)
   common.deadOne  => 'First'
   common.deadTwo  => 'Second'

## teams  (1)
   teams.deadThree  => 'Third'
`;

describe("parseDeadKeysOutput", () => {
  it("collects the dead key paths from the scanner report", () => {
    expect(parseDeadKeysOutput(scannerOutput)).toEqual(["common.deadOne", "common.deadTwo", "teams.deadThree"]);
  });

  it("returns nothing when the report lists no dead keys", () => {
    expect(parseDeadKeysOutput("catalog=100 dead=0\n")).toEqual([]);
  });

  it("ignores the summary line", () => {
    expect(parseDeadKeysOutput(scannerOutput)).not.toContain("catalog=100");
  });
});

describe("findNewDeadKeys", () => {
  it("reports keys that are not in the baseline", () => {
    expect(findNewDeadKeys(["a.b", "c.d"], ["a.b"])).toEqual(["c.d"]);
  });

  it("reports every key when the baseline is empty", () => {
    expect(findNewDeadKeys(["a.b", "c.d"], [])).toEqual(["a.b", "c.d"]);
  });
});

describe("findResolvedDeadKeys", () => {
  it("reports baseline keys that are no longer dead", () => {
    expect(findResolvedDeadKeys(["a.b"], ["a.b", "c.d"])).toEqual(["c.d"]);
  });

  it("reports nothing when the baseline matches", () => {
    expect(findResolvedDeadKeys(["a.b"], ["a.b"])).toEqual([]);
  });
});
