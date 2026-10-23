import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { userConnectionsListCall } from "@/components/networking";

import UserConnectionsPanel from "./UserConnectionsPanel";
import { renderWithProviders } from "../../../tests/test-utils";

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  default: () => ({ accessToken: "token", userId: "u", userRole: "internal_user" }),
}));

vi.mock("@/components/networking", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/components/networking")>();
  return {
    ...actual,
    userConnectionsListCall: vi.fn(),
    userConnectionDeleteCall: vi.fn(),
  };
});

function renderPanel() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return renderWithProviders(
    <QueryClientProvider client={client}>
      <UserConnectionsPanel />
    </QueryClientProvider>,
  );
}

describe("UserConnectionsPanel", () => {
  it("shows an error state with retry instead of an empty list when the query fails", async () => {
    vi.mocked(userConnectionsListCall).mockRejectedValue(new Error("boom"));
    renderPanel();
    expect(await screen.findByText("无法加载你的连接。")).toBeInTheDocument();
    expect(screen.queryByText("没有需要个人连接的凭据。")).not.toBeInTheDocument();
  });

  it("refetches when retry is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(userConnectionsListCall)
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce({ connections: [] });
    renderPanel();
    await user.click(await screen.findByRole("button", { name: "重试" }));
    expect(await screen.findByText("没有需要个人连接的凭据。")).toBeInTheDocument();
    expect(vi.mocked(userConnectionsListCall).mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
