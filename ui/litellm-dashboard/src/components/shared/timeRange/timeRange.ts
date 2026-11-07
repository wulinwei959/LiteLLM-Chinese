const HOUR_MS = 60 * 60 * 1000;

export interface TimeWindow {
  readonly startMs: number;
  readonly endMs: number;
}

export interface RangePreset {
  readonly hours: number;
  readonly labelKey: string;
}

export const RANGE_PRESETS: readonly RangePreset[] = [
  { hours: 1, labelKey: "timeRange.lastHour" },
  { hours: 6, labelKey: "timeRange.last6Hours" },
  { hours: 24, labelKey: "timeRange.last24Hours" },
  { hours: 168, labelKey: "timeRange.last7Days" },
  { hours: 720, labelKey: "timeRange.last30Days" },
] as const;

export type RangeHours = (typeof RANGE_PRESETS)[number]["hours"];
export const RANGE_HOURS: readonly RangeHours[] = RANGE_PRESETS.map((preset) => preset.hours);
export const DEFAULT_RANGE_HOURS: RangeHours = 24;
export const isRangeHours = (hours: number): hours is RangeHours => RANGE_HOURS.includes(hours as RangeHours);

export const presetLabelKey = (hours: number): string =>
  RANGE_PRESETS.find((preset) => preset.hours === hours)?.labelKey ?? "timeRange.last" + hours + "Hours";

/** A preset length that ends now while live, or at the moment live was paused. */
export interface RelativeRange {
  readonly hours: number;
  readonly anchorMs: number | null;
}

export const isLive = (range: RelativeRange): boolean => range.anchorMs === null;

/** The window a range covers; a live range rolls with `nowMs`, a paused one ignores it. */
export const timeWindow = (range: RelativeRange, nowMs: number): TimeWindow => {
  const endMs = range.anchorMs ?? nowMs;
  return { startMs: endMs - range.hours * HOUR_MS, endMs };
};

export const LIVE_TAIL_INTERVAL_MS = 15000;
