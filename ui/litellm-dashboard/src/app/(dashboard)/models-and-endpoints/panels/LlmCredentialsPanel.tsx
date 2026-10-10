"use client";

import { useTranslations } from "next-intl";
import CredentialsPanel from "@/components/model_add/CredentialsPanel";

export default function LlmCredentialsPanel() {
  const t = useTranslations("models");
  return <CredentialsPanel />;
}
