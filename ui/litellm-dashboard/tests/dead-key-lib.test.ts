import { describe, it, expect } from "vitest";
import {
  findNewDeadKeys,
  findResolvedDeadKeys,
  parseDeadKeysOutput,
  selectPythonInterpreter,
} from "../scripts/dead-key-lib.mjs";

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

describe("selectPythonInterpreter", () => {
  it("prefers python3 when both names resolve", () => {
    expect(selectPythonInterpreter((candidate) => candidate === "python3" || candidate === "python")).toBe("python3");
  });

  it("falls back to python when python3 is unavailable", () => {
    expect(selectPythonInterpreter((candidate) => candidate === "python")).toBe("python");
  });

  it("returns null when neither name resolves", () => {
    expect(selectPythonInterpreter(() => false)).toBeNull();
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
