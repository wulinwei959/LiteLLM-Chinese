"use client";

import { useTranslations } from "next-intl";
import APIReferenceView from "./_components/APIReferenceView";
import { DeprecationBanner } from "@/components/DeprecationBanner";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import useProxySettings from "@/app/(dashboard)/hooks/proxySettings/useProxySettings";

const APIReferencePage = () => {
  const t = useTranslations("banners");
  const { accessToken } = useAuthorized();
  const proxySettings = useProxySettings(accessToken);

  return (
    <>
      <DeprecationBanner featureName={t("deprecation.featureApiReference")} />
      <APIReferenceView proxySettings={proxySettings} />
    </>
  );
};

export default APIReferencePage;
