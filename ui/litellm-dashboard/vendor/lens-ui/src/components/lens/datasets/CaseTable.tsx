"use client";

import {
  getCoreRowModel,
  useReactTable,
  type CellContext,
  type ColumnDef,
  type TableOptions,
} from "@tanstack/react-table";
import { createContext, useContext, type ReactNode } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

import { Inspector } from "../../shared/Inspector";
import { InspectorTable } from "../../shared/InspectorTable";
import { Checkbox } from "../../ui/checkbox";
import { cn } from "../../../lib/cva.config";

import { useOpenSourceTrace } from "../route";
import { FINDING_PANEL_WIDTH_KEY } from "../storage";
import { caseInput, caseReplyText, toolCallCount } from "./caseView";
import type { DatasetCase } from "./types";
import { useLensTranslate } from "../../../host/useLensTranslate";
import { lensTranslate } from "../../../host/lensTranslate";

const CASE_HEIGHT = 36;
const MOBILE_CASE_HEIGHT = 52;
const MUTED_ITALIC = "text-muted-foreground/80 italic";

interface CaseTableContextValue {
  readonly editable: boolean;
  readonly onToggle: (id: string, included: boolean) => void;
}

const CaseTableContext = createContext<CaseTableContextValue | null>(null);

function useCaseTable(): CaseTableContextValue {
  const value = useContext(CaseTableContext);
  if (value === null)
    throw new Error("Case cells must be rendered inside CaseTable");
  return value;
}

export const caseLabel = (index: number): string => lensTranslate("datasets.caseValue0", { value0: index + 1 });

type Cell = CellContext<DatasetCase, unknown>;

function IncludeCell({ row }: Cell) {
  const { editable, onToggle } = useCaseTable();
  return (
    <Checkbox
      aria-label={lensTranslate("datasets.includeValue0", { value0: caseLabel(row.index).toLowerCase() })}
      checked={row.original.included}
      disabled={!editable}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      onCheckedChange={(included) => onToggle(row.original.id, included)}
    />
  );
}

function InputText({ item }: { item: DatasetCase }) {
  const t = useLensTranslate();
  const input = caseInput(item);
  if (!input) return <span className={MUTED_ITALIC}>{t("datasets.noInput")}</span>;
  return (
    <>
      <span className="font-mono text-[var(--lens-brand)]">{input.role}: </span>
      <span className="text-foreground">{input.text}</span>
    </>
  );
}

function ReplyText({ item }: { item: DatasetCase }) {
  const reply = caseReplyText(item);
  return reply ? (
    <span>{reply}</span>
  ) : (
    <span className={MUTED_ITALIC}>{lensTranslate("datasets.reply")}</span>
  );
}

function InputCell({ row: { original: item } }: Cell) {
  return (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="truncate">
        <InputText item={item} />
      </span>
      <span className="truncate text-muted-foreground md:hidden">
        <ReplyText item={item} />
      </span>
    </span>
  );
}

function ReplyCell({ row: { original: item } }: Cell) {
  return (
    <span className="block truncate text-foreground">
      <ReplyText item={item} />
    </span>
  );
}

function ExpectedCell({ row: { original: item } }: Cell) {
  return item.expected ? (
    <span className="block truncate text-foreground">{item.expected}</span>
  ) : (
    <span className={MUTED_ITALIC}>{lensTranslate("datasets.set")}</span>
  );
}

function SourceCell({ row: { original: item } }: Cell) {
  const openSourceTrace = useOpenSourceTrace();
  const {
    trace_id: traceId,
    trace_ref: traceRef,
    span_id: spanId,
  } = item.source;
  if (!traceId) return null;
  return (
    <button
      type="button"
      aria-label={lensTranslate("datasets.openSourceTrace")}
      title={lensTranslate("datasets.openSourceTrace")}
      onClick={(event) => {
        event.stopPropagation();
        openSourceTrace({ traceId, traceRef, spanId });
      }}
      className="inline-flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
    >
      <SquareArrowOutUpRight className="size-3.5" />
    </button>
  );
}

