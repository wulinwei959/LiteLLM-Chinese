import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders as render } from "../../tests/test-utils";
import { LicenseExpiryBannerView } from "./LicenseExpiryBanner";
import { LicenseInfo } from "./networking";

const daysFromNow = (n: number): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + n);
  return date.toISOString().slice(0, 10);
};

const licenseWith = (expiration_date: string | null): LicenseInfo => ({
  has_license: expiration_date !== null,
  license_type: expiration_date !== null ? "enterprise" : "community",
  expiration_date,
  allowed_features: [],
  limits: { max_users: null, max_teams: null },
});

describe("LicenseExpiryBannerView", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("renders nothing when there is no license info", () => {
    const { container } = render(<LicenseExpiryBannerView licenseInfo={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when expiration_date is null (community or remote-validated)", () => {
    const { container } = render(<LicenseExpiryBannerView licenseInfo={licenseWith(null)} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when expiry is more than 30 days out", () => {
    const { container } = render(<LicenseExpiryBannerView licenseInfo={licenseWith(daysFromNow(40))} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows a dismissible warning within 30 days", () => {
    const { container } = render(<LicenseExpiryBannerView licenseInfo={licenseWith(daysFromNow(20))} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(container.querySelector(".lucide-triangle-alert")).toBeInTheDocument();
    expect(screen.getByText(/将在 20 天后到期/)).toBeInTheDocument();
    expect(screen.getByText(/请在失效前完成续订，以保留企业版功能/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /关闭/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "sales@berri.ai" })).toHaveAttribute("href", "mailto:sales@berri.ai");
  });

  it("shows a non-dismissible critical alert within 7 days", () => {
    const { container } = render(<LicenseExpiryBannerView licenseInfo={licenseWith(daysFromNow(5))} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(container.querySelector(".lucide-circle-alert")).toBeInTheDocument();
    expect(screen.getByText(/将在 5 天后到期/)).toBeInTheDocument();
    expect(screen.getByText(/请立即续订，以免失去企业版功能/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("says 'expires today' on the expiration day", () => {
    render(<LicenseExpiryBannerView licenseInfo={licenseWith(daysFromNow(0))} />);
    expect(screen.getByText(/今天到期/)).toBeInTheDocument();
  });

  it("shows a non-dismissible expired alert stating features are disabled", () => {
    const { container } = render(<LicenseExpiryBannerView licenseInfo={licenseWith(daysFromNow(-3))} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(container.querySelector(".lucide-circle-alert")).toBeInTheDocument();
    expect(screen.getByText(/已于/)).toBeInTheDocument();
    expect(screen.getByText(/企业版功能现已停用/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("hides the warning after dismissal and stays hidden within the session", () => {
    const expiration = daysFromNow(20);
    const { unmount } = render(<LicenseExpiryBannerView licenseInfo={licenseWith(expiration)} />);
    fireEvent.click(screen.getByRole("button", { name: /关闭/i }));
    expect(screen.queryByText(/将在 20 天后到期/)).not.toBeInTheDocument();

    unmount();
    render(<LicenseExpiryBannerView licenseInfo={licenseWith(expiration)} />);
    expect(screen.queryByText(/将在 20 天后到期/)).not.toBeInTheDocument();
  });

  it("still shows a critical alert even when its date was previously dismissed", () => {
    const expiration = daysFromNow(5);
    sessionStorage.setItem(`litellm:licenseExpiryBannerDismissed:${expiration}`, "true");
    render(<LicenseExpiryBannerView licenseInfo={licenseWith(expiration)} />);
    expect(screen.getByText(/将在 5 天后到期/)).toBeInTheDocument();
  });
});
