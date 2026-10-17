"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpCircle, X } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { Button } from "@/components/ui/button";
import { useHealthReadinessDetails } from "@/app/(dashboard)/hooks/healthReadiness/useHealthReadinessDetails";
import {
  type LatestReleaseInfo,
  useLatestReleaseInfo,
} from "@/app/(dashboard)/hooks/latestRelease/useLatestReleaseInfo";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/localStorageUtils";
import { isNewerVersion } from "@/utils/versionUtils";

const DISMISS_KEY_PREFIX = "litellm:upgradeBannerDismissed:";

interface UpgradeBannerProps {
  accessToken: string | null;
}

interface UpgradeBannerViewProps {
  currentVersion: string | null | undefined;
  latestRelease: LatestReleaseInfo | null | undefined;
}

type ReleaseTranslator = ReturnType<typeof useTranslations<"banners.upgrade">>;

export const describeRelease = (
  { new_features, bug_fixes, other_updates }: LatestReleaseInfo,
  t: ReleaseTranslator,
): string =>
  [
    t("newFeatures", { count: new_features }),
    t("fixes", { count: bug_fixes }),
    `${t("and")} ${t("otherUpdates", { count: other_updates })}`,
  ].join(t("listSeparator"));

export const UpgradeBannerView: React.FC<UpgradeBannerViewProps> = ({ currentVersion, latestRelease }) => {
  const t = useTranslations("banners.upgrade");
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(null);

  if (!currentVersion || !latestRelease || !isNewerVersion(currentVersion, latestRelease.version)) {
    return null;
  }

  const dismissKey = `${DISMISS_KEY_PREFIX}${latestRelease.version}`;
  if (dismissedVersion === latestRelease.version || getLocalStorageItem(dismissKey) === "true") {
    return null;
  }

  const handleClose = () => {
    setLocalStorageItem(dismissKey, "true");
    setDismissedVersion(latestRelease.version);
  };

  return (
    <Alert role="status" variant="info" className="rounded-none border-x-0 border-t-0">
      <ArrowUpCircle className="size-4" aria-hidden />
      <AlertTitle>
        {t.rich("latestIs", {
          version: latestRelease.version,
          release: describeRelease(latestRelease, t),
          link: (chunks) => (
            <a href={latestRelease.release_url} target="_blank" rel="noopener noreferrer" className="underline">
              {chunks}
            </a>
          ),
        })}
      </AlertTitle>
      <AlertDescription>{t("currentVersion", { version: currentVersion })}</AlertDescription>
      <AlertAction>
        <Button variant="ghost" size="icon-sm" aria-label={t("close")} onClick={handleClose}>
          <X className="size-4" />
        </Button>
      </AlertAction>
    </Alert>
  );
};

export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ accessToken }) => {
  const { data: healthData } = useHealthReadinessDetails(accessToken);
  const { data: latestRelease } = useLatestReleaseInfo(accessToken);
  return <UpgradeBannerView currentVersion={healthData?.litellm_version} latestRelease={latestRelease} />;
};
