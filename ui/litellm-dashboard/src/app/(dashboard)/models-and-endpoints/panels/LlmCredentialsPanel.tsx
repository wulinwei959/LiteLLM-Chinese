"use client";

import { useTranslations } from "next-intl";
import CredentialsPanel from "@/components/model_add/CredentialsPanel";
import UserConnectionsPanel from "@/components/model_add/UserConnectionsPanel";
import { all_admin_roles } from "@/utils/roles";

export default function LlmCredentialsPanel() {
  const t = useTranslations("models");
  return <CredentialsPanel />;
}
