"use client";

import { analysisElapsed } from "../../model/progress";
import type { Job } from "../../model/types";
import { useLensTranslate } from "../../../../host/useLensTranslate";

export function ScanDuration({ job }: { job: Job }) {
  const t = useLensTranslate();
  if (!job.finished_at) return null;
  return (
    <span title={t("investigations.totalTimeIncludingAny")}>
      {t("investigations.took")}
      {analysisElapsed(job.created_at, Date.parse(job.finished_at))}
    </span>
  );
}
