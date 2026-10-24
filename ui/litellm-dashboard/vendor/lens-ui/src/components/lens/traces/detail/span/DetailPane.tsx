"use client";

import type { TreeRow } from "../../tree";
import type { Trace } from "../../types";
import { GroupPane } from "./GroupPane";
import { SpanPane, type SpanTabProps } from "./SpanPane";
import { useLensTranslate } from "../../../../../host/useLensTranslate";

interface DetailPaneProps extends SpanTabProps {
  trace: Trace;
  row: TreeRow | undefined;
  accessToken: string;
  onClose: () => void;
}

/** Right pane of the run view: switches on the selected tree row. */
export function DetailPane({ trace, row, accessToken, spanTab, onSpanTabChange, onClose }: DetailPaneProps) {
  const t = useLensTranslate();
  if (!row || row.kind === "load-more") {
    return (
      <div className="grid h-full place-items-center bg-background text-sm text-muted-foreground">
        {t("traces.selectSpanInspect")}</div>
    );
  }
  if (row.kind === "group")
    return <GroupPane key={row.id} trace={trace} row={row} accessToken={accessToken} onClose={onClose} />;
  return (
    <SpanPane
      key={row.id}
      trace={trace}
      span={row.span}
      accessToken={accessToken}
      spanTab={spanTab}
      onSpanTabChange={onSpanTabChange}
      onClose={onClose}
    />
  );
}
