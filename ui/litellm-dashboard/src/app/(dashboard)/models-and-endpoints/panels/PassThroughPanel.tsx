"use client";

import { useTranslations } from "next-intl";
import PassThroughSettings from "@/components/PassThroughSettings/PassThroughSettings";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";

export default function PassThroughPanel() {
  const t = useTranslations("models");
  const { accessToken, userRole, userId: userID, premiumUser } = useAuthorized();
  return (
    <PassThroughSettings accessToken={accessToken} userRole={userRole} userID={userID} premiumUser={premiumUser} />
  );
}
