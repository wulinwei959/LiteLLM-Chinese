"use client";

import { Pause, Play, Settings2, MoreHorizontal, Copy } from "lucide-react";
import { Button } from "../../../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../ui/dropdown-menu";
import { hasActiveJob } from "../../model/status";
import { type Lens } from "../../model/types";
import { useLensTranslate } from "../../../../host/useLensTranslate";

export interface InvestigationIntents {
  readonly onEdit: () => void;
  readonly onDuplicate: () => void;
  readonly onPause: () => void;
  readonly onEnableMonitoring: () => void;
  readonly onCancelRun: () => void;
  readonly onRunNow: () => void;
  readonly onConnectWorker: () => void;
}

export type InvestigationActionsProps = Omit<InvestigationIntents, "onCancelRun" | "onConnectWorker"> & {
  readonly lens: Lens;
  readonly ready: boolean;
  readonly busy: boolean;
};

export function InvestigationActions({
  lens,
  ready,
  busy,
  onEdit,
  onDuplicate,
  onPause,
  onEnableMonitoring,
  onRunNow,
}: InvestigationActionsProps) {
  const t = useLensTranslate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={t("investigations.investigationActions")} />}>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem disabled={busy || hasActiveJob(lens.jobs) || !ready} onClick={onRunNow}>
          <Play />
          {t("investigations.runNow")}</DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Settings2 />
          {t("investigations.editInvestigation")}</DropdownMenuItem>
        <DropdownMenuItem disabled={!ready} onClick={onDuplicate}>
          <Copy />
          {t("investigations.duplicate")}</DropdownMenuItem>
        {lens.settings.enabled ? (
          <DropdownMenuItem disabled={busy} onClick={onPause}>
            <Pause />
            {t("investigations.pauseMonitoring")}</DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled={!ready || busy} onClick={onEnableMonitoring}>
            <Play />
            {t("investigations.enableMonitoring")}</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
