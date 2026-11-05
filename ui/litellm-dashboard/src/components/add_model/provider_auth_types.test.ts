import { describe, expect, it } from "vitest";

import {
  PROVIDER_AUTH_TYPES,
  authTypeFieldKeys,
  authTypesFor,
  hiddenAuthFieldKeys,
  inferAuthTypeId,
  type ProviderAuthType,
} from "./provider_auth_types";
import { Providers } from "../provider_info_helpers";
import type { ModelsAddModelTranslator } from "@/lib/i18n/translators";
import { enMessagesFor } from "@/../tests/i18nStub";

const t = enMessagesFor("models.addModel") as unknown as ModelsAddModelTranslator;

const expected = (provider: keyof typeof Providers) =>
  PROVIDER_AUTH_TYPES[provider]!.map((authType) => ({
    ...authType,
    label: t(authType.labelKey),
    description: t(authType.descriptionKey),
  }));

describe("provider auth types", () => {
  it("resolves provider enum keys and display names", () => {
    expect(authTypesFor(t, "MICROSOFT_365_COPILOT")).toEqual(expected("MICROSOFT_365_COPILOT"));
    expect(authTypesFor(t, Providers.MICROSOFT_365_COPILOT)).toEqual(expected("MICROSOFT_365_COPILOT"));
    expect(authTypesFor(t, null)).toEqual([]);
    expect(authTypesFor(t, "unknown")).toEqual([]);
  });

  it("returns the unique field keys for every auth type", () => {
    expect(authTypeFieldKeys("MICROSOFT_365_COPILOT")).toEqual([
      "token_exchange_endpoint",
      "token_exchange_profile",
      "client_id",
      "client_secret",
      "token_exchange_scope",
      "token_exchange_audience",
      "api_key",
    ]);
    expect(authTypeFieldKeys("GITHUB_COPILOT")).toContain("github_copilot_host");
  });

  it("infers auth types from required fields and falls back when only optional defaults are present", () => {
    const authTypes = authTypesFor(t, "MICROSOFT_365_COPILOT");
    const delegatedValues: Record<string, unknown> = {
      token_exchange_profile: "jwt_bearer_obo",
      token_exchange_scope: "https://graph.microsoft.com/.default",
      api_key: "delegated-token",
    };
    const emptyValues: Record<string, unknown> = {
      token_exchange_endpoint: "",
      client_id: null,
      client_secret: undefined,
      token_exchange_profile: "jwt_bearer_obo",
      token_exchange_scope: "https://graph.microsoft.com/.default",
      api_key: "",
    };

    expect(inferAuthTypeId(authTypes, delegatedValues)).toBe("static_token");
    expect(inferAuthTypeId(authTypes, emptyValues)).toBe("oauth_token_exchange");
    expect(inferAuthTypeId([], {})).toBe("");
  });

  it("hides only non-selected keys not shared with the selected type", () => {
    const authTypes: readonly ProviderAuthType[] = [
      {
        id: "first",
        labelKey: "authTypes.copilotSharedLabel",
        descriptionKey: "authTypes.copilotSharedDescription",
        fieldKeys: ["shared", "first_key"],
        requiredFieldKeys: ["first_key"],
      },
      {
        id: "second",
        labelKey: "authTypes.copilotSharedLabel",
        descriptionKey: "authTypes.copilotSharedDescription",
        fieldKeys: ["shared", "second_key"],
        requiredFieldKeys: ["second_key"],
      },
      {
        id: "third",
        labelKey: "authTypes.copilotSharedLabel",
        descriptionKey: "authTypes.copilotSharedDescription",
        fieldKeys: ["third_key"],
        requiredFieldKeys: ["third_key"],
      },
    ];

    expect(hiddenAuthFieldKeys(authTypes, "first")).toEqual(["second_key", "third_key"]);
  });

  it("defaults GitHub Copilot to shared device login and recognises a stored per-user credential", () => {
    const authTypes = authTypesFor(t, "GITHUB_COPILOT");

    expect(inferAuthTypeId(authTypes, { api_key: "" })).toBe("shared_device_login");
    expect(inferAuthTypeId(authTypes, { github_copilot_auth_type: "per_user_oauth" })).toBe("per_user_oauth");
    expect(hiddenAuthFieldKeys(authTypes, "per_user_oauth")).toEqual(["api_base", "api_key"]);
    expect(hiddenAuthFieldKeys(authTypes, "shared_device_login")).toEqual([
      "github_copilot_auth_type",
      "github_copilot_host",
    ]);
  });
});
