import { describe, expect, it } from "vitest";

import {
  findNewKeys,
  findResolvedKeys,
  keysWithHan,
  keysWithoutHan,
  leafEntries,
} from "../scripts/zh-coverage-lib.mjs";

const entries = leafEntries({ a: { b: "请求已取消", c: "RPM：{value}" }, d: "Logo" });

describe("leafEntries", () => {
  it("flattens nested namespaces into dotted key paths", () => {
    expect(entries).toEqual([
      ["a.b", "请求已取消"],
      ["a.c", "RPM：{value}"],
      ["d", "Logo"],
    ]);
  });
});

describe("keysWithoutHan", () => {
  it("flags zh values that carry no Chinese characters", () => {
    expect(keysWithoutHan(entries)).toEqual(["a.c", "d"]);
  });
});

describe("keysWithHan", () => {
  it("flags en values that carry Chinese characters", () => {
    expect(keysWithHan(entries)).toEqual(["a.b"]);
  });
});

describe("findNewKeys", () => {
  it("reports keys missing from the baseline", () => {
    expect(findNewKeys(["a", "b"], ["a"])).toEqual(["b"]);
  });

  it("reports nothing when the baseline matches", () => {
    expect(findNewKeys(["a", "b"], ["a", "b"])).toEqual([]);
  });
});

describe("findResolvedKeys", () => {
  it("reports baseline keys no longer present", () => {
    expect(findResolvedKeys(["a"], ["a", "b"])).toEqual(["b"]);
  });
});
