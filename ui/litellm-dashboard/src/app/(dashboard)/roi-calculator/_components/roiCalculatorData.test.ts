import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";

import zh from "@/messages/zh-CN.json";

import {
  coverageLabel,
  effortNote,
  estimateLabel,
  filterPulls,
  formatMoney,
  formatNumber,
  formatSyncedAt,
  peopleCsv,
} from "./roiCalculatorData";
import type { ROIPull } from "./roiCalculatorData";

const t = createTranslator({ locale: "zh-CN", messages: zh, namespace: "roiCalculator" });

const pull = (overrides: Partial<ROIPull>): ROIPull => ({
  repo: "org/repo",
  number: 42,
  title: "Improve request routing",
  url: "https://github.com/org/repo/pull/42",
  login: "alice",
  emails: ["alice@example.com"],
  profile_email: "alice@example.com",
  merged_at: "2026-09-12T00:00:00Z",
  head_sha: "abc",
  additions: 10,
  deletions: 2,
  changed_files: 1,
  commit_count: 1,
  incomplete_metadata: false,
  estimate: { status: "estimated", hours: 4.5, reasoning: "Metadata-based estimate.", cached: false },
  email: "alice@example.com",
  match_method: "profile email",
  matched: true,
  ...overrides,
});

const summary = {
  metrics: { matched_prs: 1, merged_prs: 2 },
};

describe("ROI calculator display helpers", () => {
  it("formats spend and estimated hours without losing null values", () => {
    expect(formatMoney(1234.5)).toBe("$1,234.50");
    expect(formatMoney(0.0001)).toBe("<$0.01");
    expect(formatMoney(0)).toBe("$0.00");
    expect(formatMoney(null)).toBe("—");
    expect(formatNumber(4.25)).toBe("4.3");
    expect(formatNumber(null)).toBe("—");
  });

  it("formats report sync timestamps in UTC", () => {
    expect(formatSyncedAt("2026-09-30T12:00:00Z")).toBe("Sep 30, 2026, 12:00 PM UTC");
    expect(formatSyncedAt("invalid")).toBe("invalid");
  });

  it("keeps caveat copy tied to the estimate basis and reports match coverage", () => {
    expect(effortNote(t, "without_ai")).toContain("实际工作时长或节省的小时数");
    expect(effortNote(t, null)).toContain("较早的估算");
    expect(coverageLabel(t, summary)).toBe("2 个 PR 中有 1 个有邮件匹配");
  });

  it("labels estimates and filters PRs by title, repository, number, or login", () => {
    const matchingPull = pull({});
    expect(estimateLabel(t, matchingPull.estimate)).toBe("4.5 小时");
    const needsReview: Parameters<typeof estimateLabel>[1] = {
      status: "needs_review",
      hours: null,
      reasoning: "",
      cached: false,
    };
    expect(estimateLabel(t, needsReview)).toBe("需审核");
    expect(filterPulls([matchingPull], "ROUTING")).toEqual([matchingPull]);
    expect(filterPulls([matchingPull], "nobody")).toEqual([]);
  });
});

it("exports precise spend, cohort eligibility and safely quoted CSV values", () => {
  const exportSummary = {
    start: "2026-09-01",
    end: "2026-09-30",
    effort_basis: "without_ai",
    people: [
      {
        id: "person-1",
        email: '=HYPERLINK("bad")',
        logins: ["alice", "bob"],
        match_methods: ["profile email"],
        spend: 0.0001,
        hours: 4,
        prs: 1,
        estimated_prs: 0,
        pending_prs: 0,
        eligible: true,
        cost_per_hour: 0.000025,
      },
    ],
  };
  const csv = peopleCsv(exportSummary);
  expect(csv.split("\r\n")).toHaveLength(2);
  expect(csv).toContain('"\'=HYPERLINK(""bad"")","alice;bob","0.0001","4","1","0","true","0.000025"');
  expect(csv).toContain('"2026-09-01","2026-09-30","without_ai"');
});
