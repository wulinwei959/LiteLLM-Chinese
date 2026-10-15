import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DeleteSSOSettingsModal from "./DeleteSSOSettingsModal";
import { LocaleProvider } from "@/contexts/LocaleContext";

vi.mock("@/app/(dashboard)/hooks/sso/useSSOSettings", () => ({
  useSSOSettings: vi.fn(() => ({
    data: {
      values: {
        google_client_id: "test-client-id",
      },
    },
  })),
}));

vi.mock("@/app/(dashboard)/hooks/sso/useEditSSOSettings", () => ({
  useEditSSOSettings: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  default: vi.fn(() => ({
    accessToken: "test-token",
    userId: "test-user-id",
    userRole: "proxy_admin",
  })),
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

describe("DeleteSSOSettingsModal", () => {
  it("should render", () => {
    const onCancel = vi.fn();
    const onSuccess = vi.fn();
    const queryClient = createQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <LocaleProvider locale="zh-CN">
          <DeleteSSOSettingsModal isVisible={true} onCancel={onCancel} onSuccess={onSuccess} />
        </LocaleProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByText("确认清除 SSO 设置")).toBeInTheDocument();
    expect(screen.getByText("确定要清除所有 SSO 设置吗？更改后用户将无法再通过 SSO 登录。")).toBeInTheDocument();
  });
});
