"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useUiFormat } from "@/lib/i18n/format";
import { Info, X } from "lucide-react";

const DEPRECATION_DISCUSSION_URL = "https://github.com/BerriAI/litellm/discussions/32090";
const DEPRECATION_TARGET_DATE = new Date("2026-09-01T00:00:00Z");
const TARGET_DATE_FORMAT = { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" } as const;

interface DeprecationBannerProps {
  featureName: string;
}

export const DeprecationBanner: React.FC<DeprecationBannerProps> = ({ featureName }) => {
  const t = useTranslations("banners.deprecation");
  const { date: formatDate } = useUiFormat();
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) {
    return null;
  }

  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{t("title", { feature: featureName })}</p>
        <p className="mt-1 break-words text-muted-foreground">
          {t.rich("body", {
            feature: featureName,
            date: formatDate(DEPRECATION_TARGET_DATE, TARGET_DATE_FORMAT),
            link: (chunks) => (
              <Link
                href={DEPRECATION_DISCUSSION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
      <button
        type="button"
        aria-label={t("close")}
        onClick={() => setIsClosed(true)}
        className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
};
