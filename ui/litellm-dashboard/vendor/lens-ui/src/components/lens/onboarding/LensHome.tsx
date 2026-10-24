"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../ui/button";
import type { LensAgents } from "../agents/AgentScoped";
import { useLensAccessToken } from "../data/LensServices";
import { useConnectProjectRoute } from "../route";
import { useOnboarding } from "./OnboardingContext";
import { HomeConnectionStatus } from "./HomeConnectionStatus";
import { SetupAgentPrompt } from "./SetupAgentPrompt";
import {
  CodeBlock,
  maskSecret,
  TracingKey,
  useLensService,
} from "./tracing/TracingSetupCard";
import { useLensTranslate } from "../../../host/useLensTranslate";

const shellValue = (value: string) => `'${value.replaceAll("'", "'\\''")}'`;

export function LensHome({
  agents,
  enabled,
  onOpenAgent,
  onOpenAgents,
  onSetup,
  onConnectGitHub,
}: {
  readonly agents: LensAgents;
  readonly enabled: boolean;
  readonly onOpenAgent: (name: string) => void;
  readonly onOpenAgents: () => void;
  readonly onSetup?: () => void;
  readonly onConnectGitHub?: (name: string) => void;
}) {
  const t = useLensTranslate();
  const [project] = useConnectProjectRoute();
  const [discoverAfter] = useState(Date.now);
  const accessToken = useLensAccessToken();
  const connection = useLensService(accessToken, { enabled });
  const { canMintTracingKey, readOnly } = useOnboarding();
  const [tracingKey, setTracingKey] = useState<string | null>(null);
  const [keyReady, setKeyReady] = useState<boolean | null>(null);
  const traceUrl = connection.data?.url?.replace(/\/$/, "") ?? "";
  const ready = Boolean(
    connection.data?.connected &&
      connection.data.status.storage_ready &&
      traceUrl,
  );
  const environment = (key: string | null) =>
    `export LITELLM_TRACING_KEY=${shellValue(key ?? t("onboarding.yourTracingKey"))}\nexport OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=${shellValue(`${traceUrl}/v1/traces`)}\nexport OTEL_EXPORTER_OTLP_TRACES_HEADERS="Authorization=Bearer $LITELLM_TRACING_KEY"\nexport OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"`;

  return (
    <section
      aria-label={t("onboarding.getStartedLens")}
      className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-xl font-medium tracking-tight">
            {t("onboarding.getFirstTrace")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("onboarding.letCodingAgentConnect")}</p>
        </div>
        {agents.list.agents.length > 0 && (
          <Button variant="outline" size="sm" onClick={onOpenAgents}>
            {t("onboarding.viewAgents")}<ArrowRight aria-hidden className="size-3.5" />
          </Button>
        )}
      </div>
      {!enabled ? (
        <p className="text-sm text-muted-foreground">
          {t("onboarding.turnOffDemoData")}</p>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0 space-y-5">
            <SetupAgentPrompt
              goal="tracing"
              connection={connection.data}
              agentName={project?.name}
              prominent
            />
            <details
              className="rounded-md border bg-card px-5 py-4"
              id="tracing-key"
            >
              <summary className="cursor-pointer text-sm font-medium">
                {t("onboarding.tracingKey")}</summary>
              <div className="mt-4 space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {t("onboarding.codingAgentUseKey")}<code>LITELLM_TRACING_KEY</code>{t("onboarding.keepOutPrompt")}</p>
                {ready && canMintTracingKey && !readOnly ? (
                  <TracingKey
                    accessToken={accessToken}
                    tracingKey={tracingKey}
                    compact
                    name={project?.name ?? t("onboarding.agentTracing")}
                    onCreated={(key, active) => {
                      setTracingKey(key);
                      setKeyReady(active);
                    }}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {!canMintTracingKey || readOnly
                      ? t("onboarding.askLensAdministratorTracing")
                      : t("onboarding.workingLensConnectionTrace")}
                  </p>
                )}
              </div>
            </details>
            {ready && (
              <details className="rounded-md border bg-card px-5 py-4">
                <summary className="cursor-pointer text-sm font-medium">
                  {t("onboarding.setUpManually")}</summary>
                <p className="my-4 text-sm leading-6 text-muted-foreground">
                  {t("onboarding.addVariablesProjectLoads")}</p>
                <CodeBlock
                  code={environment(tracingKey)}
                  display={environment(tracingKey && maskSecret(tracingKey))}
                  copyLabel={t("onboarding.copyProjectEnvironment")}
                  wrap
                />
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {t("onboarding.agentRunsAnotherHost")}{" "}
                  <code>LITELLM_TRACE_ENDPOINT</code> {t("onboarding.hTTPSURLEnding")}<code>/v1/traces</code> {t("onboarding.saveKey")}{" "}
                  <code>LITELLM_TRACE_API_KEY</code>{t("onboarding.tracingExporterBuilt")}</p>
              </details>
            )}
          </div>
          <HomeConnectionStatus
            name={project?.name ?? ""}
            discoverAfter={discoverAfter}
            enabled={enabled}
            keyReady={keyReady}
            onOpenTraces={onOpenAgent}
            onSetup={onSetup}
            onConnectGitHub={onConnectGitHub}
          />
        </div>
      )}
      {onSetup && (
        <Button
          variant="link"
          size="sm"
          className="mt-6 px-0 text-xs text-muted-foreground"
          onClick={onSetup}
        >
          {t("onboarding.deploymentSetup")}</Button>
      )}
    </section>
  );
}
