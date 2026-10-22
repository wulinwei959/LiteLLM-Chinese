"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import type { TelemetryTranslator } from "@/lib/i18n/translators";
import { Switch } from "@/components/ui/switch";
import { FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Activity } from "lucide-react";
import { Page, PageTabs, PageTabsContent, PageTabsList, PageTabsTrigger } from "@/components/shared/Page";
import { PageHeader, PageHeaderControls, PageHeaderDescription, PageHeaderTitle } from "@/components/shared/PageHeader";
import { useUrlTab } from "@/hooks/useUrlTab";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import {
  type TelemetryDestination,
  type TelemetryGroup,
  type TelemetrySettings,
  useTelemetrySettings,
  useUpdateTelemetrySettings,
} from "@/app/(dashboard)/hooks/telemetry/useTelemetrySettings";
import { groupCopy, PROXY_GROUPS, UI_GROUPS, relativeDepths, toggleGroup, type Requires } from "./telemetryGroups";
import { TelemetryEnterpriseDialog } from "./TelemetryEnterpriseDialog";

const TABS = ["proxy", "ui"] as const;

const destinationText = (settings: TelemetrySettings, t: TelemetryTranslator): string => {
  const every = t("destination.every", { seconds: settings.flush_interval_seconds });
  switch (settings.destination) {
    case "http":
      return t("destination.http", { every });
    case "local_table":
      return t("destination.localTable", { every, days: settings.retention_days });
    case null:
      return t("destination.none");
  }
};

const destinationLabels = (t: TelemetryTranslator): Record<TelemetryDestination, string> => ({
  local_table: t("destination.localTableLabel"),
  http: t("destination.httpLabel"),
});

type SettingsUpdate = ReturnType<typeof useUpdateTelemetrySettings>;

const enabledGroups = (settings: TelemetrySettings): Set<TelemetryGroup> =>
  new Set(settings.groups.filter((info) => info.enabled).map((info) => info.group));

const isOn = (settings: TelemetrySettings): boolean => enabledGroups(settings).size > 0;

const savedDestination = (settings: TelemetrySettings): TelemetryDestination | null =>
  settings.destination_set_by_environment ? null : settings.stored_destination ?? null;

function DestinationPicker({
  settings,
  update,
  requestEnable,
}: {
  settings: TelemetrySettings;
  update: SettingsUpdate;
  requestEnable: () => void;
}) {
  const t = useTranslations("telemetry");
  const unchangeable = !settings.editable || settings.destination_set_by_environment;
  const locked = unchangeable || update.isPending || !isOn(settings);
  const missing = settings.destination === null && enabledGroups(settings).size > 0;
  return (
    <section className="space-y-2">
      <h3 className="font-medium">{t("title.destination")}</h3>
      {missing && <p className="text-xs text-destructive">{t("warning.noDestination")}</p>}
      <RadioGroup
        value={settings.destination ?? ""}
        disabled={locked}
        onValueChange={(value: unknown) =>
          settings.destination === null
            ? requestEnable()
            : update.mutate({ groups: [...enabledGroups(settings)], destination: value as TelemetryDestination })
        }
      >
        {(Object.keys(destinationLabels(t)) as TelemetryDestination[]).map((destination) => (
          <FieldLabel key={destination} className="text-xs font-normal">
            <RadioGroupItem
              value={destination}
              disabled={!settings.available_destinations.includes(destination)}
              aria-label={destinationLabels(t)[destination]}
            />
            {destinationLabels(t)[destination]}
          </FieldLabel>
        ))}
      </RadioGroup>
      {settings.destination_set_by_environment && (
        <p className="text-xs text-muted-foreground">{t("destination.setByEnv")}</p>
      )}
    </section>
  );
}

function GroupList({
  groups,
  settings,
  update,
  requestEnable,
}: {
  groups: readonly TelemetryGroup[];
  settings: TelemetrySettings;
  update: SettingsUpdate;
  requestEnable: () => void;
}) {
  const t = useTranslations("telemetry");
  const requires: Requires = new Map(settings.groups.map((info) => [info.group, info.requires ?? null]));
  const enabled = enabledGroups(settings);
  const depths = relativeDepths(groups, requires);
  const onToggle = (group: TelemetryGroup, on: boolean) => {
    if (on) {
      requestEnable();
      return;
    }
    update.mutate({ groups: [...toggleGroup(group, on, enabled, requires)], destination: savedDestination(settings) });
  };
  return (
    <ul className="divide-y rounded-md border">
      {groups.map((group) => {
        const copy = groupCopy(group, t);
        const locked = !settings.editable || update.isPending || !isOn(settings);
        const depth = depths.get(group) ?? 0;
        return (
          <li
            key={group}
            data-depth={depth}
            className="flex items-start gap-3 py-2 pr-3"
            style={{ paddingLeft: `${0.75 + depth * 1.5}rem` }}
          >
            <Switch
              size="sm"
              aria-label={copy.title}
              checked={enabled.has(group)}
              disabled={locked}
              onCheckedChange={(on) => onToggle(group, on)}
            />
            <div className="space-y-0.5 text-xs text-muted-foreground">
              <div className="text-sm font-medium text-foreground">{copy.title}</div>
              {copy.slices !== undefined && <p>{t("group.slicesBy", { slices: copy.slices })}</p>}
              <p>
                {copy.slices !== undefined
                  ? t("group.counts", { counts: copy.counts })
                  : t("group.sends", { counts: copy.counts })}
              </p>
              <p>{t("group.helpsCatch", { helps: copy.helps })}</p>
            </div>
          </li>
        );
      })}
      {update.error !== null && <li className="p-3 text-xs text-destructive">{update.error.message}</li>}
    </ul>
  );
}

