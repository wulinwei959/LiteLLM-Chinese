"use client";

import type { ComponentProps } from "react";
import { useLensRoute } from "../route";
import { cn } from "../../../lib/cva.config";
import { useLensTranslate } from "../../../host/useLensTranslate";

export type ReadinessBannerProps = ComponentProps<"div"> & {
  activityReady: boolean;
};

export function ReadinessBanner({ activityReady, className, ...props }: ReadinessBannerProps) {
  const t = useLensTranslate();
  const { setTab } = useLensRoute();
  return (
    <div
      {...props}
      data-slot="readiness-banner"
      role="status"
      className={cn("flex flex-wrap items-center gap-2 border-y py-3 text-sm text-muted-foreground", className)}
    >
      {activityReady
        ? t("investigations.configureAnalysisSettingsRun")
        : t("investigations.recordedActivityReadySaved")}
      {!activityReady && (
        <button type="button" className="font-medium underline" onClick={() => setTab("traces")}>
          {t("investigations.checkTraces")}</button>
      )}
    </div>
  );
}
