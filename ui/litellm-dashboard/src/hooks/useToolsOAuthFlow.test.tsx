import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as networking from "@/components/networking";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { toast } from "@/lib/toast";
import { setSecureItem } from "@/utils/secureStorage";
import zhMessages from "@/messages/zh-CN.json";
import { useToolsOAuthFlow } from "./useToolsOAuthFlow";

vi.mock("@/components/networking", () => ({
  exchangeMcpOAuthToken: vi.fn(),
  registerMcpOAuthClient: vi.fn(),
  buildMcpOAuthAuthorizeUrl: vi.fn(() => "https://gw.example.com/v1/mcp/server/oauth/server-1/authorize"),
  getProxyBaseUrl: vi.fn(() => ""),
  serverRootPath: "",
}));

vi.mock("@/lib/toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/utils/pkce", () => ({
  generateCodeVerifier: () => "verifier-1",
  generateCodeChallenge: async () => "challenge-1",
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LocaleProvider locale="zh-CN">{children}</LocaleProvider>
);

function renderFlow(options: { gatewayMintsClient?: boolean }) {
  return renderHook(
    () =>
      useToolsOAuthFlow({
        accessToken: "user-token",
        serverId: "server-1",
        serverAlias: "server one",
        userId: "user-1",
        gatewayMintsClient: options.gatewayMintsClient,
        onSuccess: vi.fn(),
      }),
    { wrapper },
  );
}

describe("useToolsOAuthFlow client registration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
    window.localStorage.clear();
    Object.defineProperty(window, "location", {
      value: { href: "https://app.example.com/ui?page=mcp-servers" },
      writable: true,
      configurable: true,
    });
  });

  it("skips browser-side client registration when the gateway mints the client", async () => {
    // Client-forwarded token modes: the gateway's /authorize mints and carries the
    // OAuth client itself, so a browser-side registration would only create an
    // extra orphan client at the IdP. The authorize URL must go out clientless.
    const { result } = renderFlow({ gatewayMintsClient: true });

    await act(async () => {
      await result.current.startOAuthFlow();
    });

    expect(networking.registerMcpOAuthClient).not.toHaveBeenCalled();
    expect(networking.buildMcpOAuthAuthorizeUrl).toHaveBeenCalledWith(
      expect.objectContaining({ serverId: "server-1", clientId: undefined }),
    );
    expect(window.location.href).toBe("https://gw.example.com/v1/mcp/server/oauth/server-1/authorize");
  });

  it("still registers browser-side for servers the gateway does not mint for", async () => {
    // The cells where gatewayMintsClientFor is false keep the browser-held client: an
    // oauth_delegate dcr_bridge server (interactive sign-in) and the legacy oauth2 passthrough both
    // register first, so the minted client_id rides the authorize URL through the front-door relay.
    vi.mocked(networking.registerMcpOAuthClient).mockResolvedValue({ client_id: "reg-client-1" });

    const { result } = renderFlow({});

    await act(async () => {
      await result.current.startOAuthFlow();
    });

    expect(networking.registerMcpOAuthClient).toHaveBeenCalledTimes(1);
    // The dcr_bridge relay rejects registrations without the client's own
    // callback, so the browser must bind its minted client to it.
    expect(networking.registerMcpOAuthClient).toHaveBeenCalledWith(
      "user-token",
      "server-1",
      expect.objectContaining({ redirect_uris: [expect.stringContaining("callback")] }),
    );
    expect(networking.buildMcpOAuthAuthorizeUrl).toHaveBeenCalledWith(
      expect.objectContaining({ serverId: "server-1", clientId: "reg-client-1" }),
    );
  });
});

const FLOW_STATE_KEY = "litellm-tools-mcp-oauth-flow-state";
const RESULT_KEY = "litellm-tools-mcp-oauth-result";

function seedFlowState() {
  const flowState = {
    state: "state-1",
    codeVerifier: "verifier-1",
    serverId: "server-1",
    redirectUri: "https://app.example.com/ui/mcp/oauth/callback",
  };
  setSecureItem(FLOW_STATE_KEY, JSON.stringify(flowState));
}

function renderResumeFlow(onSuccess = vi.fn()) {
  const options = {
    accessToken: "user-token",
    serverId: "server-1",
    userId: "user-1",
    onSuccess,
  };
  return renderHook(() => useToolsOAuthFlow(options), { wrapper });
}

describe("useToolsOAuthFlow localized resume messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it("surfaces the localized state mismatch message through the error state and the toast", async () => {
    seedFlowState();
    setSecureItem(RESULT_KEY, JSON.stringify({ state: "state-2", code: "code-1" }));
    const { result } = renderResumeFlow();

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe(zhMessages.mcpOauthFlow.stateMismatch);
    expect(toast.error).toHaveBeenCalledWith(zhMessages.mcpOauthFlow.stateMismatch);
  });

  it("surfaces the localized connected toast after the token is stored", async () => {
    vi.mocked(networking.exchangeMcpOAuthToken).mockResolvedValue({ access_token: "tok-9" });
    seedFlowState();
    setSecureItem(RESULT_KEY, JSON.stringify({ state: "state-1", code: "code-1" }));
    const onSuccess = vi.fn();
    const { result } = renderResumeFlow(onSuccess);

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(toast.success).toHaveBeenCalledWith(zhMessages.mcpOauthFlow.connectedSuccess);
    expect(onSuccess).toHaveBeenCalledWith("tok-9");
  });
});
