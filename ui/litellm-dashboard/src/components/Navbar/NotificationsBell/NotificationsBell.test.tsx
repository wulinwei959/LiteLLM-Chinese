import { renderWithProviders, screen } from "../../../../tests/test-utils";
import { NotificationsBell, AUTO_ROUTER_DOCS_URL } from "./NotificationsBell";
import React from "react";
import userEvent from "@testing-library/user-event";

describe("NotificationsBell", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should open notifications with Auto Router details and docs link", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationsBell />);
    await user.click(screen.getByRole("button", { name: /^通知$/i }));
    expect(screen.getByText(/^LiteLLM 自动路由$/)).toBeInTheDocument();
    const docsBtn = screen.getByRole("link", { name: /^阅读文档$/i });
    expect(docsBtn).toHaveAttribute("href", AUTO_ROUTER_DOCS_URL);
    expect(docsBtn).toHaveAttribute("target", "_blank");
    expect(docsBtn).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should offer mark as read when announcement is unread", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationsBell />);
    await user.click(screen.getByRole("button", { name: /^通知$/i }));
    expect(screen.getByRole("button", { name: /^标记为已读$/i })).toBeInTheDocument();
  });

  it("should hide mark as read and persist after marking read", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationsBell />);
    await user.click(screen.getByRole("button", { name: /^通知$/i }));
    await user.click(screen.getByRole("button", { name: /^标记为已读$/i }));
    expect(localStorage.getItem("litellmHideAutoRouterAnnouncement")).toBe("true");
    await user.click(screen.getByRole("button", { name: /^通知$/i }));
    expect(screen.queryByRole("button", { name: /^标记为已读$/i })).not.toBeInTheDocument();
  });

  it("should not show mark as read when previously dismissed", async () => {
    localStorage.setItem("litellmHideAutoRouterAnnouncement", "true");
    const user = userEvent.setup();
    renderWithProviders(<NotificationsBell />);
    await user.click(screen.getByRole("button", { name: /^通知$/i }));
    expect(screen.queryByRole("button", { name: /^标记为已读$/i })).not.toBeInTheDocument();
  });

  it("should sync sibling instances when one is dismissed", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <div data-testid="bell-a">
          <NotificationsBell />
        </div>
        <div data-testid="bell-b">
          <NotificationsBell />
        </div>
      </>,
    );

    // Both bells start unread → both render the "标记为已读" affordance once opened.
    const [bellA, bellB] = screen.getAllByRole("button", { name: /^通知$/i });
    await user.click(bellA);
    await user.click(screen.getByRole("button", { name: /^标记为已读$/i }));

    // Dismissing in bell A must also clear bell B without a remount.
    await user.click(bellB);
    expect(screen.queryByRole("button", { name: /^标记为已读$/i })).not.toBeInTheDocument();
  });
});
