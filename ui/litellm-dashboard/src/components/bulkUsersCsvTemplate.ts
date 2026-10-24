export const BULK_USER_CSV_TEMPLATE_FILENAME = "litellm_bulk_users_template.csv";

export const BULK_USER_CSV_COLUMNS = [
  "user_email",
  "user_role",
  "teams",
  "max_budget",
  "budget_duration",
  "models",
] as const;

export type BulkUserCsvColumn = (typeof BULK_USER_CSV_COLUMNS)[number];

export const BULK_USER_CSV_REQUIRED_COLUMNS = [
  "user_email",
  "user_role",
] as const satisfies readonly BulkUserCsvColumn[];

export const buildBulkUserCsvTemplate = (): string => `${BULK_USER_CSV_COLUMNS.join(",")}\n`;

export const downloadBulkUserCsvTemplate = (): void => {
  const blob = new Blob([buildBulkUserCsvTemplate()], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = BULK_USER_CSV_TEMPLATE_FILENAME;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
};
