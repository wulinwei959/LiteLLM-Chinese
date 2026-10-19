"use client";

import { useTranslations } from "next-intl";
import Usage from "./_components/usage";
import { DeprecationBanner } from "@/components/DeprecationBanner";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";

export default function OldUsagePage() {
  const t = useTranslations("banners");
  const { accessToken, token, userRole, userId: userID, premiumUser } = useAuthorized();
  return (
    <>
      <DeprecationBanner featureName={t("deprecation.featureOldUsage")} />
      <Usage
        accessToken={accessToken}
        token={token}
        userRole={userRole}
        userID={userID}
        keys={null}
        premiumUser={premiumUser}
      />
    </>
  );
}
