import moment from "moment";

export interface RelativeTimeOption {
  labelKey: "presetToday" | "presetLast7Days" | "presetLast30Days" | "presetMonthToDate" | "presetYearToDate";
  shortLabel: string;
  settingValue: string;
  getValue: () => { from: Date; to: Date };
}

export const relativeTimeOptions: readonly RelativeTimeOption[] = [
  {
    labelKey: "presetToday",
    shortLabel: "today",
    settingValue: "today",
    getValue: () => ({
      from: moment().startOf("day").toDate(),
      to: moment().endOf("day").toDate(),
    }),
  },
  {
    labelKey: "presetLast7Days",
    shortLabel: "7d",
    settingValue: "last_7_days",
    getValue: () => ({
      from: moment().subtract(7, "days").startOf("day").toDate(),
      to: moment().endOf("day").toDate(),
    }),
  },
  {
    labelKey: "presetLast30Days",
    shortLabel: "30d",
    settingValue: "last_30_days",
    getValue: () => ({
      from: moment().subtract(30, "days").startOf("day").toDate(),
      to: moment().endOf("day").toDate(),
    }),
  },
  {
    labelKey: "presetMonthToDate",
    shortLabel: "MTD",
    settingValue: "month_to_date",
    getValue: () => ({
      from: moment().startOf("month").toDate(),
      to: moment().endOf("day").toDate(),
    }),
  },
  {
    labelKey: "presetYearToDate",
    shortLabel: "YTD",
    settingValue: "year_to_date",
    getValue: () => ({
      from: moment().startOf("year").toDate(),
      to: moment().endOf("day").toDate(),
    }),
  },
];
