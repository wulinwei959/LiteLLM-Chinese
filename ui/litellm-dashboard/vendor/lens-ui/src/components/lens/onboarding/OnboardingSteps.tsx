"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "../../ui/button";
import { TracingSetupFields, useLensService } from "./tracing/TracingSetupCard";
import { cn } from "../../../lib/cva.config";
import { useLensAccessToken } from "../data/LensServices";
import type { LensReadiness } from "../hooks/useLensReadiness";
import { initialSetupStep } from "../model/readiness";
import { StepIndicator, type StepState } from "../ui/StepIndicator";
import { useOnboarding } from "./OnboardingContext";
import { useLensTranslate } from "../../../host/useLensTranslate";
import { lensTranslate } from "../../../host/lensTranslate";

type StepProps = {
  state: LensReadiness;
  goTo: (step: number) => void;
  storageReady: boolean;
};

function useLocked() {
  const { readOnly, canInvestigate } = useOnboarding();
  return readOnly || !canInvestigate;
}

function StorageStep({ state, goTo, storageReady }: StepProps) {
  const { readOnly, openTrace } = useOnboarding();
  const accessToken = useLensAccessToken();
  if (!storageReady)
    return (
      <>
        <TracingSetupFields
          detail={lensTranslate("onboarding.tracingEnabled")}
          accessToken={accessToken}
          onOpenTrace={openTrace}
          onCheck={state.refresh}
          checking={state.checking}
          readOnly={readOnly}
        />
        <ActivityContinuation state={state} />
      </>
    );
  return (
    <div className="space-y-4">
      <p role="status" className="text-sm text-success">
        {lensTranslate("onboarding.traceStorageConnected")}</p>
      <Button onClick={() => goTo(1)}>
        {lensTranslate("onboarding.continueAgent")}<ArrowRight aria-hidden="true" className="size-4" />
      </Button>
      <ActivityContinuation state={state} />
    </div>
  );
}

function ActivityContinuation({ state }: { state: LensReadiness }) {
  const t = useLensTranslate();
  const { connect, create } = useOnboarding();
  const locked = useLocked();
  if (!state.activityReady) return null;
  return (
    <div className="mt-4">
      <Button onClick={state.connected ? create : connect} disabled={locked}>
        {state.connected ? t("onboarding.continueInvestigation") : t("tabs.configureAnalysis")}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
      {state.requestsReady && !state.tracesReady && (
        <p className="mt-2 text-xs text-muted-foreground">
          {t("onboarding.requestLogsAlreadyAvailable")}</p>
      )}
    </div>
  );
}

function AgentStep({ state }: StepProps) {
  const { readOnly, canMintTracingKey, openTrace } = useOnboarding();
  const accessToken = useLensAccessToken();
  return (
    <>
      <div hidden={state.tracesReady}>
        <TracingSetupFields
          detail={null}
          accessToken={accessToken}
          onOpenTrace={(value) => {
            state.refresh();
            openTrace(value);
          }}
          onCheck={state.refresh}
          checking={state.checking}
          readOnly={readOnly}
          canMintTracingKey={canMintTracingKey}
        />
      </div>
      {state.tracesReady && (
        <p role="status" className="text-sm text-success">
          {lensTranslate("onboarding.firstTraceReadyContinue")}</p>
      )}
      <ActivityContinuation state={state} />
    </>
  );
}

