"use client";

import { ArrowRight, Bot, Github, Plus, Search } from "lucide-react";

import { useNow } from "../../../hooks/useNow";
import { formatActivityTimestamp } from "../../../utils/activityTimestamp";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { agoLabel } from "../model/format";
import { useAgentSearchRoute } from "../route";
import { traceFramework } from "../traces/ui/TraceFramework";
import { AgentMark, matchesAgent } from "./AgentPicker";
import type { LensAgents } from "./AgentScoped";
import { AGENT_WINDOW_DAYS } from "./useAgents";
import { LensPageHeader } from "../ui/LensPageHeader";
import { useLensTranslate } from "../../../host/useLensTranslate";

export function AgentsView({
  agents,
  onOpenAgent,
  onConnectProject,
  onConnectGitHub,
}: {
  agents: LensAgents;
  onOpenAgent: (agent: string) => void;
  onConnectProject?: () => void;
  onConnectGitHub?: (agent: string) => void;
}) {
  const t = useLensTranslate();
  const [search, setSearch] = useAgentSearchRoute();
  const now = useNow(30_000);
  const { agents: all, isLoading, error } = agents.list;
  const shown = all.filter((agent) => matchesAgent(agent, search));

  return (
    <section aria-label={t("agents.agentsDirectory")} className="flex flex-col gap-5 p-4 sm:p-6">
      <LensPageHeader
        section={t("agents.01AGENTDIRECTORY")}
        title={
          <>
            {t("tabs.agents")}{!isLoading && !error && (
              <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 font-mono text-xs font-medium text-indigo-700 tabular-nums dark:border-indigo-400/25 dark:bg-indigo-400/10 dark:text-indigo-300">
                {all.length.toLocaleString()}
              </span>
            )}
          </>
        }
        description={t("agents.chooseAgentExploreTraces")}
        actions={
          <>
            <span className="font-mono text-[11px] text-muted-foreground">{t("agents.lastValue0Days", { value0: AGENT_WINDOW_DAYS })}</span>
            {onConnectProject && (
              <Button size="sm" onClick={onConnectProject}>
                <Plus aria-hidden className="size-4" />
                {t("agents.connectProject")}</Button>
            )}
          </>
        }
      />

      <div className="relative w-full sm:max-w-80">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label={t("agents.searchAgents")}
          placeholder={t("agents.searchAgents2")}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-9 bg-background pl-9 shadow-none"
        />
      </div>

      {isLoading && (
        <p role="status" className="py-16 text-center text-sm text-muted-foreground">
          {t("agents.loadingAgents")}</p>
      )}
      {!isLoading && error && (
        <p role="alert" className="rounded-lg border p-6 text-sm text-destructive">
          {t("agents.couldLoadAgentsRefresh")}</p>
      )}
      {!isLoading && !error && all.length === 0 && (
        <div className="lens-empty-state flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
          <span className="flex size-10 items-center justify-center rounded-lg border bg-muted/40">
            <Bot aria-hidden className="size-5 text-muted-foreground" />
          </span>
          <div className="space-y-1">
            <h3 className="text-sm font-medium">{t("agents.agentsYet")}</h3>
            <p className="max-w-sm text-sm text-muted-foreground">{t("agents.agentsAppearLensReceives")}</p>
          </div>
        </div>
      )}
      {!isLoading && !error && all.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table aria-label={t("tabs.agents")}>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-4 text-xs font-normal text-muted-foreground">{t("agents.agent")}</TableHead>
                <TableHead className="px-4 text-right text-xs font-normal text-muted-foreground">{t("agents.runs")}</TableHead>
                <TableHead className="px-4 text-right text-xs font-normal text-muted-foreground">{t("agents.errors")}</TableHead>
                <TableHead className="px-4 text-right text-xs font-normal text-muted-foreground">{t("agents.lastActive")}</TableHead>
                {onConnectGitHub && (
                  <TableHead className="px-4 text-right text-xs font-normal text-muted-foreground">{t("agents.pREvals")}</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((agent) => {
                const framework = traceFramework({
                  frameworks: [...agent.frameworks],
                });
                return (
                  <TableRow key={agent.name}>
                    <TableCell className="px-4 py-3">
                      <Button
                        variant="ghost"
                        aria-label={t("agents.openValue0", { value0: agent.name })}
                        onClick={() => onOpenAgent(agent.name)}
                        className="group -ml-2 h-auto max-w-full justify-start gap-3 px-2 py-1.5 text-left"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--lens-border)] bg-[var(--lens-soft)] text-[var(--lens-cyan)]">
                          <AgentMark agent={agent} />
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="max-w-64 truncate font-mono text-[13px] font-medium">{agent.name}</span>
                          <span className="text-xs font-normal text-muted-foreground">
                            {framework?.label ?? t("agents.agent")}
                          </span>
                        </span>
                        <ArrowRight
                          aria-hidden
                          className="ml-3 size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                        />
                      </Button>
                    </TableCell>
                    <TableCell className="px-4 text-right tabular-nums">{agent.runs.toLocaleString()}</TableCell>
                    <TableCell className="px-4 text-right tabular-nums">
                      <span className={agent.failed_runs > 0 ? "text-destructive" : "text-muted-foreground"}>
                        {agent.failed_runs.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 text-right text-xs text-muted-foreground">
                      <time dateTime={agent.last_seen} title={formatActivityTimestamp(agent.last_seen)}>
                        {agoLabel(Date.parse(agent.last_seen), now)}
                      </time>
                    </TableCell>
                    {onConnectGitHub && (
                      <TableCell className="px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={t("agents.connectGitHubValue0", { value0: agent.name })}
                          onClick={() => onConnectGitHub(agent.name)}
                        >
                          <Github aria-hidden="true" className="size-3.5" /> {t("workspace.connectGitHub")}</Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {shown.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={onConnectGitHub ? 5 : 4}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    {t("agents.agentsMatchValue0", { value0: search })}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
