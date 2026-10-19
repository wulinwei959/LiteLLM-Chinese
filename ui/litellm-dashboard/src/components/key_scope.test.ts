import { describe, expect, it } from "vitest";

import type { CommonTranslator } from "@/lib/i18n/translators";

import { deriveKeyModelScope } from "./key_scope";

const t = ((key: string) => key) as unknown as CommonTranslator;

describe("deriveKeyModelScope", () => {
  it("treats unrestricted keys (null/empty allowed_routes) as full model access", () => {
    expect(deriveKeyModelScope(t, null)).toEqual({ hasModelAccess: true, label: null });
    expect(deriveKeyModelScope(t, undefined)).toEqual({ hasModelAccess: true, label: null });
    expect(deriveKeyModelScope(t, [])).toEqual({ hasModelAccess: true, label: null });
  });

  it("classifies SCIM keys as no model access", () => {
    expect(deriveKeyModelScope(t, ["/scim/*"])).toEqual({ hasModelAccess: false, label: "keyScopeScim" });
    expect(deriveKeyModelScope(t, ["/scim/v2/Users", "/scim/v2/Groups"])).toEqual({
      hasModelAccess: false,
      label: "keyScopeScim",
    });
  });

  it("classifies management-only keys as no model access", () => {
    expect(deriveKeyModelScope(t, ["management_routes"])).toEqual({
      hasModelAccess: false,
      label: "keyScopeManagement",
    });
  });

  it("classifies read-only keys as no model access", () => {
    expect(deriveKeyModelScope(t, ["info_routes"])).toEqual({ hasModelAccess: false, label: "keyScopeReadOnly" });
  });

  it("leaves LLM-API and custom scopes with model access (default rendering)", () => {
    expect(deriveKeyModelScope(t, ["llm_api_routes"])).toEqual({ hasModelAccess: true, label: null });
    expect(deriveKeyModelScope(t, ["/chat/completions"])).toEqual({ hasModelAccess: true, label: null });
    expect(deriveKeyModelScope(t, ["management_routes", "llm_api_routes"])).toEqual({
      hasModelAccess: true,
      label: null,
    });
  });

  it("prefers a persisted key_type over allowed_routes for the no-inference buckets", () => {
    expect(deriveKeyModelScope(t, [], "management")).toEqual({ hasModelAccess: false, label: "keyScopeManagement" });
    expect(deriveKeyModelScope(t, [], "read_only")).toEqual({ hasModelAccess: false, label: "keyScopeReadOnly" });
    expect(deriveKeyModelScope(t, ["some_future_mgmt_preset"], "management")).toEqual({
      hasModelAccess: false,
      label: "keyScopeManagement",
    });
  });

  it("falls back to allowed_routes for null/default/llm_api key_type", () => {
    expect(deriveKeyModelScope(t, ["/scim/*"], null)).toEqual({ hasModelAccess: false, label: "keyScopeScim" });
    expect(deriveKeyModelScope(t, ["/scim/*"], "default")).toEqual({ hasModelAccess: false, label: "keyScopeScim" });
    expect(deriveKeyModelScope(t, [], "default")).toEqual({ hasModelAccess: true, label: null });
    expect(deriveKeyModelScope(t, [], "llm_api")).toEqual({ hasModelAccess: true, label: null });
  });
});
