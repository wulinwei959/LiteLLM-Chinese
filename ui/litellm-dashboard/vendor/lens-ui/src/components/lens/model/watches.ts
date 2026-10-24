import type { Settings } from "./types";
import { lensTranslate } from "../../../host/lensTranslate";

export interface Watch {
  id: string;
  name: string;
  summary: string;
  instruction: string;
  defaultOn: boolean;
}

export const watches: readonly Watch[] = [
  {
    id: "watch_unsolved",
    name: "unsolved",
    get summary() { return lensTranslate("model.didnTFinishAsked"); },
    get instruction() { return lensTranslate("model.findRunsAgentFailed"); },
    defaultOn: true,
  },
  {
    id: "watch_blocked",
    name: "blocked",
    summary: "missing a tool, data or skill",
    get instruction() { return lensTranslate("model.findRunsAgentCould"); },
    defaultOn: true,
  },
  {
    id: "watch_permissions",
    name: "permissions",
    summary: "denied, unapproved or overstepped",
    get instruction() { return lensTranslate("model.findRunsPermissionProblems"); },
    defaultOn: false,
  },
  {
    id: "watch_unhappy",
    name: "unhappy",
    get summary() { return lensTranslate("model.userAnnoyedHadRepeat"); },
    get instruction() { return lensTranslate("model.findRunsUserSeems"); },
    defaultOn: true,
  },
  {
    id: "watch_swallowed",
    name: "swallowed",
    get summary() { return lensTranslate("model.ignoredFailedToolCall"); },
    get instruction() { return lensTranslate("model.findRunsToolCall"); },
    defaultOn: false,
  },
  {
    id: "watch_looping",
    name: "looping",
    get summary() { return lensTranslate("model.repeatsStepsWithoutProgress"); },
    get instruction() { return lensTranslate("model.findRunsAgentRepeats"); },
    defaultOn: false,
  },
  {
    id: "watch_invented",
    name: "invented",
    get summary() { return lensTranslate("model.claimsToolEverReturned"); },
    get instruction() { return lensTranslate("model.findRunsAgentStates"); },
    defaultOn: false,
  },
  {
    id: "watch_unsafe",
    name: "unsafe",
    summary: "harmful, deceptive or rule-bending",
    get instruction() { return lensTranslate("model.findRunsMaliciousUnsafe"); },
    defaultOn: false,
  },
];

export function watchChecks(enabled: ReadonlySet<string>): Settings["checks"] {
  return watches
    .filter((watch) => enabled.has(watch.id))
    .map(({ id, instruction }) => ({ id, instruction, enabled: true }));
}

export function initialWatches(checks: Settings["checks"] | undefined): ReadonlySet<string> {
  if (!checks?.length) return new Set(watches.filter((watch) => watch.defaultOn).map((watch) => watch.id));
  const ids = new Set(watches.map((watch) => watch.id));
  return new Set(checks.filter((check) => ids.has(check.id) && check.enabled).map((check) => check.id));
}

export function isWatch(check: Settings["checks"][number]): boolean {
  return watches.some((watch) => watch.id === check.id);
}
