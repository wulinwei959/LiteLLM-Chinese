import { describe, expect, it } from "vitest";

import { englishPhrases, findingKey, stubFor } from "../scripts/rendered-ui-lib.mjs";

const allowed = new Set(["LiteLLM", "RPM"]);

describe("englishPhrases", () => {
  it("finds the English word groups a page still shows", () => {
    const text = "虚拟密钥 花费 $12.50 Enter 全部 Done";
    expect(englishPhrases(text, allowed)).toEqual(["Done", "Enter"]);
  });

  it("leaves out the words the allowlist covers", () => {
    expect(englishPhrases("LiteLLM RPM", allowed)).toEqual([]);
  });

  it("leaves out a group whose every word is allowed", () => {
    expect(englishPhrases("LiteLLM and RPM", new Set(["LiteLLM", "and", "RPM"]))).toEqual([]);
  });

  it("reports a multi-word group as one phrase", () => {
    expect(englishPhrases("Sign in to continue", allowed)).toEqual(["Sign in to continue"]);
  });

  it("ignores numbers and punctuation", () => {
    expect(englishPhrases("花费 $1,234.56 (50%)", allowed)).toEqual([]);
  });
});

describe("stubFor", () => {
  const stubs = [
    ["/team/list", { teams: [] }],
    ["/v2/team/list", { teams: [], total_pages: 1 }],
  ];

  it("matches the longest fragment so a versioned path wins", () => {
    expect(stubFor(stubs, "/v2/team/list")).toEqual({ teams: [], total_pages: 1 });
  });

  it("falls back to a shorter fragment", () => {
    expect(stubFor(stubs, "/team/list")).toEqual({ teams: [] });
  });

  it("returns nothing for a path it does not know", () => {
    expect(stubFor(stubs, "/unknown/path")).toBeUndefined();
  });
});

describe("findingKey", () => {
  it("identifies a finding by page, kind and text", () => {
    expect(findingKey({ page: "home", kind: "error", text: "boom" })).toBe("home|error|boom");
  });
});
