import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import zh from "@/messages/zh-CN.json";

const toastInfo = vi.fn();

vi.mock("@/lib/toast", () => ({
  toast: { info: (...args: unknown[]) => toastInfo(...args) },
  toastMessage: (key: string) => (zh.toast as Record<string, string>)[key],
}));

vi.mock("@/utils/cookieUtils", () => ({
  clearTokenCookies: vi.fn(),
  getCookie: vi.fn(),
  storeLoginToken: vi.fn(),
}));

describe("modelInfoCall empty list hint", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("shows the localized hint when the proxy reports no model list", async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      status: 400,
      text: async () => "No model list passed",
    })) as unknown as typeof fetch;

    const { modelInfoCall } = await import("./networking");

    await expect(modelInfoCall("token", "user", "admin")).rejects.toThrow(zh.toast.networkNotOk);
    expect(toastInfo).toHaveBeenCalledWith(zh.toast.noModelsExist);
  });
});
