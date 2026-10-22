import type { TelemetryGroup } from "@/app/(dashboard)/hooks/telemetry/useTelemetrySettings";
import type { TelemetryTranslator } from "@/lib/i18n/translators";

export interface GroupCopy {
  readonly title: string;
  readonly slices?: string;
  readonly counts: string;
  readonly helps: string;
}

export const PROXY_GROUPS: readonly TelemetryGroup[] = [
  "heartbeat",
  "request_success",
  "token_info",
  "request_taxonomy",
  "event_details",
  "instance_configuration",
];

export const UI_GROUPS: readonly TelemetryGroup[] = ["page_navigation"];

export const groupCopy = (group: TelemetryGroup, t: TelemetryTranslator): GroupCopy => {
  switch (group) {
    case "heartbeat":
      return {
        title: t("groups.heartbeat.title"),
        counts: t("groups.heartbeat.counts"),
        helps: t("groups.heartbeat.helps"),
      };
    case "request_success":
      return {
        title: t("groups.requestSuccess.title"),
        slices: t("groups.requestSuccess.slices"),
        counts: t("groups.requestSuccess.counts"),
        helps: t("groups.requestSuccess.helps"),
      };
    case "token_info":
      return {
        title: t("groups.tokenInfo.title"),
        slices: t("groups.tokenInfo.slices"),
        counts: t("groups.tokenInfo.counts"),
        helps: t("groups.tokenInfo.helps"),
      };
    case "request_taxonomy":
      return {
        title: t("groups.requestTaxonomy.title"),
        slices: t("groups.requestTaxonomy.slices"),
        counts: t("groups.requestTaxonomy.counts"),
        helps: t("groups.requestTaxonomy.helps"),
      };
    case "event_details":
      return {
        title: t("groups.eventDetails.title"),
        counts: t("groups.eventDetails.counts"),
        helps: t("groups.eventDetails.helps"),
      };
    case "instance_configuration":
      return {
        title: t("groups.instanceConfiguration.title"),
        counts: t("groups.instanceConfiguration.counts"),
        helps: t("groups.instanceConfiguration.helps"),
      };
    case "page_navigation":
      return {
        title: t("groups.pageNavigation.title"),
        counts: t("groups.pageNavigation.counts"),
        helps: t("groups.pageNavigation.helps"),
      };
  }
};

export type Requires = ReadonlyMap<TelemetryGroup, TelemetryGroup | null>;

const dependents = (group: TelemetryGroup, requires: Requires): readonly TelemetryGroup[] =>
  [...requires.entries()]
    .filter(([, parent]) => parent === group)
    .flatMap(([child]) => [child, ...dependents(child, requires)]);

export const depthOf = (group: TelemetryGroup, requires: Requires): number => {
  const parent = requires.get(group) ?? null;
  return parent === null ? 0 : 1 + depthOf(parent, requires);
};

export const relativeDepths = (
  groups: readonly TelemetryGroup[],
  requires: Requires,
): ReadonlyMap<TelemetryGroup, number> => {
  const depths = groups.map((group) => [group, depthOf(group, requires)] as const);
  const shallowest = Math.min(...depths.map(([, depth]) => depth));
  return new Map(depths.map(([group, depth]) => [group, depth - shallowest]));
};

const withAncestors = (group: TelemetryGroup, requires: Requires): readonly TelemetryGroup[] => {
  const parent = requires.get(group) ?? null;
  return parent === null ? [group] : [group, ...withAncestors(parent, requires)];
};

export const toggleGroup = (
  group: TelemetryGroup,
  on: boolean,
  enabled: ReadonlySet<TelemetryGroup>,
  requires: Requires,
): ReadonlySet<TelemetryGroup> => {
  if (on) return new Set([...enabled, ...withAncestors(group, requires)]);
  const removed = new Set([group, ...dependents(group, requires)]);
  return new Set([...enabled].filter((g) => !removed.has(g)));
};
