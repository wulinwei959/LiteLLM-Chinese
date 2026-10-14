"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type RunStatusFilter = "all" | "ok" | "error";

export const ALL_AGENTS = "all";

interface RunsToolbarProps {
  query: string;
  agent: string;
  status: RunStatusFilter;
  agents: string[];
  onQueryChange: (value: string) => void;
  onAgentChange: (value: string) => void;
  onStatusChange: (value: RunStatusFilter) => void;
  /** Extra controls (time range, live tail) rendered on the right. */
  children?: React.ReactNode;
}

type StatusLabelKey = "allStatuses" | "traceList.statusSucceeded" | "traceList.failed";

const STATUS_ITEMS: { value: RunStatusFilter; labelKey: StatusLabelKey }[] = [
  { value: "all", labelKey: "allStatuses" },
  { value: "ok", labelKey: "traceList.statusSucceeded" },
  { value: "error", labelKey: "traceList.failed" },
];

/** Search + agent / status filters for the Runs table. Filtering is client-side over the loaded page. */
export function RunsToolbar({
  query,
  agent,
  status,
  agents,
  onQueryChange,
  onAgentChange,
  onStatusChange,
  children,
}: RunsToolbarProps) {
  const t = useTranslations("logs");
  const statusItems = STATUS_ITEMS.map((item) => ({ value: item.value, label: t(item.labelKey) }));
  const agentItems = [
    { value: ALL_AGENTS, label: t("traceList.agentAll") },
    ...agents.map((s) => ({ value: s, label: s })),
  ];
  return (
    <div className="flex min-h-11 shrink-0 flex-wrap items-center gap-2 border-b border-border bg-card px-3 py-2">
      <div className="relative w-full max-w-[380px]">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("traceList.searchPlaceholder")}
          aria-label={t("traceList.searchRunsAria")}
          className="h-7 pl-8 text-[12px]"
        />
      </div>
      <Select
        items={agentItems}
        value={agent}
        onValueChange={(value: string | null) => value !== null && onAgentChange(value)}
      >
        <SelectTrigger
          size="sm"
          className="h-7 min-w-[130px] text-[12px]"
          aria-label={t("traceList.filterByAgentAria")}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {agentItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        items={statusItems}
        value={status}
        onValueChange={(value: RunStatusFilter | null) => value !== null && onStatusChange(value)}
      >
        <SelectTrigger size="sm" className="h-7 min-w-[110px] text-[12px]" aria-label={t("filterByStatus")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {children && <div className="ml-auto flex items-center gap-2">{children}</div>}
    </div>
  );
}
