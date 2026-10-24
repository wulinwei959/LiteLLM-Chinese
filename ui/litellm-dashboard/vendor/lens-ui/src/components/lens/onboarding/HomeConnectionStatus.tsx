"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Activity, ArrowRight, Check, ChevronDown, Circle, Github, RefreshCw } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/cva.config";
import { useAgentConnectionStatus } from "../agents/useAgentConnectionStatus";
import { useLensAccessToken } from "../data/LensServices";
import { useLensService } from "./tracing/TracingSetupCard";
import { connectionAuthStatus } from "./connectionErrors";
import { useLensTranslate } from "../../../host/useLensTranslate";

interface HomeConnectionStatusProps {
  readonly name: string;
  readonly enabled: boolean;
  readonly onOpenTraces: (name: string) => void;
  readonly onSetup?: () => void;
  readonly onConnectGitHub?: (name: string) => void;
  readonly keyReady?: boolean | null;
  readonly stage?: "name" | "key" | "instructions" | "verify";
  readonly setupIssue?: string | null;
  readonly discoverAfter?: number;
}

export function HomeConnectionStatus({
  name,
  enabled,
  onOpenTraces,
  onSetup,
  onConnectGitHub,
  keyReady,
  stage = "instructions",
  setupIssue,
  discoverAfter,
}: HomeConnectionStatusProps) {
  const t = useLensTranslate();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsId = useId();
  const verificationHeading = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef(stage);
  useEffect(() => {
    if (stage === "verify" && previousStage.current !== "verify") verificationHeading.current?.focus();
    previousStage.current = stage;
  }, [stage]);
  const desktop = useMediaQuery("(min-width: 1024px)", {
    initializeWithValue: false,
  });
  const token = useLensAccessToken();
  const service = useLensService(token, { enabled, refetchInterval: 3000 });
  const agentName = name.trim();
  const discovering = !agentName && Number.isFinite(discoverAfter);
  const receipt = useAgentConnectionStatus(agentName, enabled, discoverAfter);
  const matchedAgentName = receipt.match?.name ?? agentName;
  const authStatus = connectionAuthStatus(service.error) ?? connectionAuthStatus(receipt.error);
  const unavailable = Boolean(service.error || receipt.error);
  const apiReady = service.data?.connected ?? null;
  const storageReady = apiReady ? service.data?.status.storage_ready ?? null : null;
  const credentialsPending = service.data?.status.credentials_ready === false;
  const endpointMissing = Boolean(service.data && !service.data.url);
  const blocked =
    apiReady === false || storageReady === false || credentialsPending || endpointMissing || Boolean(setupIssue);
  const receiving = !unavailable && !blocked && receipt.status === "receiving";
  const discovered = discovering && Boolean(receipt.match) && !unavailable && !blocked;
  const verifying = !discovering && stage === "verify";
  const checking = service.isFetching || receipt.isChecking;
  const title =
    authStatus === 401
      ? t("onboarding.signAgain")
      : authStatus === 403
        ? t("onboarding.accessRequired")
        : unavailable
          ? t("onboarding.unableCheck")
          : blocked
            ? t("onboarding.connectionNeedsAttention")
            : discovered
              ? t("onboarding.newTraceReceived")
              : receiving
                ? t("onboarding.receivingTraces")
                : receipt.status === "waiting-for-new-traces"
                  ? t("onboarding.waitingNewTraces")
                  : t("onboarding.waitingTraces");
  const guidance =
    authStatus === 401
      ? t("onboarding.sessionLongerValidSign")
      : authStatus === 403
        ? t("onboarding.accountCannotCheckConnection")
        : unavailable
          ? t("onboarding.weCouldnTCheck")
          : apiReady === false
            ? t("onboarding.lensUnavailableCheckService")
            : storageReady === false
              ? t("onboarding.traceStorageIsnT")
              : endpointMissing
                ? t("onboarding.setPublicLensAddress")
                : credentialsPending
                  ? t("onboarding.lensSyncingTracingCredentials")
                  : setupIssue
                    ? setupIssue
                    : discovered
                      ? t("onboarding.traceArrivedValue0Coding", { value0: matchedAgentName })
                      : receiving
                        ? t("onboarding.recentRunVisibleLens")
                        : discovering
                          ? t("onboarding.lensWatchingNewNamed")
                          : stage === "name" || !agentName
                            ? t("onboarding.chooseProjectAgentName")
                            : stage === "key"
                              ? t("onboarding.getTracingKeyConnect")
                              : verifying
                                ? t("onboarding.runAgentOnceLens")
                                : t("onboarding.codingAgentRunOne");

  return (
    <section
      aria-label={t("onboarding.liveConnection")}
      className={cn(
        "min-w-0",
        verifying
          ? "overflow-hidden rounded-md border bg-card lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:grid lg:grid-cols-[minmax(0,1fr)_300px]"
          : "lg:col-start-2 lg:row-start-1 lg:border-l",
      )}
    >
      <div className={cn(verifying ? "p-5 sm:p-6" : "py-4 lg:px-5")}>
        <div className={cn("items-center justify-between gap-3", verifying ? "flex" : "hidden lg:flex")}>
          <h3 className="text-sm font-medium">{t("onboarding.liveConnection")}</h3>
          {enabled && (agentName || discovering) && !authStatus && (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-current motion-safe:animate-pulse" aria-hidden="true" />
              {t("onboarding.checkingEvery3s")}</span>
          )}
        </div>
        {verifying && (
          <h3 ref={verificationHeading} tabIndex={-1} className="mt-3 text-base font-medium outline-none">
            {unavailable || blocked ? t("onboarding.checkConnection") : receiving ? t("onboarding.tracesReceived") : t("onboarding.runOneTask")}
          </h3>
        )}
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium",
            verifying ? "mt-4" : "lg:mt-4",
            receiving || discovered
              ? "bg-success/10 text-success"
              : unavailable || blocked
                ? "bg-warning/10 text-warning"
                : verifying
                  ? "bg-indigo-600 text-white dark:bg-indigo-500"
                  : "bg-muted text-muted-foreground",
          )}
          role="status"
          aria-live="polite"
        >
          <Activity aria-hidden="true" className="size-4 shrink-0 motion-safe:animate-pulse" />
          <p>{title}</p>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted-foreground lg:text-sm lg:leading-6">{guidance}</p>
        {(receipt.match || !desktop || unavailable || (blocked && onSetup)) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {receipt.match && !authStatus && (
              <Button size="sm" onClick={() => onOpenTraces(matchedAgentName)}>
                {t("onboarding.viewTraces")}<ArrowRight className="size-3.5" aria-hidden="true" />
              </Button>
            )}
            {(receiving || discovered) && onConnectGitHub && (
              <Button size="sm" variant="outline" onClick={() => onConnectGitHub(matchedAgentName)}>
                <Github className="size-3.5" aria-hidden="true" /> {t("workspace.connectGitHub")}</Button>
            )}
            {authStatus === 401 && (
              <Button size="sm" onClick={() => window.location.reload()}>
                {t("onboarding.reloadSign")}</Button>
            )}
            {unavailable && !authStatus && (
              <Button
                size="sm"
                variant="outline"
                disabled={checking}
                onClick={() => {
                  void service.refetch();
                  receipt.refresh();
                }}
              >
                {t("onboarding.retryConnection")}</Button>
            )}
            {!desktop && (
              <Button
                size="sm"
                variant="ghost"
                className="px-0 text-xs text-muted-foreground"
                aria-expanded={detailsOpen}
                aria-controls={detailsId}
                onClick={() => setDetailsOpen((open) => !open)}
              >
                {t("onboarding.connectionDetails")}<ChevronDown aria-hidden="true" className={cn("size-3.5", detailsOpen && "rotate-180")} />
              </Button>
            )}
            {blocked && onSetup && (
              <Button variant="link" size="sm" className="px-0 text-xs" onClick={onSetup}>
                {t("onboarding.deploymentSetup")}</Button>
            )}
          </div>
        )}
      </div>
      <div
        id={detailsId}
        hidden={!desktop && !detailsOpen}
        className={cn("space-y-5 border-t", verifying ? "p-5 lg:border-t-0 lg:border-l lg:bg-muted/10" : "py-4 lg:p-5")}
      >
        <dl className="space-y-3 text-sm">
          <ConnectionCheck
            label={t("onboarding.lensAPI")}
            ready={service.error ? false : apiReady}
            success={t("onboarding.reachable")}
            failure={t("onboarding.unavailable")}
          />
          <ConnectionCheck label={t("onboarding.traceStorage")} ready={storageReady} success={t("model.ready")} failure={t("onboarding.ready")} />
          {keyReady !== undefined && keyReady !== null && (
            <ConnectionCheck
              label={t("onboarding.tracingKey")}
              ready={keyReady}
              success={t("onboarding.readyUse")}
              failure={t("onboarding.activationUnconfirmed")}
            />
          )}
        </dl>
        <div>
          <p className="text-xs text-muted-foreground">{discovered ? t("onboarding.detectedAgent") : t("onboarding.watchingAgent")}</p>
          <p className="mt-1 font-mono text-xs break-all">
            {matchedAgentName || (discovering ? t("onboarding.newNamedTraces") : t("onboarding.nameAgentBegin"))}
          </p>
          {receipt.match && (
            <dl className="mt-3 space-y-2 border-t pt-3 text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">
                  {discovering ? t("onboarding.runsSinceSetupOpened") : t("onboarding.runsLast14Days")}
                </dt>
                <dd className="font-medium tabular-nums">{receipt.match.runs.toLocaleString()}</dd>
              </div>
              <div className="flex flex-wrap justify-between gap-1">
                <dt className="text-muted-foreground">{t("onboarding.lastRunStarted")}</dt>
                <dd className="font-medium">{new Date(receipt.match.last_seen).toLocaleString()}</dd>
              </div>
            </dl>
          )}
        </div>
        {verifying && !receiving && agentName && !unavailable && !blocked && (
          <p className="text-xs leading-5 text-muted-foreground">
            {t("onboarding.nothingArrivingCheckEndpoint")}{" "}
            <span className="font-medium text-foreground">{agentName}</span>.
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={checking || !enabled}
            onClick={() => {
              void service.refetch();
              receipt.refresh();
            }}
          >
            <RefreshCw aria-hidden="true" className={cn("size-3.5", checking && "motion-safe:animate-spin")} />
            {checking ? t("onboarding.checking") : t("onboarding.checkConnection2")}
          </Button>
        </div>
        {receipt.lastChecked !== null && (
          <p className="font-mono text-[11px] text-muted-foreground">
            {t("onboarding.lastCheckedValue0", { value0: new Date(receipt.lastChecked).toLocaleTimeString() })}</p>
        )}
      </div>
    </section>
  );
}

function ConnectionCheck({
  label,
  ready,
  success,
  failure,
}: {
  readonly label: string;
  readonly ready: boolean | null;
  readonly success: string;
  readonly failure: string;
}) {
  const t = useLensTranslate();
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "flex items-center gap-1.5 text-xs font-medium",
          ready ? "text-success" : "text-muted-foreground",
        )}
      >
        {ready ? <Check aria-hidden="true" className="size-3.5" /> : <Circle aria-hidden="true" className="size-2" />}
        {ready === null ? t("onboarding.checking3") : ready ? success : failure}
      </dd>
    </div>
  );
}
