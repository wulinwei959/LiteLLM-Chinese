"use client";

import { useMemo } from "react";

import type { TraceSummary } from "../../types";
import type { TimeWindow } from "../../../../shared/timeRange/timeRange";

import { SearchBox } from "../../../../shared/search/SearchBox";
import { itemValues } from "../../../../shared/search/valueSource";
import { RUN_INDEX, RUN_QUERY } from "./runQuery";
import { runQueryCommand } from "./runSql";
import { useLensTranslate } from "../../../../../host/useLensTranslate";

interface RunSearchProps {
  value: string;
  onChange: (value: string) => void;
  /** Loaded runs, the source of value suggestions. */
  runs: readonly TraceSummary[];
  /** The range the list shows; the copied query bounds itself to it. */
  range?: TimeWindow;
  busy?: boolean;
}

/** The runs list query box: free text plus `key:value` filters over run fields, copyable as a trace query. */
export function RunSearch({ value, onChange, runs, range, busy = false }: RunSearchProps) {
  const t = useLensTranslate();
  const command = useMemo(() => runQueryCommand(range), [range]);
  return (
    <SearchBox.Root
      language={RUN_QUERY}
      values={itemValues(RUN_INDEX, runs)}
      value={value}
      onValueChange={onChange}
      label={t("traces.searchRuns")}
      className="h-10 min-w-0 basis-full sm:w-auto sm:basis-0"
    >
      <SearchBox.Input
        className="h-full overflow-hidden rounded-none border-0 px-3 whitespace-nowrap focus-within:bg-muted/40 focus-within:ring-0 dark:bg-transparent"
        placeholder={t("traces.searchInputTraceID")}
        busy={busy}
      />
      <SearchBox.Suggestions>
        <SearchBox.CopyCommand title={t("shared.copyCurlListHint")} command={command} />
      </SearchBox.Suggestions>
    </SearchBox.Root>
  );
}
