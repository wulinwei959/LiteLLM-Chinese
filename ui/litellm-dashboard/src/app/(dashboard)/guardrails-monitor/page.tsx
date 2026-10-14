"use client";

import { useTranslations } from "next-intl";
import GuardrailsMonitorView from "./_components/GuardrailsMonitorView";
import { AdminOnlyNotice } from "@/components/shared/AdminOnlyNotice";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import useCan from "@/app/(dashboard)/hooks/useCan";

export default function GuardrailsMonitor() {
  const t = useTranslations("guardrailsMonitor");
  const { accessToken } = useAuthorized();
  const canViewGuardrailUsage = useCan("viewGuardrailUsage");

  if (!canViewGuardrailUsage) {
    return <AdminOnlyNotice pageTitle={t("overview.title")} />;
  }

  return <GuardrailsMonitorView accessToken={accessToken} />;
}
