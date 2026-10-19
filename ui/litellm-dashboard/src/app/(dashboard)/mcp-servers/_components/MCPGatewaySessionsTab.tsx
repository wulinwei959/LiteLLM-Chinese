"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Unplug } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import { fetchMCPGatewaySessions, terminateMCPGatewaySessions } from "@/components/networking";
import type {
  MCPGatewaySessionGroupCount,
  MCPGatewaySessionSelector,
  MCPGatewaySessionsResponse,
  MCPGatewaySessionsTerminateResponse,
} from "@/components/mcp_tools/types";
import { createQueryKeys } from "@/app/(dashboard)/hooks/common/queryKeysFactory";
import type { McpServersTranslator } from "@/lib/i18n/translators";

const mcpGatewaySessionKeys = createQueryKeys("mcpGatewaySessions");
const REFETCH_INTERVAL_MS = 15000;

export function formatIdleSeconds(idleSeconds: number): string {
  const total = Math.max(0, Math.floor(idleSeconds));
  if (total < 60) return `${total}s`;
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
}

function groupLabel(label: string | null, unknownLabel: string): string {
  if (label === null) return unknownLabel;
  return label === "" ? '""' : label;
}

export function describeSelector(
  t: McpServersTranslator,
  selector: MCPGatewaySessionSelector,
  unknownLabel: string,
): string {
  if (selector.user_id !== undefined)
    return t("gatewaySessions.selectorByUser", { user: groupLabel(selector.user_id, unknownLabel) });
  return t("gatewaySessions.selectorBySession", { prefix: selector.session_id_prefix });
}

export function describeTerminateResult(t: McpServersTranslator, result: MCPGatewaySessionsTerminateResponse): string {
  return t("gatewaySessions.terminatedSessions", { count: result.terminated_sessions, pid: result.worker_pid });
}

function StatCard({ labelKey, value }: { labelKey: "gatewaySessions.liveSessions" | "gatewaySessions.aiClients" | "gatewaySessions.users"; value: number }) {
  const t = useTranslations("mcpServers");
  return (
    <div className="bg-card border border-border rounded-lg px-4 py-3">
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{t(labelKey)}</div>
    </div>
  );
}

function DisconnectUserButton({
  userId,
  onDisconnectUser,
}: {
  userId: string | null;
  onDisconnectUser: (userId: string) => void;
}) {
  const t = useTranslations("mcpServers");
  if (userId === null || userId === "") return null;
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onDisconnectUser(userId)}
      aria-label={t("gatewaySessions.disconnectAllSessions", { user: groupLabel(userId, t("gatewaySessions.unknown")) })}
    >
      <Unplug className="size-4" />
      {t("gatewaySessions.disconnectAll")}
    </Button>
  );
}

