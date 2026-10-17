"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { useHealthReadinessDetails } from "@/app/(dashboard)/hooks/healthReadiness/useHealthReadinessDetails";

interface DebugWarningBannerProps {
  accessToken: string | null;
}

export const DebugWarningBanner: React.FC<DebugWarningBannerProps> = ({ accessToken }) => {
  const t = useTranslations("banners.debugWarning");
  const { data: healthData } = useHealthReadinessDetails(accessToken);

  // Only show banner if detailed debug mode is explicitly enabled
  if (!healthData?.is_detailed_debug) {
    return null;
  }

  return (
    <Alert variant="warning" className="rounded-none border-x-0 border-t-0">
      <TriangleAlert className="size-4" aria-hidden />
      <AlertTitle>{t("title")}</AlertTitle>
      <AlertDescription>{t.rich("description", { code: (chunks) => <code>{chunks}</code> })}</AlertDescription>
    </Alert>
  );
};
