import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";

import type { ExportFormat } from "./types";

interface ExportFormatSelectorProps {
  value: ExportFormat;
  onChange: (value: ExportFormat) => void;
}

const EXPORT_FORMATS: readonly ExportFormat[] = ["csv", "json"];

const ExportFormatSelector: React.FC<ExportFormatSelectorProps> = ({ value, onChange }) => {
  const t = useTranslations("entityUsageExport");
  const formatLabel = (format: ExportFormat): string => (format === "csv" ? t("formatCsv") : t("formatJson"));

  return (
    <div>
      <label className="text-sm font-medium text-foreground block mb-2">{t("format")}</label>
      <Select value={value} onValueChange={(next: ExportFormat | null) => next && onChange(next)}>
        <SelectTrigger className="w-full">
          <SelectValue>{formatLabel(value)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {EXPORT_FORMATS.map((format) => (
            <SelectItem key={format} value={format}>
              {formatLabel(format)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ExportFormatSelector;
