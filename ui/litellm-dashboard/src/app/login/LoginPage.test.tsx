import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { renderWithProviders } from "../../../tests/test-utils";
import LoginPage from "./LoginPage";

const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: mockPush,
    replace: mockReplace,
  })),
}));

vi.mock("@/app/(dashboard)/hooks/uiConfig/useUIConfig", () => ({
  useUIConfig: vi.fn(),
}));

vi.mock("@/utils/cookieUtils", () => ({
  clearTokenCookies: vi.fn(),
  getCookieFromDocument: vi.fn(),
}));

vi.mock("@/utils/jwtUtils", () => ({
  isJwtExpired: vi.fn(),
}));

vi.mock("@/components/networking", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/networking")>();
  return {
    ...actual,
    getProxyBaseUrl: vi.fn().mockReturnValue("http://localhost:4000"),
  };
});

vi.mock("@/app/(dashboard)/hooks/login/useLogin", () => ({
  useLogin: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  })),
}));

vi.mock("@/hooks/useWorker", () => ({
  useWorker: vi.fn(() => ({
    isControlPlane: false,
    workers: [],
    selectedWorkerId: null,
    selectedWorker: null,
    selectWorker: vi.fn(),
    disconnectFromWorker: vi.fn(),
  })),
}));

import { useUIConfig } from "@/app/(dashboard)/hooks/uiConfig/useUIConfig";
import { getCookieFromDocument } from "@/utils/cookieUtils";
import { isJwtExpired } from "@/utils/jwtUtils";

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  it("should render", async () => {
    (useUIConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        auto_redirect_to_sso: false,
        server_root_path: "/",
        proxy_base_url: null,
        sso_configured: false,
      },
      isLoading: false,
    });
    (getCookieFromDocument as ReturnType<typeof vi.fn>).mockReturnValue(null);

    renderWithProviders(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "登录" })).toBeInTheDocument();
    });
  });

  it("should render the default-credentials hint with the code-styled values", async () => {
    // The hint is a rich-text message: its <code> tag needs a handler at the
    // call site, and a mismatch makes t.rich() throw instead of rendering.
    (useUIConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        auto_redirect_to_sso: false,
        server_root_path: "/",
        proxy_base_url: null,
        sso_configured: false,
        hide_default_credentials_hint: false,
      },
      isLoading: false,
    });
    (getCookieFromDocument as ReturnType<typeof vi.fn>).mockReturnValue(null);

    renderWithProviders(<LoginPage />);

    const hint = await screen.findByText(/默认情况下，用户名为/, undefined, { timeout: 2_000 });
    expect(hint).toHaveTextContent("admin");
    expect(hint).toHaveTextContent("MASTER_KEY");
    expect(within(hint).getByText("admin").tagName).toBe("CODE");
    expect(within(hint).getByText("MASTER_KEY").tagName).toBe("CODE");
  });

  it("should call router.replace to dashboard when jwt is valid", async () => {
    const validToken = "valid-token";
    (useUIConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        auto_redirect_to_sso: false,
        server_root_path: "/",
        proxy_base_url: null,
        sso_configured: false,
      },
      isLoading: false,
    });
    (getCookieFromDocument as ReturnType<typeof vi.fn>).mockReturnValue(validToken);
    (isJwtExpired as ReturnType<typeof vi.fn>).mockReturnValue(false);

    renderWithProviders(<LoginPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/ui");
    });
  });

  it("should call router.push to SSO when jwt is invalid and auto_redirect_to_sso is true", async () => {
    const invalidToken = "invalid-token";
    (useUIConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        auto_redirect_to_sso: true,
        server_root_path: "/",
        proxy_base_url: null,
        sso_configured: true,
      },
      isLoading: false,
    });
    (getCookieFromDocument as ReturnType<typeof vi.fn>).mockReturnValue(invalidToken);
    (isJwtExpired as ReturnType<typeof vi.fn>).mockReturnValue(true);

    renderWithProviders(<LoginPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("http://localhost:4000/sso/key/generate");
    });
  });

  it("should not call router when jwt is invalid and auto_redirect_to_sso is false", async () => {
    const invalidToken = "invalid-token";
    (useUIConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        auto_redirect_to_sso: false,
        server_root_path: "/",
        proxy_base_url: null,
        sso_configured: false,
      },
      isLoading: false,
    });
    (getCookieFromDocument as ReturnType<typeof vi.fn>).mockReturnValue(invalidToken);
    (isJwtExpired as ReturnType<typeof vi.fn>).mockReturnValue(true);

    renderWithProviders(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "登录" })).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("should send user to dashboard when jwt is valid even if auto_redirect_to_sso is true", async () => {
    const validToken = "valid-token";
    (useUIConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        auto_redirect_to_sso: true,
        server_root_path: "/",
        proxy_base_url: null,
        sso_configured: true,
      },
      isLoading: false,
    });
    (getCookieFromDocument as ReturnType<typeof vi.fn>).mockReturnValue(validToken);
    (isJwtExpired as ReturnType<typeof vi.fn>).mockReturnValue(false);

    renderWithProviders(<LoginPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/ui");
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should show alert when admin_ui_disabled is true", async () => {
    (useUIConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        admin_ui_disabled: true,
        server_root_path: "/",
        proxy_base_url: null,
        sso_configured: false,
      },
      isLoading: false,
    });
    (getCookieFromDocument as ReturnType<typeof vi.fn>).mockReturnValue(null);

    renderWithProviders(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("管理界面已禁用")).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("should show Login with SSO button when sso_configured is true", async () => {
    (useUIConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        auto_redirect_to_sso: false,
        server_root_path: "/",
        proxy_base_url: null,
        sso_configured: true,
      },
      isLoading: false,
    });
    (getCookieFromDocument as ReturnType<typeof vi.fn>).mockReturnValue(null);
    (isJwtExpired as ReturnType<typeof vi.fn>).mockReturnValue(true);

    renderWithProviders(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "登录" })).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "使用 SSO 登录" })).toBeInTheDocument();
  });

  it("should show disabled Login with SSO button with popover when sso_configured is false", async () => {
    (useUIConfig as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        auto_redirect_to_sso: false,
        server_root_path: "/",
        proxy_base_url: null,
        sso_configured: false,
      },
      isLoading: false,
    });
    (getCookieFromDocument as ReturnType<typeof vi.fn>).mockReturnValue(null);
    (isJwtExpired as ReturnType<typeof vi.fn>).mockReturnValue(true);

    renderWithProviders(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "登录" })).toBeInTheDocument();
    });

    const ssoButton = screen.getByRole("button", { name: "使用 SSO 登录" });
    expect(ssoButton).toBeInTheDocument();
    expect(ssoButton).toBeDisabled();
  });

  describe("URL ?token= legacy path is rejected (security regression test)", () => {
    const originalLocation = window.location;

    beforeEach(() => {
      Object.defineProperty(window, "location", {
        value: {
          ...originalLocation,
          href: "http://localhost:3000/ui/login?token=attacker.jwt.value",
          pathname: "/ui/login",
          search: "?token=attacker.jwt.value",
        },
        writable: true,
      });
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
    });

    afterEach(() => {
      Object.defineProperty(window, "location", {
        value: originalLocation,
        writable: true,
      });
    });

    it("must not set a token cookie or redirect to /ui/?login=success when ?token= is in the URL", async () => {
      (useUIConfig as ReturnType<typeof vi.fn>).mockReturnValue({
        data: {
          auto_redirect_to_sso: false,
          server_root_path: "/",
          proxy_base_url: null,
          sso_configured: false,
        },
        isLoading: false,
      });
      (getCookieFromDocument as ReturnType<typeof vi.fn>).mockReturnValue(null);
      (isJwtExpired as ReturnType<typeof vi.fn>).mockReturnValue(false);

      renderWithProviders(<LoginPage />);

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "登录" })).toBeInTheDocument();
      });

      expect(document.cookie).not.toContain("token=attacker.jwt.value");
      expect(mockReplace).not.toHaveBeenCalledWith("/ui/?login=success");
    });

    it("must not overwrite an existing valid session cookie when ?token= is in the URL", async () => {
      (useUIConfig as ReturnType<typeof vi.fn>).mockReturnValue({
        data: {
          auto_redirect_to_sso: false,
          server_root_path: "/",
          proxy_base_url: null,
          sso_configured: false,
        },
        isLoading: false,
      });
      (getCookieFromDocument as ReturnType<typeof vi.fn>).mockReturnValue("legitimate-session-jwt");
      (isJwtExpired as ReturnType<typeof vi.fn>).mockReturnValue(false);

      renderWithProviders(<LoginPage />);

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith("/ui");
      });

      expect(document.cookie).not.toContain("token=attacker.jwt.value");
      expect(mockReplace).not.toHaveBeenCalledWith("/ui/?login=success");
    });
  });
});
