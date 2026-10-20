"use client";

import { formatDate } from "@/lib/i18n/format";

import { CellTooltip } from "./cell_tooltip";

export type DatePrecision = "datetime" | "date";

interface DateCellProps {
  value: string | null | undefined;
  precision?: DatePrecision;
  fallback?: string;
}

const DATE_OPTIONS: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };

const TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
};

const DATETIME_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  ...TIME_OPTIONS,
};

export const formatCellDate = (date: Date, precision: DatePrecision): string =>
  formatDate(date, precision === "date" ? DATE_OPTIONS : DATETIME_OPTIONS);

export const formatFullTimestamp = (date: Date): string => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const day = formatDate(date, DATE_OPTIONS);
  const time = formatDate(date, TIME_OPTIONS);
  return `${day}, ${time} (${timeZone})`;
};

export function DateCell({ value, precision = "datetime", fallback = "-" }: DateCellProps) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return <span className="text-muted-foreground">{fallback}</span>;
  }

  return (
    <CellTooltip
      content={formatFullTimestamp(date)}
      trigger={<span className="whitespace-nowrap">{formatCellDate(date, precision)}</span>}
    />
  );
}
