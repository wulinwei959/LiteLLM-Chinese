"use client";

import { useTranslations } from "next-intl";

import ScopedSavingsTab from "@/components/shared/ScopedSavingsTab";
import { hasProxyWideSpendView, spendScopeUserId } from "@/utils/roles";
import type { ActivityDateRange } from "@/app/(dashboard)/cost-optimization/_components/useDailyActivityRange";

interface KeySavingsTabProps {
  accessToken: string | null;
  keyToken: string;
  userId: string | null;
  userRole: string;
  activity: ActivityDateRange;
}

const KeySavingsTab = ({ accessToken, keyToken, userId, userRole, activity }: KeySavingsTabProps) => {
  const t = useTranslations("virtualKeys");
  return (
    <ScopedSavingsTab
      accessToken={accessToken}
      scope={{ userId: spendScopeUserId(userRole, userId), apiKey: keyToken }}
      activity={activity}
      entityType="key"
      scopeNote={hasProxyWideSpendView(userRole) ? undefined : t("savingsScopeNote")}
    />
  );
};

export default KeySavingsTab;
