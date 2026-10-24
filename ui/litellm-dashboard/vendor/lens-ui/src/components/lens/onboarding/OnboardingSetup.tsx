"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/cva.config";
import type { LensReadiness } from "../hooks/useLensReadiness";
import { useOnboarding } from "./OnboardingContext";
import { OnboardingSteps } from "./OnboardingSteps";
import { useLensAccessToken } from "../data/LensServices";
import { useLensService } from "./tracing/TracingSetupCard";
import { SetupAgentPrompt } from "./SetupAgentPrompt";
import { useLensTranslate } from "../../../host/useLensTranslate";

export type OnboardingSetupProps = Omit<ComponentProps<"section">, "children"> & {
  state: LensReadiness;
  action?: ReactNode;
  includeTracing?: boolean;
};

export function OnboardingSetup({ state, action, includeTracing = true, className, ...props }: OnboardingSetupProps) {
  const t = useLensTranslate();
  const { readOnly, canInvestigate } = useOnboarding();
  const titleId = useId();
  const connection = useLensService(useLensAccessToken());
  return (
    <section
      data-slot="onboarding-setup"
      aria-labelledby={titleId}
      className={cn("min-w-0 scroll-mt-4 outline-none", className)}
      {...props}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id={titleId} className="text-2xl font-semibold tracking-tight">
            {t("onboarding.getLensRunning")}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("onboarding.eachStepChecksConnection")}</p>
        </div>
        {action}
      </div>
      <SetupAgentPrompt connection={connection.data} />
      <OnboardingSteps state={state} includeTracing={includeTracing} />
      {state.error && connection.data?.configured !== false && (
        <div role="alert" className="mt-4 flex flex-wrap items-center gap-3 text-sm text-destructive">
          <p>{t("onboarding.couldCheckSetupValue0", { value0: state.error })}</p>
          <Button variant="outline" size="sm" onClick={state.refresh} disabled={state.checking}>
            {t("investigations.retry")}</Button>
        </div>
      )}
      {(readOnly || !canInvestigate) && (
        <p className="mt-4 text-sm text-muted-foreground">
          {t("onboarding.administratorConfigureAnalysisRun")}</p>
      )}
    </section>
  );
}
