"use client";

import CredentialsPanel from "@/components/model_add/CredentialsPanel";
import UserConnectionsPanel from "@/components/model_add/UserConnectionsPanel";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import { all_admin_roles } from "@/utils/roles";

export default function LlmCredentialsPanel() {
  const { userRole } = useAuthorized();
  const isAdmin = all_admin_roles.includes(userRole ?? "");
  return (
    <div className="flex flex-col gap-6">
      {isAdmin ? <CredentialsPanel /> : null}
      <UserConnectionsPanel />
    </div>
  );
}
