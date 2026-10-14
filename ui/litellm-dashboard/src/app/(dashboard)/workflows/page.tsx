"use client";

import { useTranslations } from "next-intl";
import WorkflowRuns from "./WorkflowRuns";
import { DeprecationBanner } from "@/components/DeprecationBanner";
import { AdminOnlyNotice } from "@/components/shared/AdminOnlyNotice";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import useCan from "@/app/(dashboard)/hooks/useCan";

export default function Workflows() {
  const t = useTranslations("workflows");
  const { accessToken } = useAuthorized();
  const canViewWorkflowRuns = useCan("viewWorkflowRuns");

  if (!canViewWorkflowRuns) {
    return <AdminOnlyNotice pageTitle={t("title")} />;
  }

  return (
    <>
      <DeprecationBanner featureName="Workflows" />
      <WorkflowRuns accessToken={accessToken} />
    </>
  );
}
