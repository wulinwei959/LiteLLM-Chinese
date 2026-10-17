import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders as render } from "../../tests/test-utils";
import { createTranslator } from "next-intl";

import en from "@/messages/en.json";
import zhCN from "@/messages/zh-CN.json";

import { describeRelease, UpgradeBanner, UpgradeBannerView } from "./UpgradeBanner";

const tEn = createTranslator({ locale: "en", messages: en, namespace: "banners.upgrade" });
const tZh = createTranslator({ locale: "zh-CN", messages: zhCN, namespace: "banners.upgrade" });
import type { LatestReleaseInfo } from "@/app/(dashboard)/hooks/latestRelease/useLatestReleaseInfo";

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

describe("describeRelease", () => {
  it("lists features, fixes, and other updates in the agreed order", () => {
    expect(describeRelease(RELEASE, tEn)).toBe("12 new features, 30 fixes, and 8 other updates");
  });

  it("singularises counts of one", () => {
    const singularCounts = { ...RELEASE, new_features: 1, bug_fixes: 1, other_updates: 1 };
    expect(describeRelease(singularCounts, tEn)).toBe("1 new feature, 1 fix, and 1 other update");
    expect(describeRelease(singularCounts, tZh)).toBe("1 项新功能，1 项修复，以及 1 项其他更新");
  });
});

describe("UpgradeBannerView", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders nothing while either version is unknown", () => {
    const { container } = render(<UpgradeBannerView currentVersion={undefined} latestRelease={RELEASE} />);
    expect(container).toBeEmptyDOMElement();
    const { container: noRelease } = render(<UpgradeBannerView currentVersion="1.102.0" latestRelease={null} />);
    expect(noRelease).toBeEmptyDOMElement();
  });

  it("renders nothing when the running version is up to date or ahead", () => {
    const { container } = render(<UpgradeBannerView currentVersion="1.103.0" latestRelease={RELEASE} />);
    expect(container).toBeEmptyDOMElement();
    const { container: ahead } = render(<UpgradeBannerView currentVersion="1.104.0-dev.1" latestRelease={RELEASE} />);
    expect(ahead).toBeEmptyDOMElement();
  });

  it("shows the latest version, the stat line, and the current version when behind", () => {
    render(<UpgradeBannerView currentVersion="1.102.0" latestRelease={RELEASE} />);
    const alert = screen.getByRole("status");
    expect(alert).toHaveTextContent("最新版本为 v1.103.0：12 项新功能，30 项修复，以及 8 项其他更新");
    expect(alert).toHaveTextContent("你当前的版本是 v1.102.0");
    expect(screen.getByRole("link", { name: "v1.103.0" })).toHaveAttribute("href", RELEASE.release_url);
  });

  it("dismissing hides the banner and keeps it hidden on remount for the same release", () => {
    const { unmount } = render(<UpgradeBannerView currentVersion="1.102.0" latestRelease={RELEASE} />);
    fireEvent.click(screen.getByRole("button", { name: "关闭" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    unmount();

    const { container } = render(<UpgradeBannerView currentVersion="1.102.0" latestRelease={RELEASE} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("reappears once a newer release ships after a dismissal", () => {
    const { unmount } = render(<UpgradeBannerView currentVersion="1.102.0" latestRelease={RELEASE} />);
    fireEvent.click(screen.getByRole("button", { name: "关闭" }));
    unmount();

    render(<UpgradeBannerView currentVersion="1.102.0" latestRelease={{ ...RELEASE, version: "1.104.0" }} />);
    expect(screen.getByRole("status")).toHaveTextContent("最新版本为 v1.104.0");
  });

  it("shows a newer release after the current one was dismissed without remounting", () => {
    const { rerender } = render(<UpgradeBannerView currentVersion="1.102.0" latestRelease={RELEASE} />);
    fireEvent.click(screen.getByRole("button", { name: "关闭" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    rerender(<UpgradeBannerView currentVersion="1.102.0" latestRelease={{ ...RELEASE, version: "1.104.0" }} />);
    expect(screen.getByRole("status")).toHaveTextContent("最新版本为 v1.104.0");
  });
});

describe("UpgradeBanner", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("feeds both hooks the access token and renders from their data", () => {
    const healthReadinessResult = {
      data: { litellm_version: "1.102.0" },
    } as Partial<ReturnType<typeof useHealthReadinessDetails>> as ReturnType<typeof useHealthReadinessDetails>;
    const latestReleaseResult = { data: RELEASE } as Partial<ReturnType<typeof useLatestReleaseInfo>> as ReturnType<
      typeof useLatestReleaseInfo
    >;
    vi.mocked(useHealthReadinessDetails).mockReturnValue(healthReadinessResult);
    vi.mocked(useLatestReleaseInfo).mockReturnValue(latestReleaseResult);
    render(<UpgradeBanner accessToken="token" />);
    expect(useHealthReadinessDetails).toHaveBeenCalledWith("token");
    expect(useLatestReleaseInfo).toHaveBeenCalledWith("token");
    expect(screen.getByRole("status")).toHaveTextContent("最新版本为 v1.103.0");
  });

  it("renders nothing when the release endpoint returns null", () => {
    const healthReadinessResult = {
      data: { litellm_version: "1.102.0" },
    } as Partial<ReturnType<typeof useHealthReadinessDetails>> as ReturnType<typeof useHealthReadinessDetails>;
    const latestReleaseResult = { data: null } as Partial<ReturnType<typeof useLatestReleaseInfo>> as ReturnType<
      typeof useLatestReleaseInfo
    >;
    vi.mocked(useHealthReadinessDetails).mockReturnValue(healthReadinessResult);
    vi.mocked(useLatestReleaseInfo).mockReturnValue(latestReleaseResult);
    const { container } = render(<UpgradeBanner accessToken="token" />);
    expect(container).toBeEmptyDOMElement();
  });
});
