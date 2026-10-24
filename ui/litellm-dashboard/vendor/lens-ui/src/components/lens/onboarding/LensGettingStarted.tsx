"use client";

import { useRef } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Button } from "../../ui/button";
import type { LensReadiness } from "../hooks/useLensReadiness";
import { LensIntroduction } from "./LensIntroduction";
import { OnboardingSetup } from "./OnboardingSetup";
import { useLensHost } from "../../../host/LensHost";
import { useLensTranslate } from "../../../host/useLensTranslate";
import { lensTranslate } from "../../../host/lensTranslate";

const PREREQUISITES = [
  { get title() { return lensTranslate("onboarding.liteLLMGateway"); }, get detail() { return lensTranslate("onboarding.accessConfiguration"); } },
  { get title() { return lensTranslate("onboarding.traceStorage"); }, get detail() { return lensTranslate("onboarding.includedUseOwnClickHouse"); } },
  { get title() { return lensTranslate("onboarding.dockerKubernetes"); }, get detail() { return lensTranslate("onboarding.useExistingDeployment"); } },
  {
    get title() { return lensTranslate("onboarding.analysisModel"); },
    get detail() { return lensTranslate("onboarding.investigationsAfterTracingConnected"); },
  },
] as const;

export interface LensGettingStartedProps {
  readonly state: LensReadiness;
  readonly onStart: () => void;
  readonly onExit: (to: "traces" | "investigations") => void;
}

export function LensGettingStarted({ state, onStart, onExit }: LensGettingStartedProps) {
  const t = useLensTranslate();
  const setupRef = useRef<HTMLElement>(null);
  const exitTo = state.tracesReady ? "traces" : "investigations";
  const start = () => {
    onStart();
    setupRef.current?.scrollIntoView({ block: "start" });
    setupRef.current?.focus({ preventScroll: true });
  };
  return (
    <section aria-label={t("onboarding.getStartedLens")} className="@container mx-auto w-full max-w-7xl space-y-6">
      <LensIntroduction onStart={start} />
      <div className="grid items-start gap-6 @3xl:grid-cols-[minmax(0,1fr)_280px] @3xl:gap-8">
        <OnboardingSetup
          ref={setupRef}
          tabIndex={-1}
          state={state}
          onFocusCapture={onStart}
          action={
            (state.activityReady || state.hasInvestigations) && (
              <Button variant="outline" size="sm" onClick={() => onExit(exitTo)}>
                {exitTo === "traces" ? t("onboarding.viewTraces") : t("onboarding.viewInvestigations")}
              </Button>
            )
          }
        />
        <Prerequisites />
      </div>
    </section>
  );
}

function Prerequisites() {
  const t = useLensTranslate();
  const host = useLensHost();
  const standalone = host.surface === "standalone";
  const prerequisites = standalone
    ? [
        {
          title: t("onboarding.lensClickHouse"),
          detail: t("onboarding.includedLensDeployment"),
        },
        {
          title: t("onboarding.agentObserve"),
          detail: t("onboarding.keepExistingModelProvider"),
        },
        {
          title: t("onboarding.analysisModel"),
          detail: t("onboarding.neededRunInvestigations"),
        },
      ]
    : PREREQUISITES;
  return (
    <aside className="rounded-2xl border bg-card p-6" aria-labelledby="lens-prerequisites">
      <h2 id="lens-prerequisites" className="text-base font-semibold">
        {t("onboarding.beforeStart")}</h2>
      <ul className="mt-5 space-y-5 text-sm">
        {prerequisites.map((item) => (
          <li key={item.title} className="flex gap-3">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 leading-5 text-muted-foreground">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex gap-2 border-t pt-5 text-xs leading-5 text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>{t("onboarding.infrastructureStoresTracesInvestigation")}</p>
      </div>
    </aside>
  );
}