function AnalysisStep({ state }: StepProps) {
  const { connect, create } = useOnboarding();
  const locked = useLocked();
  return (
    <div className="space-y-4">
      <p role="status" className="text-sm text-muted-foreground">
        {state.connected
          ? lensTranslate("onboarding.analysisConfiguredReReady")
          : lensTranslate("onboarding.addProviderKeyModel")}
      </p>
      {!state.activityReady && (
        <p className="text-sm text-muted-foreground">{lensTranslate("onboarding.sendTraceBeforeStarting")}</p>
      )}
      <Button onClick={state.connected ? create : connect} disabled={!state.activityReady || locked}>
        {state.connected ? lensTranslate("onboarding.continueInvestigation") : lensTranslate("tabs.configureAnalysis")}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}

function InvestigationStep({ state }: StepProps) {
  const { create } = useOnboarding();
  const locked = useLocked();
  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-muted-foreground">
        {lensTranslate("onboarding.chooseActivityReviewDescribe")}</p>
      {!state.ready && (
        <p className="text-sm text-muted-foreground">
          {lensTranslate("onboarding.recordedActivityAnalysisModel")}</p>
      )}
      <Button onClick={create} disabled={!state.ready || locked}>
        {lensTranslate("workspace.newInvestigation")}<ArrowRight aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}

interface StepDefinition {
  readonly title: string;
  readonly description: string;
  readonly complete: (state: LensReadiness, storageReady: boolean) => boolean;
  readonly Content: (props: StepProps) => ReactNode;
}

const STEPS: readonly StepDefinition[] = [
  {
    get title() { return lensTranslate("onboarding.installLens"); },
    get description() { return lensTranslate("onboarding.enableLensHelmDocker"); },
    complete: (_state, storageReady) => storageReady,
    Content: StorageStep,
  },
  {
    get title() { return lensTranslate("onboarding.sendFirstTrace"); },
    get description() { return lensTranslate("onboarding.captureAgentSInputs"); },
    complete: (state) => state.tracesReady,
    Content: AgentStep,
  },
  {
    get title() { return lensTranslate("tabs.configureAnalysis"); },
    get description() { return lensTranslate("onboarding.chooseAnalysisModelSpending"); },
    complete: (state) => state.connected,
    Content: AnalysisStep,
  },
  {
    get title() { return lensTranslate("onboarding.runFirstInvestigation"); },
    get description() { return lensTranslate("onboarding.describeExpectedBehaviorReview"); },
    complete: (state) => state.hasInvestigations,
    Content: InvestigationStep,
  },
];

function stepState(complete: boolean, open: boolean): StepState {
  if (complete) return "complete";
  return open ? "current" : "upcoming";
}

export function OnboardingSteps({
  state,
  className,
  includeTracing,
}: {
  state: LensReadiness;
  className?: string;
  includeTracing: boolean;
}) {
  const id = useId();
  const listRef = useRef<HTMLOListElement>(null);
  const offset = includeTracing ? 0 : 2;
  const accessToken = useLensAccessToken();
  const service = useLensService(accessToken);
  const storageReady = Boolean(service.data?.connected && service.data.status.storage_ready && service.data.url);
  const [step, setStep] = useState(() => Math.max(offset, initialSetupStep(state)));
  const visibleStep = !storageReady && step === 1 ? 0 : step;
  const goTo = (index: number) => {
    setStep(index);
    listRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="${id}-${index}"]`)?.focus();
  };
  return (
    <ol
      ref={listRef}
      data-slot="onboarding-steps"
      className={cn("divide-y overflow-hidden rounded-2xl border bg-card", className)}
    >
      {STEPS.slice(offset).map(({ title, description, complete, Content }, index) => {
        const stepIndex = index + offset;
        const open = Math.max(offset, visibleStep) === stepIndex;
        return (
          <li key={title}>
            <h3>
              <button
                type="button"
                id={`${id}-trigger-${stepIndex}`}
                aria-expanded={open}
                aria-controls={`${id}-${stepIndex}`}
                onClick={() => setStep(stepIndex)}
                className="group flex w-full items-start gap-4 p-5 text-left outline-none hover:bg-muted/30 focus-visible:bg-muted/50 sm:p-6"
              >
                <StepIndicator index={index} state={stepState(complete(state, storageReady), open)} />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-sm font-medium sm:text-base",
                      !open && "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    {title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 font-normal text-muted-foreground">{description}</span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn("mt-1 size-4 shrink-0 text-muted-foreground", open && "rotate-180")}
                />
              </button>
            </h3>
            <div
              id={`${id}-${stepIndex}`}
              role="region"
              aria-labelledby={`${id}-trigger-${stepIndex}`}
              hidden={!open}
              className="px-5 pb-6 sm:pr-6 sm:pb-7 sm:pl-17"
            >
              <Content state={state} goTo={goTo} storageReady={storageReady} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
