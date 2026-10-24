"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../../ui/button";
import { useLensApi } from "../../data/LensServices";
import { lensQueries } from "../../data/queries";
import { useWorkerConnected } from "../../hooks/useWorkerConnected";
import type { LensList } from "../../model/types";
import { SettingsCard } from "../SettingsSection";
import { SetupAgentPrompt } from "../../onboarding/SetupAgentPrompt";
import { useLensTranslate } from "../../../../host/useLensTranslate";

const CONFIGURATION_GUIDE = "https://github.com/BerriAI/lens/blob/main/docs/analysis.md";

export function DeploymentAnalysis({
  workers,
  readyAction,
}: {
  workers: LensList["workers"];
  readyAction?: ReactNode;
}) {
  const t = useLensTranslate();
  const api = useLensApi();
  const models = useQuery(lensQueries.modelDetails(api));
  const list = useQuery(lensQueries.list(api));
  const connected = useWorkerConnected(list.data?.workers ?? workers);
  const configured = models.data?.data.filter((model) => model.mode !== "evaluation") ?? [];
  const refresh = () => {
    void models.refetch();
    void list.refetch();
  };
  return (
    <SettingsCard className="space-y-4">
      <SetupAgentPrompt goal="analysis" featureConfigured={models.isSuccess ? configured.length > 0 : undefined} />
      {models.isPending ? (
        <p role="status" className="text-sm text-muted-foreground">
          {t("settings.checkingAnalysisModels")}</p>
      ) : models.isError || list.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {t("settings.couldCheckAnalysisConfiguration", { value0: models.error?.message ?? list.error?.message })}</p>
      ) : configured.length === 0 ? (
        <div className="space-y-2">
          <h3 className="font-semibold">{t("settings.addAnalysisProvider")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("settings.configureModelProviderKey")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p role="status" className="text-sm">
            {connected ? t("settings.analysisConfigured") : t("settings.modelsConfiguredWaitingInvestigation")}
          </p>
          <ul aria-label={t("settings.analysisModels")} className="space-y-1.5 font-mono text-xs">
            {configured.map((model) => (
              <li key={model.model_group} className="rounded-md border bg-background px-3 py-2">
                <span className="font-medium text-[var(--lens-brand)]">{model.model_group}</span>
                <span className="text-muted-foreground"> · {model.providers.join(", ")}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            {t("settings.investigationsSendSelectedTrace")}</p>
          {!connected && (
            <p className="text-sm text-muted-foreground">
              {t("settings.checkLensServiceLogs")}</p>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={CONFIGURATION_GUIDE}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline underline-offset-4"
        >
          {t("settings.configureAnalysisModels")}</a>
        <Button variant="outline" size="sm" onClick={refresh} disabled={models.isFetching || list.isFetching}>
          {t("agents.checkConfiguration")}</Button>
      </div>
      {connected && configured.length > 0 && !models.isError && !list.isError && readyAction}
    </SettingsCard>
  );
}