function ToolCallsCell({ row: { original: item } }: Cell) {
  const count = toolCallCount(item);
  if (count === 0) return null;
  return (
    <span
      title={lensTranslate("datasets.value0ToolValue1", { value0: count, value1: count === 1 ? "call" : "calls" })}
      className="inline-flex min-w-5 justify-center rounded-md bg-[var(--lens-violet)]/10 px-1.5 font-mono text-xs tabular-nums text-[var(--lens-violet)]"
    >
      {count}
    </span>
  );
}

const COLUMNS: ColumnDef<DatasetCase>[] = [
  {
    id: "include",
    size: 40,
    get header() { return lensTranslate("datasets.include"); },
    cell: IncludeCell,
    meta: { headerClassName: "sr-only", className: "pr-0" },
  },
  { id: "input", get header() { return lensTranslate("datasets.input"); }, cell: InputCell },
  { id: "reply", get header() { return lensTranslate("datasets.reply3"); }, cell: ReplyCell },
  { id: "expected", size: 220, get header() { return lensTranslate("datasets.expected"); }, cell: ExpectedCell },
  { id: "source", size: 72, get header() { return lensTranslate("datasets.source"); }, cell: SourceCell },
  {
    id: "tools",
    size: 104,
    get header() { return lensTranslate("datasets.toolCalls"); },
    cell: ToolCallsCell,
    meta: { numeric: true },
  },
];

export interface CaseTableProps {
  readonly cases: readonly DatasetCase[];
  readonly editable: boolean;
  readonly selectedId: string | null;
  readonly onSelect: (id: string | null) => void;
  readonly onToggle: (id: string, included: boolean) => void;
  readonly children: (item: DatasetCase) => ReactNode;
}

export function CaseTable({
  cases,
  editable,
  selectedId,
  onSelect,
  onToggle,
  children,
}: CaseTableProps) {
  const t = useLensTranslate();
  const desktop = useMediaQuery("(min-width: 768px)");
  const tableOptions: TableOptions<DatasetCase> = {
    data: [...cases],
    columns: COLUMNS,
    defaultColumn: { size: undefined },
    state: {
      columnVisibility: { reply: desktop, expected: desktop, source: desktop },
    },
    getRowId: (item) => item.id,
    autoResetAll: false,
    getCoreRowModel: getCoreRowModel(),
  };
  const table = useReactTable(tableOptions);
  const selected = cases.find((item) => item.id === selectedId) ?? null;
  const included = cases.filter((item) => item.included).length;
  return (
    <Inspector.Root
      items={cases}
      itemKey={(item) => item.id}
      selected={selected}
      onSelectedChange={(item) => onSelect(item?.id ?? null)}
      noun="case"
      storageKey={FINDING_PANEL_WIDTH_KEY}
    >
      <CaseTableContext.Provider value={{ editable, onToggle }}>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-card">
          <InspectorTable.Root table={table}>
            <InspectorTable.Grid
              aria-label={t("datasets.cases")}
              className="lens-table text-xs md:min-w-[860px]"
            >
              <InspectorTable.Header />
              <InspectorTable.Body<DatasetCase>
                rowHeight={() => (desktop ? CASE_HEIGHT : MOBILE_CASE_HEIGHT)}
              >
                {(row) => (
                  <InspectorTable.Row
                    row={row}
                    item={row.original}
                    tabIndex={0}
                    aria-label={caseLabel(row.index)}
                    className={cn(
                      "group h-13 md:h-9",
                      !row.original.included &&
                        "[&>td:not(:first-child)]:opacity-50",
                    )}
                  />
                )}
              </InspectorTable.Body>
            </InspectorTable.Grid>
          </InspectorTable.Root>
          <footer className="lens-toolbar flex h-8 shrink-0 items-center border-t px-3 font-mono text-[11px] text-muted-foreground">
            {cases.length} {cases.length === 1 ? "case" : "cases"} · {included}{" "}
            included
          </footer>
        </div>
      </CaseTableContext.Provider>
      <Inspector.Panel<DatasetCase> label={t("datasets.caseDetails")} testId="case-panel">
        {children}
      </Inspector.Panel>
    </Inspector.Root>
  );
}
