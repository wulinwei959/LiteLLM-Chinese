"use client";

import { Activity, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "../../ui/button";
import { useConnectProjectRoute } from "../route";
import { useLensTranslate } from "../../../host/useLensTranslate";

export function WaitingForTraces({
  onConnect,
  onCheck,
  checking,
  detail,
}: {
  readonly onConnect?: () => void;
  readonly onCheck: () => void;
  readonly checking: boolean;
  readonly detail?: string | null;
}) {
  const t = useLensTranslate();
  const [project] = useConnectProjectRoute();
  return (
    <section
      aria-label={t("onboarding.waitingTraces")}
      className="my-5 flex flex-col items-center rounded-xl border bg-muted/20 px-5 py-12 sm:py-16"
    >
      <div className="w-full max-w-xl">
        <span
          role="status"
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white dark:bg-indigo-500"
        >
          <Activity aria-hidden className="size-3.5" />
          {t("onboarding.waitingTraces")}</span>
        <h2 className="mt-5 text-xl font-semibold tracking-tight">
          {project ? t("onboarding.firstTraceAppear") : t("onboarding.connectProjectSeeTraces")}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {project ? (
            <>
              {t("onboarding.continueSetup")}<span className="break-all font-medium text-foreground">{project.name}</span> {t("onboarding.homeLensChecksConnection")}</>
          ) : (
            t("onboarding.homeWalksThroughSetup")
          )}
        </p>
        {onConnect && (
          <Button className="mt-6" onClick={onConnect}>
            {project ? t("onboarding.continueSetup2") : t("agents.connectProject")}
            <ArrowRight aria-hidden className="size-4" />
          </Button>
        )}
        {detail && (
          <p role="alert" className="mt-4 text-sm text-muted-foreground">
            {t("onboarding.traceStorageConfiguredYet")}</p>
        )}
        <div className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={checking}
            onClick={onCheck}
            className="px-0 text-xs text-muted-foreground"
          >
            <RefreshCw aria-hidden className="size-3.5" />
            {checking ? t("onboarding.checking") : t("onboarding.checkTraces")}
          </Button>
        </div>
      </div>
    </section>
  );
}
