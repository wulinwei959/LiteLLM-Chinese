import { createTranslator } from "next-intl";
import { describe, it, expect } from "vitest";

import zh from "@/messages/zh-CN.json";
import {
  type LicenseExpiryTier,
  formatExpirationStatus,
  formatExpiryDate,
  getDaysUntilExpiration,
  getLicenseExpiryTier,
} from "./licenseUtils";

const NOW = new Date("2026-07-08T00:00:00Z");

describe("getDaysUntilExpiration", () => {
  it("returns null for a null expiration", () => {
    expect(getDaysUntilExpiration(null, NOW)).toBeNull();
  });

  it("returns null for an unparseable date", () => {
    expect(getDaysUntilExpiration("not-a-date", NOW)).toBeNull();
  });

  it("returns 0 for an expiration on the current UTC day", () => {
    expect(getDaysUntilExpiration("2026-07-08", NOW)).toBe(0);
  });

  it("returns a positive count for future dates", () => {
    expect(getDaysUntilExpiration("2026-07-15", NOW)).toBe(7);
    expect(getDaysUntilExpiration("2026-08-07", NOW)).toBe(30);
  });

  it("returns a negative count for a past date", () => {
    expect(getDaysUntilExpiration("2026-07-07", NOW)).toBe(-1);
  });

  it("is timezone-independent within a UTC day", () => {
    expect(getDaysUntilExpiration("2026-08-07", new Date("2026-07-08T00:00:01Z"))).toBe(30);
    expect(getDaysUntilExpiration("2026-08-07", new Date("2026-07-08T23:59:59Z"))).toBe(30);
  });
});

describe("getLicenseExpiryTier", () => {
  const cases: Array<[string | null, LicenseExpiryTier]> = [
    [null, "none"],
    ["not-a-date", "none"],
    ["2026-08-08", "none"],
    ["2026-08-07", "warning"],
    ["2026-07-16", "warning"],
    ["2026-07-15", "critical"],
    ["2026-07-09", "critical"],
    ["2026-07-08", "critical"],
    ["2026-07-07", "expired"],
    ["2026-01-01", "expired"],
  ];

  it.each(cases)("classifies %s as %s", (date, expected) => {
    expect(getLicenseExpiryTier(date, NOW)).toBe(expected);
  });
});

describe("formatExpiryDate", () => {
  it("formats an ISO date as a human-readable UTC date", () => {
    expect(formatExpiryDate("2026-07-31")).toBe("Jul 31, 2026");
  });

  it("follows the document locale", () => {
    document.documentElement.lang = "zh-CN";
    try {
      expect(formatExpiryDate("2026-07-31")).toBe("2026年7月31日");
    } finally {
      document.documentElement.lang = "en";
    }
  });

  it("returns the input unchanged when unparseable", () => {
    expect(formatExpiryDate("bogus")).toBe("bogus");
  });
});

describe("formatExpirationStatus", () => {
  const t = createTranslator({ locale: "zh-CN", messages: zh, namespace: "sidebarUsageCard" });

  it("shows the exact date for a future expiration", () => {
    expect(formatExpirationStatus(t, "2026-08-07", NOW)).toBe("将于 Aug 7, 2026 到期");
  });

  it("still reads as upcoming on the expiration day itself", () => {
    expect(formatExpirationStatus(t, "2026-07-08", NOW)).toBe("将于 Jul 8, 2026 到期");
  });

  it("shows the exact date for a past expiration", () => {
    expect(formatExpirationStatus(t, "2026-07-07", NOW)).toBe("已于 Jul 7, 2026 过期");
  });

  it("returns the no-expiration wording for a null date", () => {
    expect(formatExpirationStatus(t, null, NOW)).toBe("无到期时间");
  });

  it("returns the no-expiration wording for an unparseable date", () => {
    expect(formatExpirationStatus(t, "not-a-date", NOW)).toBe("无到期时间");
  });
});
