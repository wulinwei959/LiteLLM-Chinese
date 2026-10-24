"use client";

import { type ReactNode } from "react";
import { Activity, ArrowUpRight, Cpu } from "lucide-react";
import { Button } from "../../ui/button";
import { StatusDot } from "../../shared/StatusDot";
import { SignalSettings } from "./signals/SignalSettings";
import { SettingsCard, SettingsSection } from "./SettingsSection";
import type { LensList } from "../model/types";
import { STANDALONE_DOCS_URL, useLensHost } from "../../../host/LensHost";
import { DeploymentAnalysis } from "./worker/DeploymentAnalysis";
import { LensPageHeader } from "../ui/LensPageHeader";
import { useLensTranslate } from "../../../host/useLensTranslate";

const TRACING_DOCS = "https://docs.litellm.ai/docs/proxy/lens";

function TracingSection({
  enabled,
  onConnectProject,
}: {
  enabled: boolean;
  onConnectProject?: () => void;
}) {
  const t = useLensTranslate();
  const standalone = useLensHost().surface === "standalone";
  return (
    <SettingsSection
      heading={t("onboarding.tracing")}
      icon={<Activity aria-hidden="true" className="size-4" />}
      description={t("settings.agentsSendRunsLens")}
    >
      <SettingsCard className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm">
          <span
            role="status"
            className="inline-flex items-center gap-2 font-mono text-xs"
          >
            <StatusDot state={enabled ? "ok" : "off"} />
            {enabled ? t("onboarding.tracingEnabled2") : t("onboarding.tracingEnabled")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={standalone ? STANDALONE_DOCS_URL : TRACING_DOCS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("onboarding.docs")}<ArrowUpRight aria-hidden="true" className="size-3" />
          </a>
          <Button
            variant="outline"
            size="sm"
            onClick={onConnectProject}
            disabled={!onConnectProject}
          >
            {t("agents.connectProject")}</Button>
        </div>
      </SettingsCard>
    </SettingsSection>
  );
}

export function LensSettings({
  list,
  workerReadyAction,
  onConnectProject,
}: {
  list: LensList;
  workerReadyAction?: ReactNode;
  onConnectProject?: () => void;
}) {
  const t = useLensTranslate();
  return (
    <div aria-label={t("tabs.settings")} role="region" className="flex w-full flex-col">
      <LensPageHeader
        section={t("settings.07CONFIGURATION")}
        title={t("tabs.settings")}
        description={t("settings.wireUpAgentsTune")}
      />
      <div className="mx-auto w-full max-w-6xl divide-y divide-border px-4 py-5 sm:px-6">
        <TracingSection
          enabled={list.tracing_enabled}
          onConnectProject={onConnectProject}
        />
        <SignalSettings />
        <SettingsSection
          heading={t("settings.analysis")}
          icon={<Cpu aria-hidden="true" className="size-4" />}
          description={t("settings.lensRunsInvestigationsUsing")}
        >
          <DeploymentAnalysis
            workers={list.workers}
            readyAction={workerReadyAction}
          />
        </SettingsSection>
      </div>
    </div>
  );
}
