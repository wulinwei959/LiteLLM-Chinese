import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { LensTranslator } from "@/lib/i18n/translators";
import { uiHref } from "@/utils/uiHref";

export function LensWelcome({
  tracesReady,
  requestsReady = false,
  checking,
  traceError,
  connected,
  readOnly,
  onConnect,
  onCreate,
  onRetry,
  onExample,
}: {
  tracesReady: boolean;
  requestsReady?: boolean;
  checking: boolean;
  traceError?: string;
  connected: boolean;
  readOnly: boolean;
  onConnect: () => void;
  onCreate: () => void;
  onRetry: () => void;
  onExample: () => void;
}) {
  const activityReady = tracesReady || requestsReady;
  const workerReady = activityReady && connected;
  const canCreate = workerReady && !readOnly;
  const canConnect = activityReady && !readOnly;
  const t = useTranslations("lens");
  const commonT = useTranslations("common");
  const traceStatus = activityStatus(tracesReady, requestsReady, checking, t);
  const waitingForWorker = activityReady && !connected;
  const pendingClass = activityReady ? "" : "text-muted-foreground";
  const firstStepTitle = requestsReady && !tracesReady ? t("recordedActivity") : t("setUpTraces");
  const traceButtonClass = buttonVariants({
    variant: activityReady ? "ghost" : "default",
    className: "col-start-2 w-fit sm:col-start-auto",
  });
  return (
    <section aria-labelledby="lens-welcome" className="max-w-3xl py-4 sm:py-6">
      <h2 id="lens-welcome" className="text-xl font-semibold tracking-tight">
        {t("findWhatNeedsAttention")}
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">{t("welcomeDesc")}</p>
      <Button variant="link" className="mt-3 h-auto px-0 text-sm" onClick={onExample}>
        {t("viewAnExample")} <ArrowRight className="size-3.5" />
      </Button>
      <ol className="mt-8 divide-y border-y">
        <li className="grid grid-cols-[28px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 py-5 sm:grid-cols-[28px_minmax(0,1fr)_auto]">
          <Step number={1} complete={activityReady} checking={checking} active={!activityReady} />
          <div>
            <h3 className="text-sm font-medium">{firstStepTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{traceStatus}</p>
          </div>
          <Link href={uiHref("lens/?tab=traces")} className={traceButtonClass}>
            {tracesReady ? t("viewTraces") : t("setUpTraces")}
          </Link>
        </li>
        <li
          className={`grid grid-cols-[28px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 py-5 sm:grid-cols-[28px_minmax(0,1fr)_auto] ${pendingClass}`}
        >
          <Step number={2} complete={workerReady} active={waitingForWorker} />
          <div>
            <h3 className="text-sm font-medium">{t("connectAWorker")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {workerReady ? t("workerConnected") : t("runsInBackground")}
            </p>
          </div>
          <Button
            className="col-start-2 w-fit sm:col-start-auto"
            variant={waitingForWorker ? "default" : "ghost"}
            disabled={!canConnect}
            onClick={onConnect}
          >
            {connected ? t("manageWorker") : t("connectWorker")}
          </Button>
        </li>
        <li
          className={`grid grid-cols-[28px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 py-5 sm:grid-cols-[28px_minmax(0,1fr)_auto] ${!workerReady ? "text-muted-foreground" : ""}`}
        >
          <Step number={3} complete={false} active={workerReady} />
          <div>
            <h3 className="text-sm font-medium">{t("runAnInvestigation")}</h3>
          </div>
          <Button
            className="col-start-2 w-fit sm:col-start-auto"
            variant={workerReady ? "default" : "ghost"}
            disabled={!canCreate}
            onClick={onCreate}
          >
            {t("newInvestigation")}
          </Button>
        </li>
      </ol>
      {traceError && (
        <div role="alert" className="mt-6 text-sm text-destructive">
          {t("couldNotCheckActivity", { error: traceError })}{" "}
          <Button variant="link" onClick={onRetry}>
            {commonT("retry")}
          </Button>
        </div>
      )}
      {readOnly && <p className="mt-6 text-sm text-muted-foreground">{t("adminCanFinish")}</p>}
    </section>
  );
}

function Step({
  number,
  complete,
  checking = false,
  active = false,
}: {
  number: number;
  complete: boolean;
  checking?: boolean;
  active?: boolean;
}) {
  const t = useTranslations("lens");
  const incomplete = checking ? <Loader2 className="size-4 animate-spin" /> : number;
  const unfinishedStyle = active ? "bg-foreground text-background" : "border text-muted-foreground";
  return (
    <span
      className={`flex size-7 items-center justify-center rounded-full text-xs font-medium ${complete ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : unfinishedStyle}`}
      aria-label={complete ? t("stepCompleteAria", { number }) : t("stepAria", { number })}
    >
      {complete ? <Check className="size-4" /> : incomplete}
    </span>
  );
}

function activityStatus(traces: boolean, requests: boolean, checking: boolean, t: LensTranslator) {
  if (traces) return t("tracesReceived");
  if (requests) return t("requestLogsReceived");
  return checking ? t("checkingForActivity") : t("connectAgentSendTrace");
}