function GroupCountTable({
  title,
  groups,
  labelHeader,
  onDisconnectUser,
}: {
  title: "gatewaySessions.byAiClient" | "gatewaySessions.byUser";
  groups: MCPGatewaySessionGroupCount[];
  labelHeader: "gatewaySessions.client" | "gatewaySessions.user";
  onDisconnectUser?: (userId: string) => void;
}) {
  const t = useTranslations("mcpServers");
  return (
    <section aria-label={t(title)} className="rounded-lg border border-border bg-card">
      <h3 className="border-b border-border px-4 py-2 text-sm font-semibold text-foreground">{t(title)}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t(labelHeader)}</TableHead>
            <TableHead className="text-right">{t("sessionsTab")}</TableHead>
            {onDisconnectUser ? <TableHead className="text-right">{t("actions")}</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.label ?? "__unknown__"}>
              <TableCell className="font-mono text-xs">{groupLabel(group.label, t("gatewaySessions.unknown"))}</TableCell>
              <TableCell className="text-right">{group.count}</TableCell>
              {onDisconnectUser ? (
                <TableCell className="text-right">
                  <DisconnectUserButton userId={group.label} onDisconnectUser={onDisconnectUser} />
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

function SessionsBody({
  data,
  error,
  isLoading,
  onDisconnect,
}: {
  data: MCPGatewaySessionsResponse | undefined;
  error: Error | null;
  isLoading: boolean;
  onDisconnect: ((selector: MCPGatewaySessionSelector) => void) | null;
}) {
  const t = useTranslations("mcpServers");
  if (isLoading) {
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card p-12"
      >
        <UiLoadingSpinner className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t("gatewaySessions.loadingLiveConnections")}</p>
      </div>
    );
  }
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t("gatewaySessions.couldNotLoad")}</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }
  if (!data) return null;
  if (data.total_sessions === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          {t("gatewaySessions.noLiveConnections", { pid: data.worker_pid })}
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard labelKey="gatewaySessions.liveSessions" value={data.total_sessions} />
        <StatCard labelKey="gatewaySessions.aiClients" value={data.by_client.length} />
        <StatCard labelKey="gatewaySessions.users" value={data.by_user.length} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GroupCountTable title="gatewaySessions.byAiClient" labelHeader="gatewaySessions.client" groups={data.by_client} />
        <GroupCountTable
          title="gatewaySessions.byUser"
          labelHeader="gatewaySessions.user"
          groups={data.by_user}
          onDisconnectUser={onDisconnect ? (userId) => onDisconnect({ user_id: userId }) : undefined}
        />
      </div>
      <section aria-label={t("gatewaySessions.liveSessions")} className="rounded-lg border border-border bg-card">
        <h3 className="border-b border-border px-4 py-2 text-sm font-semibold text-foreground">
          {t("gatewaySessions.liveSessionsWorker", { pid: data.worker_pid })}
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("gatewaySessions.session")}</TableHead>
              <TableHead>{t("gatewaySessions.client")}</TableHead>
              <TableHead>{t("gatewaySessions.user")}</TableHead>
              <TableHead>{t("gatewaySessions.keyAlias")}</TableHead>
              <TableHead>{t("gatewaySessions.team")}</TableHead>
              <TableHead>{t("gatewaySessions.clientIp")}</TableHead>
              <TableHead className="text-right">{t("gatewaySessions.idle")}</TableHead>
              <TableHead className="text-right">{t("gatewaySessions.inFlight")}</TableHead>
              {onDisconnect ? <TableHead className="text-right">{t("gatewaySessions.actions")}</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.sessions.map((session, index) => (
              <TableRow key={`${session.session_id_prefix}-${index}`}>
                <TableCell className="font-mono text-xs">{session.session_id_prefix}</TableCell>
                <TableCell>
                  {session.client_name === null ? (
                    <span className="text-muted-foreground">{t("gatewaySessions.unknown")}</span>
                  ) : (
                    <>
                      <span className="font-mono text-xs">{groupLabel(session.client_name, t("gatewaySessions.unknown"))}</span>
                      {session.client_version ? (
                        <span className="ml-1 text-xs text-muted-foreground">v{session.client_version}</span>
                      ) : null}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {session.user_id === null ? (
                    <span className="text-muted-foreground">{t("gatewaySessions.unknown")}</span>
                  ) : (
                    <>
                      <span className="font-mono text-xs">{session.user_id}</span>
                      {session.user_email ? (
                        <span className="ml-1 text-xs text-muted-foreground">{session.user_email}</span>
                      ) : null}
                    </>
                  )}
                </TableCell>
                <TableCell className="text-xs">{session.key_alias ?? "-"}</TableCell>
                <TableCell className="text-xs">{session.team_alias ?? session.team_id ?? "-"}</TableCell>
                <TableCell className="font-mono text-xs">{session.client_ip || "-"}</TableCell>
                <TableCell className="text-right text-xs">{formatIdleSeconds(session.idle_seconds)}</TableCell>
                <TableCell className="text-right text-xs">{session.in_flight_requests}</TableCell>
                {onDisconnect ? (
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDisconnect({ session_id_prefix: session.session_id_prefix })}
                      aria-label={t("gatewaySessions.disconnectSession", { id: session.session_id_prefix })}
                    >
                      <Unplug className="size-4" />
                      {t("gatewaySessions.disconnect")}
                    </Button>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </>
  );
}

interface MCPGatewaySessionsTabProps {
  accessToken: string | null;
  canTerminate: boolean;
}

export function MCPGatewaySessionsTab({ accessToken, canTerminate }: MCPGatewaySessionsTabProps) {
  const t = useTranslations("mcpServers");
  const queryClient = useQueryClient();
  const [pendingSelector, setPendingSelector] = useState<MCPGatewaySessionSelector | null>(null);
  const queryOptions = {
    queryKey: mcpGatewaySessionKeys.lists(),
    queryFn: () => fetchMCPGatewaySessions(accessToken!),
    enabled: !!accessToken,
    refetchInterval: REFETCH_INTERVAL_MS,
  };
  const { data, error, isLoading, isFetching, refetch } = useQuery<MCPGatewaySessionsResponse, Error>(queryOptions);
  const terminate = useMutation<MCPGatewaySessionsTerminateResponse, Error, MCPGatewaySessionSelector>({
    mutationFn: (selector) => terminateMCPGatewaySessions(accessToken!, selector),
    onSettled: () => queryClient.invalidateQueries({ queryKey: mcpGatewaySessionKeys.lists() }),
  });
  const confirmDisconnect = () => {
    if (pendingSelector === null) return;
    terminate.mutate(pendingSelector);
    setPendingSelector(null);
  };

  return (
    <div className="mt-4 space-y-4" data-testid="mcp-gateway-sessions-tab">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{t("gatewaySessions.title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("gatewaySessions.subtitle")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label={t("gatewaySessions.refresh")}
        >
          <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
          {t("gatewaySessions.refreshBtn")}
        </Button>
      </div>

      {terminate.isError ? (
        <Alert variant="destructive">
          <AlertTitle>{t("gatewaySessions.couldNotDisconnect")}</AlertTitle>
          <AlertDescription>{terminate.error.message}</AlertDescription>
        </Alert>
      ) : null}
      {terminate.isSuccess ? (
        <Alert>
          <AlertTitle>{t("gatewaySessions.disconnected")}</AlertTitle>
          <AlertDescription>
            {t("gatewaySessions.terminatedAlert", { detail: describeTerminateResult(t, terminate.data) })}
          </AlertDescription>
        </Alert>
      ) : null}

      <SessionsBody
        data={data}
        error={error}
        isLoading={isLoading}
        onDisconnect={canTerminate ? setPendingSelector : null}
      />

      <AlertDialog open={pendingSelector !== null} onOpenChange={(open) => !open && setPendingSelector(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("gatewaySessions.disconnectTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("gatewaySessions.disconnectConfirm", {
                scope: pendingSelector
                  ? t("gatewaySessions.forceCloseScope", {
                      selector: describeSelector(t, pendingSelector, t("gatewaySessions.unknown")),
                    })
                  : "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setPendingSelector(null)}>
              {t("gatewaySessions.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDisconnect} disabled={terminate.isPending}>
              {t("gatewaySessions.disconnectBtn")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default MCPGatewaySessionsTab;
