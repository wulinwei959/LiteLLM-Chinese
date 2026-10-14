"use client";

import { ChevronDown, Pause, Play, RotateCcw } from "lucide-react";
import moment from "moment";
import { useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";
import type { LogsTranslator } from "@/lib/i18n/translators";

import type { TimeWindow } from "./TracesTimeline";

type RangeLabelKey =
  | "timeRange.lastHour"
  | "timeRange.last6Hours"
  | "timeRange.last24Hours"
  | "timeRange.last7Days"
  | "timeRange.last30Days";

export const RANGE_PRESETS: { hours: number; labelKey: RangeLabelKey }[] = [
  { hours: 1, labelKey: "timeRange.lastHour" },
  { hours: 6, labelKey: "timeRange.last6Hours" },
  { hours: 24, labelKey: "timeRange.last24Hours" },
  { hours: 168, labelKey: "timeRange.last7Days" },
  { hours: 720, labelKey: "timeRange.last30Days" },
];

const RANGE_LABEL_FORMAT = "MMM D, h:mm A";

export const rangeLabel = (t: LogsTranslator, range: TimeWindow): string =>
  t("traceList.rangeTo", {
    start: moment(range.startMs).format(RANGE_LABEL_FORMAT),
    end: moment(range.endMs).format(RANGE_LABEL_FORMAT),
  });

const SEGMENT = "inline-flex h-7 items-center gap-1.5 px-2.5 text-[13px] outline-none focus-visible:bg-accent";

interface TimeRangeControlsProps {
  range: TimeWindow;
  rangeHours: number;
  onRangeHoursChange: (hours: number) => void;
  live: boolean;
  onLiveChange: (live: boolean) => void;
  zoomed: boolean;
  onResetZoom: () => void;
}

/** Joined control group: reset zoom, the actual time range (opens presets), and Live. */
export function TimeRangeControls({
  range,
  rangeHours,
  onRangeHoursChange,
  live,
  onLiveChange,
  zoomed,
  onResetZoom,
}: TimeRangeControlsProps) {
  const t = useTranslations("logs");
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onResetZoom}
        disabled={!zoomed}
        aria-label={t("traceList.resetZoomAria")}
        className="inline-flex size-7 items-center justify-center rounded-md border border-border text-info hover:bg-info/10 disabled:text-muted-foreground disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <RotateCcw className="size-3.5" />
      </button>
      <div className="flex items-center divide-x divide-border overflow-hidden rounded-md border border-border bg-card">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={t("traceList.timeRangeAria")}
            className={cn(SEGMENT, "text-foreground hover:bg-muted/60")}
            data-testid="time-range-trigger"
          >
            <span className="tabular-nums">{rangeLabel(t, range)}</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto min-w-44">
            <DropdownMenuRadioGroup
              value={String(rangeHours)}
              onValueChange={(value: string) => onRangeHoursChange(Number(value))}
            >
              {RANGE_PRESETS.map((preset) => (
                <DropdownMenuRadioItem key={preset.hours} value={String(preset.hours)} className="text-[13px]">
                  {t(preset.labelKey)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          aria-pressed={live}
          onClick={() => onLiveChange(!live)}
          className={cn(
            SEGMENT,
            live ? "bg-info/10 text-info hover:bg-info/15" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {live ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {t("traceList.live")}
        </button>
      </div>
    </div>
  );
}