function TelemetrySwitch({
  settings,
  update,
  requestEnable,
}: {
  settings: TelemetrySettings;
  update: SettingsUpdate;
  requestEnable: () => void;
}) {
  const t = useTranslations("telemetry");
  const on = isOn(settings);
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <Switch
        aria-label={t("aria.telemetry")}
        checked={on}
        disabled={!settings.editable || update.isPending}
        onCheckedChange={(next) =>
          next ? requestEnable() : update.mutate({ groups: [], destination: savedDestination(settings) })
        }
      />
      <span aria-hidden>{on ? t("state.on") : t("state.off")}</span>
    </div>
  );
}

function ReportPreview({ settings }: { settings: TelemetrySettings }) {
  const t = useTranslations("telemetry");
  return (
    <section className="space-y-1">
      <h3 className="font-medium">{settings.report_is_sample ? t("report.sampleTitle") : t("report.lastTitle")}</h3>
      <p className="text-xs text-muted-foreground">
        {settings.report_is_sample ? t("report.sampleHint") : t("report.lastHint")}
      </p>
      <pre className="max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs">
        {JSON.stringify(settings.report, null, 2)}
      </pre>
    </section>
  );
}

export default function TelemetrySettingsPage() {
  const t = useTranslations("telemetry");
  const [tab, setTab] = useUrlTab(TABS, "proxy");
  const { data: settings, isLoading, error } = useTelemetrySettings();
  const update = useUpdateTelemetrySettings();
  const { premiumUser } = useAuthorized();
  const [enableDialogOpen, setEnableDialogOpen] = useState(false);
  const requestEnable = () => setEnableDialogOpen(true);
  if (isLoading) return <Page>{t("loading")}</Page>;
  if (settings === undefined)
    return <Page className="text-destructive">{t("error.loadFailed", { message: error?.message ?? "" })}</Page>;
  return (
    <Page className="text-sm">
      <PageTabs value={tab} onValueChange={(value) => setTab(value as (typeof TABS)[number])}>
        <PageHeader>
          <PageHeaderTitle>
            <Activity />
            {t("title.telemetry")}
          </PageHeaderTitle>
          <PageHeaderDescription>{t("subtitle")}</PageHeaderDescription>
          <PageHeaderControls>
            <TelemetrySwitch settings={settings} update={update} requestEnable={requestEnable} />
            <PageTabsList>
              <PageTabsTrigger value="proxy">{t("tab.proxy")}</PageTabsTrigger>
              <PageTabsTrigger value="ui">{t("tab.ui")}</PageTabsTrigger>
            </PageTabsList>
          </PageHeaderControls>
        </PageHeader>
        <PageTabsContent value="proxy" className="gap-4">
          <GroupList groups={PROXY_GROUPS} settings={settings} update={update} requestEnable={requestEnable} />
        </PageTabsContent>
        <PageTabsContent value="ui" className="gap-4">
          <GroupList groups={UI_GROUPS} settings={settings} update={update} requestEnable={requestEnable} />
          <p className="text-xs text-muted-foreground">{t("note.uiOnly")}</p>
        </PageTabsContent>
      </PageTabs>
      <DestinationPicker settings={settings} update={update} requestEnable={requestEnable} />
      <section className="space-y-1">
        <h3 className="font-medium">{t("title.howAndWhen")}</h3>
        <p className="text-xs text-muted-foreground">
          {t("note.changesApply", { destination: destinationText(settings, t) })}
        </p>
        <p className="text-xs text-muted-foreground">{t("note.offByDefault")}</p>
      </section>
      <ReportPreview settings={settings} />
      <TelemetryEnterpriseDialog
        open={enableDialogOpen}
        onOpenChange={setEnableDialogOpen}
        premiumUser={premiumUser === true}
      />
    </Page>
  );
}
