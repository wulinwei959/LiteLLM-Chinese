import { describe, it, expect } from "vitest";
import {
  extractMCPToken,
  maskUrl,
  getMaskedAndFullUrl,
  getMCPNetworkAccess,
  networkAccessDescriptionKey,
  networkAccessLabelKey,
  validateMCPServerUrl,
  validateMCPServerName,
  normalizeToolOverrideMap,
} from "./utils";

describe("getMCPNetworkAccess", () => {
  it.each([
    { publicIp: true, explicit: false, kind: "public", reason: "direct" },
    { publicIp: false, explicit: true, kind: "public", reason: "hubPublished" },
    { publicIp: true, explicit: true, kind: "public", reason: "direct" },
    { publicIp: false, explicit: false, kind: "internal", reason: "direct" },
    { publicIp: true, explicit: undefined, kind: "public", reason: "direct" },
    { publicIp: false, explicit: undefined, kind: "unknown", reason: "unknown" },
    { publicIp: undefined, explicit: false, kind: "unknown", reason: "unknown" },
    { publicIp: undefined, explicit: true, kind: "public", reason: "hubPublished" },
    { publicIp: undefined, explicit: undefined, kind: "unknown", reason: "unknown" },
  ])(
    "reports $kind/$reason for network=$publicIp and publication=$explicit",
    ({ publicIp, explicit, kind, reason }) => {
      const access = getMCPNetworkAccess({
        available_on_public_internet: publicIp,
        mcp_info: { server_name: "demo", is_public: true, is_public_explicit: explicit },
      });
      expect(access.kind).toBe(kind);
      expect(access.reason).toBe(reason);
    },
  );

  it("marks every kind with a distinct status dot", () => {
    const dotFor = (publicIp: boolean | undefined, explicit: boolean | undefined) =>
      getMCPNetworkAccess({
        available_on_public_internet: publicIp,
        mcp_info: { server_name: "demo", is_public: true, is_public_explicit: explicit },
      }).dotClassName;
    expect(dotFor(true, false)).toBe("bg-success");
    expect(dotFor(false, false)).toBe("bg-warning");
    expect(dotFor(undefined, undefined)).toBe("bg-border");
  });

  it("routes each reason to the description explaining it", () => {
    const reasonFor = (publicIp: boolean | undefined, explicit: boolean | undefined) =>
      getMCPNetworkAccess({
        available_on_public_internet: publicIp,
        mcp_info: { server_name: "demo", is_public_explicit: explicit },
      }).reason;
    expect(networkAccessDescriptionKey(reasonFor(true, false))).toBe("networkAccess.publicDescription");
    expect(networkAccessDescriptionKey(reasonFor(false, true))).toBe("networkAccess.hubPublishedDescription");
    expect(networkAccessDescriptionKey(reasonFor(undefined, undefined))).toBe("networkAccess.unknownDescription");
  });

  it("routes each kind to its own label key", () => {
    const kindFor = (publicIp: boolean | undefined, explicit: boolean | undefined) =>
      getMCPNetworkAccess({
        available_on_public_internet: publicIp,
        mcp_info: { server_name: "demo", is_public_explicit: explicit },
      }).kind;
    expect(networkAccessLabelKey(kindFor(true, false))).toBe("networkAccess.publicLabel");
    expect(networkAccessLabelKey(kindFor(false, false))).toBe("networkAccess.internalLabel");
    expect(networkAccessLabelKey(kindFor(undefined, undefined))).toBe("networkAccess.unknownLabel");
  });
});

describe("extractMCPToken", () => {
  it("should extract token after /mcp/", () => {
    const result = extractMCPToken("https://example.com/mcp/abc123");
    expect(result).toEqual({ token: "abc123", baseUrl: "https://example.com/mcp/" });
  });

  it("should return null token when URL has no /mcp/ segment", () => {
    const result = extractMCPToken("https://example.com/api/v1");
    expect(result).toEqual({ token: null, baseUrl: "https://example.com/api/v1" });
  });

  it("should return null token when nothing follows /mcp/", () => {
    const result = extractMCPToken("https://example.com/mcp/");
    expect(result).toEqual({ token: null, baseUrl: "https://example.com/mcp/" });
  });
});

describe("maskUrl", () => {
  it("should replace the token with ellipsis", () => {
    expect(maskUrl("https://example.com/mcp/secret-token")).toBe("https://example.com/mcp/...");
  });

  it("should return the original URL when there is no token", () => {
    expect(maskUrl("https://example.com/api")).toBe("https://example.com/api");
  });
});

describe("getMaskedAndFullUrl", () => {
  it("should return hasToken true when a token exists", () => {
    const result = getMaskedAndFullUrl("https://example.com/mcp/tok");
    expect(result).toEqual({ maskedUrl: "https://example.com/mcp/...", hasToken: true });
  });

  it("should return hasToken false when no token exists", () => {
    const result = getMaskedAndFullUrl("https://example.com/api");
    expect(result).toEqual({ maskedUrl: "https://example.com/api", hasToken: false });
  });
});

describe("validateMCPServerUrl", () => {
  it("should resolve for a valid HTTP URL", async () => {
    await expect(validateMCPServerUrl("https://example.com/path")).resolves.toBeUndefined();
  });

  it("should resolve for an empty string", async () => {
    await expect(validateMCPServerUrl("")).resolves.toBeUndefined();
  });

  it("should reject for an invalid URL", async () => {
    await expect(validateMCPServerUrl("not-a-url")).rejects.toBeDefined();
  });
});

describe("validateMCPServerName", () => {
  it("should resolve for a valid underscore name", async () => {
    await expect(validateMCPServerName("my_server")).resolves.toBeUndefined();
  });

  it("should reject names containing hyphens", async () => {
    await expect(validateMCPServerName("my-server")).rejects.toBeDefined();
  });

  it("should reject names containing spaces", async () => {
    await expect(validateMCPServerName("my server")).rejects.toBeDefined();
  });
});

describe("normalizeToolOverrideMap", () => {
  it("returns empty object for nullish input", () => {
    expect(normalizeToolOverrideMap(null)).toEqual({});
    expect(normalizeToolOverrideMap(undefined)).toEqual({});
  });

  it("parses JSON string maps from legacy API responses", () => {
    expect(normalizeToolOverrideMap('{"read_wiki_structure":"browse_docs"}')).toEqual({
      read_wiki_structure: "browse_docs",
    });
  });

  it("passes through object maps unchanged", () => {
    const map = { read_user: "Read User" };
    expect(normalizeToolOverrideMap(map)).toBe(map);
  });
});
