import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NextCheck } from "./LensProgress";
import { DurationInput } from "./DurationInput";
import { lensStatus, runTime, scopeLabel, type Lens, type Settings, type Job } from "./lensData";

export function InvestigationList({
  lenses,
  connected,
  onSelect,
}: {
  lenses: Lens[];
  connected: boolean;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations("lens");
  const commonT = useTranslations("common");
  const [search, setSearch] = useState("");
  const shown = lenses.filter((lens) =>
    `${lens.settings.name} ${scopeLabel(lens.settings, t)}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <section aria-label={t("savedInvestigations")} className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          aria-label={t("searchInvestigations")}
          placeholder={t("searchInvestigations")}
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="divide-y border-y">
        {shown.map((lens) => (
          <button
            key={lens.id}
            onClick={() => onSelect(lens.id)}
            className="group grid w-full grid-cols-[minmax(0,1fr)_16px] items-center gap-x-4 gap-y-2 py-4 text-left hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-ring sm:grid-cols-[minmax(0,1fr)_auto_16px]"
          >
            <div className="col-start-1 row-start-1 min-w-0">
              <p className="text-sm font-medium">{lens.settings.name}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{scopeLabel(lens.settings, t)}</p>
            </div>
            <div className="col-start-1 row-start-2 text-xs sm:col-start-2 sm:row-start-1 sm:text-right">
              <p className={lens.jobs[0]?.status === "failed" ? "text-destructive" : "text-muted-foreground"}>
                {lensStatus(lens, connected, t, commonT)}
              </p>
              <p className="mt-1 text-muted-foreground">
                {lens.jobs[0] ? runTime(lens.jobs[0].created_at) : t("notRunYet")}
              </p>
            </div>
            <ChevronRight className="col-start-2 row-start-1 size-4 text-muted-foreground sm:col-start-3" />
          </button>
        ))}
        {!shown.length && <p className="py-8 text-sm text-muted-foreground">{t("noInvestigationsMatch")}</p>}
      </div>
    </section>
  );
}

export function InvestigationExample({ onClose }: { onClose: () => void }) {
  const t = useTranslations("lens");
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90dvh] overflow-y-auto gap-0 p-0">
        <div className="px-6 py-5 sm:px-8">
          <DialogHeader>
            <DialogTitle className="text-base">{t("exampleInvestigation")}</DialogTitle>
            <DialogDescription>{t("exampleQuestion")}</DialogDescription>
          </DialogHeader>
        </div>
        <div className="border-y px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              {t("needsAttention")}
            </span>
            <span className="text-muted-foreground">{t("exampleConversations")}</span>
          </div>
          <h3 className="mt-4 max-w-lg text-2xl font-semibold leading-8 tracking-tight">{t("exampleFindingTitle")}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("exampleFindingDesc")}</p>
          <div className="mt-6 border-l-2 border-border pl-4">
            <p className="text-xs text-muted-foreground">{t("exampleReplies")}</p>
            <blockquote className="mt-2 text-base leading-6">{t("exampleQuote")}</blockquote>
            <details className="group mt-3 text-sm">
              <summary className="flex w-fit cursor-pointer list-none items-center gap-1.5 font-medium [&::-webkit-details-marker]:hidden">
                {t("seeTheTrace")} <ChevronRight className="size-3.5 transition-transform group-open:rotate-90" />
              </summary>
              <ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">{t("customer")}</span> · {t("whereIsMyOrder")}
                </li>
                <li>
                  <span className="font-medium text-foreground">{t("orderLookup")}</span> · {t("serviceUnavailable")}
                </li>
                <li>
                  <span className="font-medium text-foreground">{t("twoRetries")}</span> · {t("sameErrorNoInfo")}
                </li>
                <li>
                  <span className="font-medium text-foreground">{t("agent")}</span> · {t("exampleEnds")}
                </li>
              </ol>
            </details>
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-semibold">{t("whatToChange")}</h4>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("whatToChangeDesc")}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 px-6 py-4 sm:px-8">
          <p className="text-xs text-muted-foreground">{t("illustrativeData")}</p>
          <Button variant="outline" onClick={onClose}>
            {t("backToSetup")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MonitoringSetup({
  settings,
  ready,
  onSave,
  onClose,
}: {
  settings: Settings;
  ready: boolean;
  onSave: (settings: Settings) => Promise<void>;
  onClose: () => void;
}) {
  const t = useTranslations("lens");
  const commonT = useTranslations("common");
  const [interval, setInterval] = useState(settings.interval_minutes ?? 30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const save = async () => {
    setBusy(true);
    try {
      await onSave({ ...settings, enabled: true, interval_minutes: interval });
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("couldNotEnableMonitoring"));
    } finally {
      setBusy(false);
    }
  };
  const validInterval = Number.isInteger(interval) && interval >= 1 && interval <= 10080;
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("keepMonitoring")}</DialogTitle>
          <DialogDescription>{t("keepMonitoringDesc")}</DialogDescription>
        </DialogHeader>
        <DurationInput label={t("checkEvery")} value={interval} onChange={setInterval} base="minutes" max={10080} />
        <p className="text-xs leading-5 text-muted-foreground">{t("keepMonitoringHelp")}</p>
        {!ready && (
          <p role="status" className="text-sm text-amber-700">
            {t("reconnectWorkerMonitoring")}
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {commonT("cancel")}
          </Button>
          <Button disabled={busy || !ready || !validInterval} onClick={() => void save()}>
            {busy ? t("saving") : t("enableMonitoring")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function InvestigationSummary({ lens, connected }: { lens: Lens; connected: boolean }) {
  const t = useTranslations("lens");
  const commonT = useTranslations("common");
  const lastCompleted = lens.jobs.find((job) => job.status === "completed");
  const lastSuccess = lastCompleted?.finished_at ?? lens.last_scan_at;
  const spent = lens.budget_month === new Date().toISOString().slice(0, 7) ? lens.spent ?? 0 : 0;
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3 border-y py-3 text-xs text-muted-foreground">
      <span>
        {t("latestRunLabel")}
        <strong className={`font-medium ${lens.jobs[0]?.status === "failed" ? "text-destructive" : "text-foreground"}`}>
          {lensStatus(lens, connected, t, commonT)}
        </strong>
      </span>
      <span>
        {t("lastSuccess")} <span className="text-foreground">{lastSuccess ? runTime(lastSuccess) : t("notYet")}</span>
      </span>
      <span>
        {t("thisMonth")}
        <span className="text-foreground">
          ${spent.toFixed(3)} / ${lens.settings.monthly_budget ?? 100}
        </span>
      </span>
      {lens.settings.enabled && (
        <span>
          {t("monitoringEvery", { minutes: lens.settings.interval_minutes })}
          <NextCheck lens={lens} />
        </span>
      )}
    </div>
  );
}

export function InvestigationFailure({ job, connected }: { job: Job; connected: boolean }) {
  const t = useTranslations("lens");
  return (
    <div role="alert" className="space-y-2 rounded-md border border-destructive/20 p-3 text-sm">
      <p className="font-medium text-destructive">{t("investigationDidNotFinish")}</p>
      <p>{job.error}</p>
      <details>
        <summary className="cursor-pointer text-xs text-muted-foreground">{t("troubleshootingDetails")}</summary>
        <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
          <div>
            <dt className="inline">{t("runColon")}</dt>
            <dd className="inline">{job.id}</dd>
          </div>
          <div>
            <dt className="inline">{t("modelColon")}</dt>
            <dd className="inline">{job.settings.model}</dd>
          </div>
          <div>
            <dt className="inline">{t("workerColon")}</dt>
            <dd className="inline">{connected ? t("connectedNow") : t("notConnected")}</dd>
          </div>
          <div>
            <dt className="inline">{t("startedColon")}</dt>
            <dd className="inline">{runTime(job.created_at)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-muted-foreground">{t("troubleshootingHelp")}</p>
      </details>
    </div>
  );
}
