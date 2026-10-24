import { useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/cva.config";
import styles from "./LensIntroduction.module.css";
import { GatewayFlow } from "./GatewayFlow";
import { STANDALONE_DOCS_URL, useLensHost } from "../../../host/LensHost";
import { useLensTranslate } from "../../../host/useLensTranslate";

const traceSteps = [
  { name: "research_agent", start: 0, duration: 14.2, failed: false },
  { name: "plan", start: 0, duration: 1.7, failed: false },
  { name: "search_docs", start: 1.7, duration: 3.1, failed: false },
  { name: "run_benchmark", start: 4.8, duration: 1.3, failed: true },
  { name: "search_docs", start: 6.1, duration: 3.6, failed: false },
  { name: "answer", start: 9.7, duration: 4.5, failed: false },
];

type EvidenceProps = { highlighted: boolean; onHighlight: () => void };

function TraceExample({ highlighted, onHighlight }: EvidenceProps) {
  const t = useLensTranslate();
  return (
    <section
      aria-labelledby="lens-sample-trace"
      className={cn(styles.sampleCard, "min-w-0 rounded-xl border bg-card p-4")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <h3 id="lens-sample-trace" className="font-semibold">
          {t("onboarding.tracing")}</h3>
        <p className="text-xs text-muted-foreground">{t("onboarding.sampleTrace142s")}</p>
      </div>
      <ol
        className="mt-3 space-y-1.5 text-xs leading-5 sm:text-sm"
        aria-label={t("onboarding.sampleTraceTimeline")}
      >
        {traceSteps.map((item, index) => {
          const linked = item.failed || item.name === "answer";
          const rowClass =
            "grid w-full grid-cols-[minmax(0,1fr)_minmax(48px,1fr)_2.5rem] items-center gap-2 text-left sm:gap-3";
          const content = (
            <>
              <span
                className={cn(
                  "flex min-w-0 items-center gap-1",
                  index > 0 && "pl-2",
                )}
              >
                {index === 0 ? (
                  <ChevronDown aria-hidden="true" className="size-3 shrink-0" />
                ) : (
                  <ChevronRight
                    aria-hidden="true"
                    className="size-3 shrink-0"
                  />
                )}
                <span className="truncate" title={item.name}>
                  {item.name}
                </span>
                {item.failed && <span className="sr-only">{t("investigations.failed")}</span>}
              </span>
              <span
                aria-hidden="true"
                className="relative h-2.5 overflow-hidden rounded-sm bg-muted/70"
              >
                <span
                  className={cn(
                    "absolute inset-y-0 rounded-sm",
                    linked && styles.evidenceBar,
                    item.failed
                      ? "bg-rose-400"
                      : "bg-indigo-600 dark:bg-indigo-400",
                  )}
                  style={{
                    left: `${(item.start / 14.2) * 100}%`,
                    width: `${(item.duration / 14.2) * 100}%`,
                  }}
                />
              </span>
              <span className="text-right tabular-nums text-muted-foreground">
                {item.duration}s
              </span>
            </>
          );
          return (
            <li key={`${item.name}-${item.start}`}>
              {linked ? (
                <button
                  type="button"
                  className={cn(rowClass, styles.evidenceLink)}
                  data-evidence-link=""
                  aria-label={t("onboarding.value0Value1Secondsvalue2Highlight", { value0: item.name, value1: item.duration, value2: item.failed ? ", failed" : "" })}
                  aria-controls="lens-linked-finding"
                  aria-pressed={highlighted}
                  onClick={onHighlight}
                >
                  {content}
                </button>
              ) : (
                <div className={rowClass}>{content}</div>
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-3 grid gap-3 border-t pt-3 sm:grid-cols-2">
        <div
          id="lens-benchmark-output"
          className={cn(styles.evidenceOutput, "rounded-lg bg-muted/60 p-2.5")}
        >
          <p className="text-xs text-muted-foreground">
            {t("onboarding.runBenchmarkOutput")}</p>
          <p className="mt-1.5 text-sm leading-4.5">
            {t("onboarding.errorBenchmarkRunnerUnavailable")}</p>
        </div>
        <div
          id="lens-answer-output"
          className={cn(styles.evidenceOutput, "rounded-lg bg-muted/60 p-2.5")}
        >
          <p className="text-xs text-muted-foreground">{t("onboarding.answerOutput")}</p>
          <p className="mt-1.5 text-sm leading-4.5">“{t("onboarding.sampleAnswer")}”</p>
        </div>
      </div>
    </section>
  );
}

function FindingExamples({ highlighted, onHighlight }: EvidenceProps) {
  const t = useLensTranslate();
  return (
    <section
      aria-labelledby="lens-sample-findings"
      className={cn(styles.sampleCard, "min-w-0 rounded-xl border bg-card p-4")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <h3 id="lens-sample-findings" className="font-semibold">
          {t("onboarding.lensFindings")}</h3>
        <p className="text-xs text-muted-foreground">
          {t("onboarding.500SampleRunsReviewed")}</p>
      </div>
      <div className="mt-3 divide-y border-t">
        <article
          id="lens-linked-finding"
          className={cn(styles.evidenceFinding, "py-3")}
        >
          <h4 className="text-sm font-semibold">
            <button
              type="button"
              className={cn(
                styles.evidenceLink,
                "flex w-full items-start gap-2 text-left",
              )}
              data-evidence-link=""
              aria-controls="lens-benchmark-output lens-answer-output"
              aria-pressed={highlighted}
              onClick={onHighlight}
            >
              <span
                aria-hidden="true"
                className="mt-1.5 size-2 shrink-0 rounded-full bg-rose-500"
              />
              {t("onboarding.claimsNumbersNeverMeasured")}</button>
          </h4>
          <div className="ml-4 mt-1.5 space-y-1.5 text-sm leading-4.5">
            <p className="text-muted-foreground">
              {t("onboarding.reportsSpeedupEvenThough")}</p>
            <blockquote className="border-l-2 pl-3 italic">
              {t("onboarding.40FasterRowStore")}</blockquote>
            <p>
              <span className="text-muted-foreground">{t("onboarding.nextStep")}</span>{t("onboarding.reportFailedBenchmarkInstead")}</p>
            <p className="text-xs text-muted-foreground">
              {t("onboarding.38LinkedRunsHigh")}</p>
          </div>
        </article>
        <article className="pt-3">
          <h4 className="flex items-start gap-2 text-sm font-semibold">
            <span
              aria-hidden="true"
              className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-500"
            />
            {t("onboarding.promisesFollowUpStops")}</h4>
          <div className="ml-4 mt-1.5 space-y-1.5 text-sm leading-4.5 text-muted-foreground">
            <p>
              {t("onboarding.afterOrderLookupTimes")}</p>
            <p className="text-xs">{t("onboarding.12LinkedRunsMedium")}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export function LensIntroduction({ onStart }: { onStart: () => void }) {
  const t = useLensTranslate();
  const standalone = useLensHost().surface === "standalone";
  const [highlighted, setHighlighted] = useState(false);
  const toggleEvidence = () => setHighlighted((current) => !current);
  return (
    <section
      aria-labelledby="lens-introduction"
      className="rounded-2xl border bg-card p-4 sm:px-6 sm:py-5 xl:px-7"
    >
      <h2
        id="lens-introduction"
        className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl"
      >
        {standalone
          ? t("onboarding.understandImproveAgents")
          : t("onboarding.gatewayHelpsAgentsImprove")}
      </h2>
      <p className="mt-3 max-w-[780px] text-sm leading-6 text-muted-foreground">
        {t("onboarding.turnRecordedAgentRuns")}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button className="rounded-lg px-4" onClick={onStart}>
          {t("onboarding.setUpLens")}</Button>
        <a
          href={
            standalone
              ? STANDALONE_DOCS_URL
              : "https://docs.litellm.ai/docs/proxy/lens"
          }
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 px-3 text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
        >
          {t("onboarding.docs")}<ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
      </div>
      <GatewayFlow standalone={standalone} />
      <div
        className={cn(
          styles.examples,
          "mt-4 grid items-stretch gap-3 @2xl:grid-cols-2",
        )}
        data-evidence-active={highlighted}
      >
        <TraceExample highlighted={highlighted} onHighlight={toggleEvidence} />
        <FindingExamples
          highlighted={highlighted}
          onHighlight={toggleEvidence}
        />
      </div>
    </section>
  );
}
