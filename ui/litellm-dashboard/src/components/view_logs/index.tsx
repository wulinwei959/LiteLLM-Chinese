import { useState } from "react";
import { useTranslations } from "next-intl";
import useCan from "@/app/(dashboard)/hooks/useCan";
import DeletedKeysPage from "../DeletedKeysPage/DeletedKeysPage";
import DeletedTeamsPage from "../DeletedTeamsPage/DeletedTeamsPage";
import AuditLogsPanel from "./AuditLogsPanel";
import RequestLogsPanel from "./RequestLogsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";

interface SpendLogsTableProps {
  accessToken: string | null;
  token: string | null;
  userRole: string | null;
  userID: string | null;
  premiumUser: boolean;
}

type LogsTabId = "request logs" | "audit logs" | "deleted keys" | "deleted teams";

export default function SpendLogsTable({ accessToken, token, userRole, userID, premiumUser }: SpendLogsTableProps) {
  const t = useTranslations("logs.tabs");
  const [activeTab, setActiveTab] = useState<LogsTabId>("request logs");
  const canViewAuditLogs = useCan("viewAuditLogs");
  const canViewDeletedTeams = useCan("viewDeletedTeams");

  if (!accessToken || !token || !userRole || !userID) {
    return (
      <div role="status" aria-busy="true" aria-label="Loading" className="flex h-64 items-center justify-center">
        <UiLoadingSpinner className="size-8 text-primary" />
      </div>
    );
  }

  const tabs: Array<{ id: LogsTabId; label: string }> = [
    { id: "request logs", label: t("requestLogs") },
    ...(canViewAuditLogs ? [{ id: "audit logs" as LogsTabId, label: t("auditLogs") }] : []),
    { id: "deleted keys", label: t("deletedKeys") },
    ...(canViewDeletedTeams ? [{ id: "deleted teams" as LogsTabId, label: t("deletedTeams") }] : []),
  ];

  const tabContentClassName = (tabId: LogsTabId): string =>
    tabId === "request logs" ? "flex min-h-0 flex-1 flex-col" : "min-h-0 flex-1 overflow-y-auto";

  const renderPanel = (tabId: LogsTabId) => {
    switch (tabId) {
      case "request logs":
        return (
          <RequestLogsPanel
            accessToken={accessToken}
            token={token}
            userRole={userRole}
            userID={userID}
            isActive={activeTab === "request logs"}
          />
        );
      case "audit logs":
        return (
          <AuditLogsPanel
            userID={userID}
            userRole={userRole}
            token={token}
            accessToken={accessToken}
            isActive={activeTab === "audit logs"}
            premiumUser={premiumUser}
          />
        );
      case "deleted keys":
        return <DeletedKeysPage />;
      case "deleted teams":
        return <DeletedTeamsPage />;
    }
  };

  return (
    <div className="flex h-full w-full flex-col p-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as LogsTabId)} className="min-h-0 flex-1">
        <TabsList variant="line">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex-none">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} keepMounted className={tabContentClassName(tab.id)}>
            {renderPanel(tab.id)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
