"use client";

import { useId, type ReactNode } from "react";
import { SquareArrowOutUpRight } from "lucide-react";

import { Button } from "../../ui/button";
import { Switch } from "../../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Textarea } from "../../ui/textarea";

import { useOpenSourceTrace } from "../route";
import { MessageList } from "../traces/detail/content/Messages";
import { Section } from "../traces/detail/content/Section";
import { IdChip } from "../traces/ui/IdChip";
import {
  caseConversation,
  caseOutput,
  shortCaseId,
  type CaseEdit,
} from "./caseView";
import type { DatasetCase } from "./types";
import { useLensTranslate } from "../../../host/useLensTranslate";

export interface CasePanelProps {
  readonly item: DatasetCase;
  readonly datasetName: string;
  readonly editable: boolean;
  readonly onEdit: (edit: CaseEdit) => void;
}

export function CasePanel({
  item,
  datasetName,
  editable,
  onEdit,
}: CasePanelProps) {
  const t = useLensTranslate();
  return (
    <Tabs defaultValue="case" className="min-h-0 flex-1 gap-0">
      <header className="lens-toolbar flex shrink-0 flex-col gap-1.5 px-4 pt-3 pb-2">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="min-w-0 truncate font-mono text-sm font-semibold text-foreground">
            {t("datasets.case")}{shortCaseId(item.id)}{" "}
            <span className="font-normal text-muted-foreground">
              @ {datasetName}
            </span>
          </h2>
          <IdChip value={item.id} label={t("datasets.copyCaseID")} />
          <label className="ml-auto flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
            {t("datasets.included")}<Switch
              size="sm"
              checked={item.included}
              disabled={!editable}
              onCheckedChange={(included) => onEdit({ included })}
            />
          </label>
        </div>
      </header>
      <div className="shrink-0 border-b px-4">
        <TabsList
          variant="line"
          aria-label={t("datasets.caseSections")}
          className="h-9 gap-4 px-0"
        >
          <TabsTrigger value="case" className="flex-none px-0 text-sm">
            {t("datasets.case6")}</TabsTrigger>
          <TabsTrigger value="source" className="flex-none px-0 text-sm">
            {t("datasets.source")}</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="case" className="min-h-0 overflow-auto pt-1">
        <CaseBody item={item} editable={editable} onEdit={onEdit} />
      </TabsContent>
      <TabsContent value="source" className="min-h-0 overflow-auto">
        <SourceBody item={item} />
      </TabsContent>
    </Tabs>
  );
}

function CaseBody({
  item,
  editable,
  onEdit,
}: Omit<CasePanelProps, "datasetName">) {
  const t = useLensTranslate();
  const expectedId = useId();
  const conversation = caseConversation(item);
  const output = caseOutput(item);
  return (
    <>
      <Section title={t("datasets.input")} count={conversation.length}>
        {conversation.length ? (
          <MessageList messages={conversation} />
        ) : (
          <Empty>{t("datasets.conversationRecorded")}</Empty>
        )}
      </Section>
      <Section title={t("datasets.output")}>
        {output.length ? (
          <MessageList messages={output} />
        ) : (
          <Empty>{t("datasets.replyRecorded")}</Empty>
        )}
      </Section>
      <section
        aria-label={t("datasets.expected")}
        className="flex flex-col gap-2 px-4 pt-2 pb-5"
      >
        <label
          htmlFor={expectedId}
          className="lens-section-label text-xs font-semibold"
        >
          {t("datasets.expected")}</label>
        {editable ? (
          <Textarea
            id={expectedId}
            value={item.expected}
            placeholder={t("datasets.goodReplyLooksLike")}
            className="min-h-24 border-[var(--lens-brand)]/20 bg-[var(--lens-soft)] text-sm"
            onChange={(event) => onEdit({ expected: event.target.value })}
          />
        ) : (
          <p
            id={expectedId}
            className="text-sm whitespace-pre-wrap text-foreground"
          >
            {item.expected || (
              <span className="text-muted-foreground italic">{t("datasets.set")}</span>
            )}
          </p>
        )}
      </section>
    </>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="py-2 text-sm text-muted-foreground italic">{children}</p>
  );
}

const SOURCE_FIELDS = [
  ["datasets.trace", "trace_id"],
  ["datasets.span", "span_id"],
  ["datasets.finding", "finding_id"],
  ["investigations.investigation", "lens_id"],
] as const;

function SourceBody({ item }: { item: DatasetCase }) {
  const t = useLensTranslate();
  const openSourceTrace = useOpenSourceTrace();
  const { source } = item;
  return (
    <div className="flex flex-col gap-4 p-4">
      <dl className="lens-panel grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-6 gap-y-2 rounded-lg border p-3 font-mono text-xs">
        {SOURCE_FIELDS.map(([label, key]) => (
          <div key={key} className="contents">
            <dt className="text-muted-foreground">{t(label)}</dt>
            <dd className="flex min-w-0 items-center gap-1">
              {source[key] ? (
                <IdChip
                  value={source[key]}
                  label={t("datasets.copyValue0ID", { value0: label.toLowerCase() })}
                  showValue
                />
              ) : (
                <span className="text-muted-foreground italic">{t("datasets.none")}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {source.trace_id && (
        <Button
          size="sm"
          variant="outline"
          className="self-start"
          onClick={() =>
            openSourceTrace({
              traceId: source.trace_id,
              traceRef: source.trace_ref,
              spanId: source.span_id,
            })
          }
        >
          {t("datasets.openSourceTrace")}<SquareArrowOutUpRight className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
