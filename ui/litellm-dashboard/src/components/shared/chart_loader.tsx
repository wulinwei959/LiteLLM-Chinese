import React from "react";
import { useTranslations } from "next-intl";
import { UiLoadingSpinner } from "../ui/ui-loading-spinner";

interface ChartLoaderProps {
  isDateChanging?: boolean;
}

export const ChartLoader: React.FC<ChartLoaderProps> = ({ isDateChanging = false }) => {
  const t = useTranslations("common");
  return (
    <div className="flex items-center justify-center h-40">
      <div className="flex items-center justify-center gap-3">
        <UiLoadingSpinner className="size-5" />
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm font-medium">
            {isDateChanging ? t("chartProcessingTitle") : t("chartLoadingTitle")}
          </span>
          <span className="text-muted-foreground text-xs mt-1">
            {isDateChanging ? t("chartProcessingSub") : t("chartLoadingSub")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChartLoader;
