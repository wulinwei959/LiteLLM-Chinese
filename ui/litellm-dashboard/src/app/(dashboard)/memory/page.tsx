"use client";

import { useTranslations } from "next-intl";
import { DeprecationBanner } from "@/components/DeprecationBanner";
import { MemoryView } from "./_components/MemoryView";
import { AdminOnlyNotice } from "@/components/shared/AdminOnlyNotice";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import useCan from "@/app/(dashboard)/hooks/useCan";

export default function Memory() {
  const t = useTranslations("memory");
  const bannersT = useTranslations("banners");
  const { accessToken, userRole, userId } = useAuthorized();
  const canViewMemory = useCan("viewMemory");

  if (!canViewMemory) {
    return <AdminOnlyNotice pageTitle={t("title")} />;
  }

  return (
    <>
      <DeprecationBanner featureName={bannersT("deprecation.featureMemory")} />
      <MemoryView accessToken={accessToken} userID={userId} userRole={userRole} />
    </>
  );
}
