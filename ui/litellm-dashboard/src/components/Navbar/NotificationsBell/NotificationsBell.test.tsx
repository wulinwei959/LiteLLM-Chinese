import { renderWithProviders, screen } from "../../../../tests/test-utils";
import { AUTO_ROUTER_DOCS_URL, NotificationsBell, NotificationsBellView } from "./NotificationsBell";
import type { LatestReleaseInfo } from "@/app/(dashboard)/hooks/latestRelease/useLatestReleaseInfo";
import React from "react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/(dashboard)/hooks/healthReadiness/useHealthReadinessDetails", () => ({
  useHealthReadinessDetails: vi.fn(),
}));
vi.mock("@/app/(dashboard)/hooks/latestRelease/useLatestReleaseInfo", () => ({
  useLatestReleaseInfo: vi.fn(),
}));

import { useHealthReadinessDetails } from "@/app/(dashboard)/hooks/healthReadiness/useHealthReadinessDetails";
import { useLatestReleaseInfo } from "@/app/(dashboard)/hooks/latestRelease/useLatestReleaseInfo";

const RELEASE: LatestReleaseInfo = {
  version: "1.103.0",
  new_features: 12,
  bug_fixes: 30,
  other_updates: 8,
  release_url: "https://github.com/BerriAI/litellm/releases/tag/v1.103.0",
};

const bell = (unread: number) =>
  screen.getByRole("button", { name: unread === 0 ? /^notifications$/i : `Notifications, ${unread} unread` });

const announcement = (title: string) => screen.getByRole("article", { name: title });

describe("NotificationsBellView", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("lists the new version notice above Auto Router when the proxy is behind the latest release", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationsBell />);
    await user.click(screen.getByRole("button", { name: /^通知$/i }));
    expect(screen.getByText(/^LiteLLM 自动路由$/)).toBeInTheDocument();
    const docsBtn = screen.getByRole("link", { name: /^阅读文档$/i });
    expect(docsBtn).toHaveAttribute("href", AUTO_ROUTER_DOCS_URL);
    expect(docsBtn).toHaveAttribute("target", "_blank");
    expect(docsBtn).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("uses singular wording for counts of one", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationsBell />);
    await user.click(screen.getByRole("button", { name: /^通知$/i }));
    expect(screen.getByRole("button", { name: /^标记为已读$/i })).toBeInTheDocument();
  });

  it.each([
    ["the running version is unknown", undefined, RELEASE],
    ["the latest release is unavailable", "1.102.0", null],
    ["the proxy is up to date", "1.103.0", RELEASE],
    ["the proxy is ahead of the latest release", "1.104.0-dev.1", RELEASE],
  ])("lists only Auto Router when %s", async (_case, currentVersion, latestRelease) => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationsBell />);
    await user.click(screen.getByRole("button", { name: /^通知$/i }));
    await user.click(screen.getByRole("button", { name: /^标记为已读$/i }));
    expect(localStorage.getItem("litellmHideAutoRouterAnnouncement")).toBe("true");
    await user.click(screen.getByRole("button", { name: /^通知$/i }));
    expect(screen.queryByRole("button", { name: /^标记为已读$/i })).not.toBeInTheDocument();
  });

  it("keeps the new version notice read across remounts for the same release", async () => {
    const user = userEvent.setup();
    const first = renderWithProviders(<NotificationsBellView currentVersion="1.102.0" latestRelease={RELEASE} />);
    await user.click(bell(2));
    await user.click(screen.getAllByRole("button", { name: /^mark as read$/i })[0]);
    first.unmount();

    renderWithProviders(<NotificationsBellView currentVersion="1.102.0" latestRelease={RELEASE} />);
    expect(bell(1)).toBeInTheDocument();
  });

  it("shows a newer release as unread after an older release was read", async () => {
    const user = userEvent.setup();
    const { rerender } = renderWithProviders(
      <NotificationsBellView currentVersion="1.102.0" latestRelease={RELEASE} />,
    );
    await user.click(bell(2));
    await user.click(screen.getAllByRole("button", { name: /^mark as read$/i })[0]);
    expect(bell(1)).toBeInTheDocument();

    rerender(<NotificationsBellView currentVersion="1.102.0" latestRelease={{ ...RELEASE, version: "1.104.0" }} />);
    expect(bell(2)).toBeInTheDocument();
    expect(announcement("LiteLLM v1.104.0 is available")).toContainElement(
      screen.getAllByRole("button", { name: /^mark as read$/i })[0],
    );
  });

  it("treats a release whose upgrade banner was dismissed as already read", () => {
    localStorage.setItem("litellm:upgradeBannerDismissed:1.103.0", "true");
    renderWithProviders(<NotificationsBellView currentVersion="1.102.0" latestRelease={RELEASE} />);
    expect(bell(1)).toBeInTheDocument();
  });

  it("keeps Auto Router read when it was read before", async () => {
    localStorage.setItem("litellmHideAutoRouterAnnouncement", "true");
    const user = userEvent.setup();
    renderWithProviders(<NotificationsBell />);
    await user.click(screen.getByRole("button", { name: /^通知$/i }));
    expect(screen.queryByRole("button", { name: /^标记为已读$/i })).not.toBeInTheDocument();
  });

  it("syncs sibling bells when one marks an announcement read", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <NotificationsBellView currentVersion="1.102.0" latestRelease={RELEASE} />
        <NotificationsBellView currentVersion="1.102.0" latestRelease={RELEASE} />
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
