import { hasPtuHours } from "@/app/(dashboard)/usage/_components/components/EntityUsage/entityUsageSummary";
import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import zh from "@/messages/zh-CN.json";
import { buildCostBreakdownTiles, buildSummaryTiles, hasFlatCost } from "./entityUsageSummary";

const t = createTranslator({ locale: "zh-CN", messages: zh, namespace: "usage" });

const metadata = {
  total_spend: 100,
  total_flat_cost: 40,
  total_api_requests: 12,
  total_successful_requests: 10,
  total_failed_requests: 2,
  total_tokens: 3456,
};

describe("hasPtuHours", () => {
  it("is false when no PTU hours were consumed or the backend predates the field", () => {
    expect(hasPtuHours({ ...metadata, total_ptu_hours: 0 })).toBe(false);
    expect(hasPtuHours(metadata)).toBe(false);
  });

  it("is true once a PTU model group has been used", () => {
    expect(hasPtuHours({ ...metadata, total_ptu_hours: 0.25 })).toBe(true);
  });
});

describe("hasFlatCost", () => {
  it("is false when there is no flat cost to report", () => {
    expect(hasFlatCost({ ...metadata, total_flat_cost: 0 })).toBe(false);
    const { total_flat_cost, ...noFlat } = metadata;
    expect(hasFlatCost(noFlat)).toBe(false);
  });

  it("is true once a flat cost has accrued", () => {
    expect(hasFlatCost(metadata)).toBe(true);
  });
});

describe("buildSummaryTiles", () => {
  it("keeps the row at five tiles either way so adding flat cost never narrows the cards", () => {
    expect(buildSummaryTiles(t, metadata, false)).toHaveLength(5);
    expect(buildSummaryTiles(t, metadata, true)).toHaveLength(5);
  });

  it("adds a sixth PTU Hours tile only when asked, after Total Tokens", () => {
    const withPtu = { ...metadata, total_ptu_hours: 1234.5678 };
    expect(buildSummaryTiles(t, withPtu, true)).toHaveLength(5);
    const tiles = buildSummaryTiles(t, withPtu, true, true);
    expect(tiles).toHaveLength(6);
    const last = tiles[tiles.length - 1];
    expect(last.title).toBe("PTU 小时");
    expect(last.value).toBe("1,234.57");
    expect(last.tooltip).toContain("PTU 小时");
    expect(tiles[tiles.length - 2].title).toBe("总令牌数");
  });

  it("treats missing PTU hours as zero when the tile is forced on", () => {
    const tiles = buildSummaryTiles(t, metadata, false, true);
    expect(tiles[tiles.length - 1].value).toBe("0.00");
  });

  it("shows request-only spend under the original title when there is no flat cost", () => {
    const [first] = buildSummaryTiles(t, metadata, false);
    expect(first.title).toBe("总消费");
    expect(first.value).toBe("$100.00");
    expect(first.expandable).toBeUndefined();
  });

  it("rolls flat cost into a single expandable Total Cost tile", () => {
    const [first] = buildSummaryTiles(t, metadata, true);
    expect(first.title).toBe("总成本");
    expect(first.value).toBe("$140.00");
    expect(first.expandable).toBe(true);
    expect(first.tooltip).toBeTruthy();
  });

  it("never renders the breakdown titles in the top row", () => {
    const titles = buildSummaryTiles(t, metadata, true).map((tile) => tile.title);
    expect(titles).not.toContain("固定成本");
    expect(titles).not.toContain("请求成本");
  });

  it("treats a missing flat cost as zero", () => {
    const { total_flat_cost, ...noFlat } = metadata;
    expect(buildSummaryTiles(t, noFlat, true)[0].value).toBe("$100.00");
  });
});

describe("buildCostBreakdownTiles", () => {
  it("splits the total into request cost and flat cost", () => {
    const byTitle = Object.fromEntries(buildCostBreakdownTiles(t, metadata).map((tile) => [tile.title, tile.value]));
    expect(byTitle["请求成本"]).toBe("$100.00");
    expect(byTitle["固定成本"]).toBe("$40.00");
  });

  it("adds up to the Total Cost tile so the expanded view reconciles", () => {
    const parse = (v: string) => Number(v.replace(/[$,]/g, ""));
    const parts = buildCostBreakdownTiles(t, metadata).map((tile) => parse(tile.value));
    expect(parts[0] + parts[1]).toBe(parse(buildSummaryTiles(t, metadata, true)[0].value));
  });

  it("explains each part, including that flat cost is outside budgets", () => {
    const byTitle = Object.fromEntries(buildCostBreakdownTiles(t, metadata).map((tile) => [tile.title, tile.tooltip]));
    expect(byTitle["请求成本"]).toBeTruthy();
    expect(byTitle["固定成本"]).toContain("预算");
  });

  it("treats a missing flat cost as zero", () => {
    const { total_flat_cost, ...noFlat } = metadata;
    const byTitle = Object.fromEntries(buildCostBreakdownTiles(t, noFlat).map((tile) => [tile.title, tile.value]));
    expect(byTitle["固定成本"]).toBe("$0.00");
  });
});
