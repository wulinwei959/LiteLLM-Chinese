import moment from "moment";

import type { LogsTranslator } from "@/lib/i18n/translators";

// Add this function to format the time range display
export const getTimeRangeDisplay = (
  t: LogsTranslator,
  isCustomDate: boolean,
  startTime: string,
  endTime: string,
) => {
  if (isCustomDate) {
    return `${moment(startTime).format("MMM D, h:mm A")} - ${moment(endTime).format("MMM D, h:mm A")}`;
  }

  const now = moment();
  const start = moment(startTime);
  const diffMinutes = now.diff(start, "minutes");

  // Use exact ranges to prevent drift
  if (diffMinutes >= 0 && diffMinutes < 2) return t("timeRange.lastOneMinute");
  if (diffMinutes >= 2 && diffMinutes < 16) return t("timeRange.last15Minutes");
  if (diffMinutes >= 16 && diffMinutes < 61) return t("timeRange.lastHour");

  const diffHours = now.diff(start, "hours");
  if (diffHours >= 1 && diffHours < 5) return t("timeRange.last4Hours");
  if (diffHours >= 5 && diffHours < 25) return t("timeRange.last24Hours");
  if (diffHours >= 25 && diffHours < 169) return t("timeRange.last7Days");
  return `${start.format("MMM D")} - ${now.format("MMM D")}`;
};
