"use client";

import { useTranslations } from "next-intl";
import PromptsPanel from "./_components";
import { DeprecationBanner } from "@/components/DeprecationBanner";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";

export default function Prompts() {
  const t = useTranslations("banners");
  const { accessToken, userRole } = useAuthorized();
  return (
    <>
      <DeprecationBanner featureName={t("deprecation.featurePrompts")} />
      <PromptsPanel accessToken={accessToken} userRole={userRole} />
    </>
  );
}
