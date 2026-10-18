import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as networking from "@/components/networking";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { toast } from "@/lib/toast";
import { setSecureItem } from "@/utils/secureStorage";
import zhMessages from "@/messages/zh-CN.json";
import { useUserMcpOAuthFlow } from "./useUserMcpOAuthFlow";

vi.mock("@/components/networking", () => ({
  exchangeMcpOAuthToken: vi.fn(),
  registerMcpOAuthClient: vi.fn(),
  storeMCPOAuthUserCredential: vi.fn(),
  buildMcpOAuthAuthorizeUrl: vi.fn(),
}));

vi.mock("@/lib/toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LocaleProvider locale="zh-CN">{children}</LocaleProvider>
);

const FLOW_STATE_KEY = "litellm-user-mcp-oauth-flow-state";
const RESULT_KEY = "litellm-user-mcp-oauth-result";

function seedFlowState() {
  const flowState = {
    state: "state-1",
    codeVerifier: "verifier-1",
    serverId: "server-1",
    redirectUri: "https://app.example.com/ui/mcp/oauth/callback",
  };
  setSecureItem(FLOW_STATE_KEY, JSON.stringify(flowState));
}

describe("useUserMcpOAuthFlow localized resume messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
    window.localStorage.clear();
  });

  it("surfaces the localized resume failure when the stored callback is unparseable", async () => {
    seedFlowState();
    setSecureItem(RESULT_KEY, "{not json");
    const { result } = renderHook(
      () => useUserMcpOAuthFlow({ accessToken: "user-token", serverId: "server-1", onSuccess: vi.fn() }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe(zhMessages.mcpOauthFlow.resumeFailed);
  });

  it("surfaces the localized state mismatch message through the error state and the toast", async () => {
    seedFlowState();
    setSecureItem(RESULT_KEY, JSON.stringify({ state: "state-2", code: "code-1" }));
    const { result } = renderHook(
      () => useUserMcpOAuthFlow({ accessToken: "user-token", serverId: "server-1", onSuccess: vi.fn() }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe(zhMessages.mcpOauthFlow.stateMismatch);
    expect(toast.error).toHaveBeenCalledWith(zhMessages.mcpOauthFlow.stateMismatch);
  });

  it("surfaces the localized connected toast after the credential is stored", async () => {
    vi.mocked(networking.exchangeMcpOAuthToken).mockResolvedValue({ access_token: "tok-123" });
    seedFlowState();
    setSecureItem(RESULT_KEY, JSON.stringify({ state: "state-1", code: "code-1" }));
    const onSuccess = vi.fn();
    const { result } = renderHook(
      () => useUserMcpOAuthFlow({ accessToken: "user-token", serverId: "server-1", onSuccess }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(networking.storeMCPOAuthUserCredential).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith(zhMessages.mcpOauthFlow.connectedSuccess);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
