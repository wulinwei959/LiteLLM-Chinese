"use client";

import { queueReasonText, workerTaskText, type QueueReason } from "../model/status";
import type { QueueContext } from "./useQueueReason";
import { useLensTranslate } from "../../../host/useLensTranslate";

export function QueueReasonText({ reason, onConnect }: { reason: QueueReason; onConnect?: () => void }) {
  const t = useLensTranslate();
  if (reason.kind !== "no_worker" || !onConnect) return <>{queueReasonText(reason)}</>;
  return (
    <>
      {t("investigations.analysisUnavailableCheck")}{" "}
      <button type="button" onClick={onConnect} className="font-medium text-foreground underline underline-offset-2">
        {t("tabs.configureAnalysis")}</button>{" "}
      {t("investigations.settings")}</>
  );
}

export function WorkerTasks({ reason, queue }: { reason: QueueReason; queue?: QueueContext }) {
  const t = useLensTranslate();
  if (reason.kind === "no_worker" || !reason.tasks.length) return null;
  return (
    <ol aria-label={t("investigations.workerDoing")} className="flex flex-col">
      {reason.tasks.map((task) => (
        <li key={task.lensId}>
          <button
            type="button"
            disabled={!queue}
            onClick={() => queue?.onOpenLens(task.lensId)}
            className="w-full truncate rounded px-1.5 py-0.5 text-left tabular-nums hover:bg-muted hover:text-foreground"
          >
            {workerTaskText(task)}
          </button>
        </li>
      ))}
    </ol>
  );
}
