import moment from "moment";
import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import zh from "@/messages/zh-CN.json";
import { getTimeRangeDisplay } from "./timeRange";

const t = createTranslator({ locale: "zh-CN", messages: zh, namespace: "logs" });

// startTime built relative to "now"; getTimeRangeDisplay computes now() internally.
const ago = (amount: number, unit: moment.unitOfTime.DurationConstructor) =>
  moment().subtract(amount, unit).toISOString();

describe("getTimeRangeDisplay", () => {
  it("labels a ~1-minute window as '最近 1 分钟'", () => {
    expect(getTimeRangeDisplay(t, false, ago(1, "minutes"), "")).toBe("最近 1 分钟");
  });

  it("labels a ~10-minute window as '最近 15 分钟'", () => {
    expect(getTimeRangeDisplay(t, false, ago(10, "minutes"), "")).toBe("最近 15 分钟");
  });

  it("labels a ~30-minute window as '最近 1 小时'", () => {
    expect(getTimeRangeDisplay(t, false, ago(30, "minutes"), "")).toBe("最近 1 小时");
  });

  it("labels a ~2-hour window as '最近 4 小时'", () => {
    expect(getTimeRangeDisplay(t, false, ago(2, "hours"), "")).toBe("最近 4 小时");
  });

  it("labels a ~10-hour window as '最近 24 小时'", () => {
    expect(getTimeRangeDisplay(t, false, ago(10, "hours"), "")).toBe("最近 24 小时");
  });

  it("labels a ~3-day window as '最近 7 天'", () => {
    expect(getTimeRangeDisplay(t, false, ago(3, "days"), "")).toBe("最近 7 天");
  });

  it("falls back to a 'MMM D - MMM D' range beyond 7 days", () => {
    const label = getTimeRangeDisplay(t, false, ago(30, "days"), "");
    expect(label).toMatch(/^[A-Z][a-z]{2} \d{1,2} - [A-Z][a-z]{2} \d{1,2}$/);
  });

  it("renders an explicit start - end range when isCustomDate is true", () => {
    const start = "2025-01-02T03:04:00Z";
    const end = "2025-01-05T06:07:00Z";
    const expected = `${moment(start).format("MMM D, h:mm A")} - ${moment(end).format("MMM D, h:mm A")}`;
    expect(getTimeRangeDisplay(t, true, start, end)).toBe(expected);
  });
});
