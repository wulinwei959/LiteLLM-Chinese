import type { AnalysisModelInfo, SignalConfig } from "./types";
import { lensTranslate } from "../../../host/lensTranslate";

export const SYSTEM_ONE_MODE = "evaluation";

export const signalsConfigured = (config: SignalConfig): boolean =>
  Boolean(config.model) && (config.signals?.length ?? 0) > 0;

export const systemOneModels = (details: readonly AnalysisModelInfo[]): AnalysisModelInfo[] =>
  details
    .filter((info) => info.mode === SYSTEM_ONE_MODE)
    .toSorted((a, b) => a.model_group.localeCompare(b.model_group));

export interface LibrarySignal {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly question: string;
}

export const SIGNAL_LIBRARY: readonly LibrarySignal[] = [
  {
    id: "user_frustration",
    get name() { return lensTranslate("model.userFrustration"); },
    summary: "annoyed, complaining or giving up",
    get question() { return lensTranslate("model.userShowFrustrationAnnoyance"); },
  },
  {
    id: "missing_capability",
    get name() { return lensTranslate("model.missingCapability"); },
    get summary() { return lensTranslate("model.askedSomethingAgentT"); },
    get question() { return lensTranslate("model.userAskSomethingAgent"); },
  },
  {
    id: "repeated_request",
    get name() { return lensTranslate("model.repeatedRequest"); },
    get summary() { return lensTranslate("model.hadAskSameThing"); },
    get question() { return lensTranslate("model.userAskSameThing"); },
  },
  {
    id: "asked_for_human",
    get name() { return lensTranslate("model.askedHuman"); },
    summary: "wants a person, not the agent",
    get question() { return lensTranslate("model.userAskTalkHuman"); },
  },
  {
    id: "tool_failure",
    get name() { return lensTranslate("model.toolFailure"); },
    get summary() { return lensTranslate("model.toolStepFailedStayed"); },
    get question() { return lensTranslate("model.toolCallStepFail"); },
  },
  {
    id: "refused_request",
    get name() { return lensTranslate("model.refusedRequest"); },
    get summary() { return lensTranslate("model.declinedReasonableAsk"); },
    get question() { return lensTranslate("model.agentRefuseDeclineReasonable"); },
  },
  {
    id: "made_up_answer",
    get name() { return lensTranslate("model.madeUpAnswer"); },
    get summary() { return lensTranslate("model.factsLinksSource"); },
    get question() { return lensTranslate("model.agentStateFactsNumbers"); },
  },
  {
    id: "task_abandoned",
    get name() { return lensTranslate("model.taskAbandoned"); },
    get summary() { return lensTranslate("model.runEndedWithoutAsked"); },
    get question() { return lensTranslate("model.runEndWithoutUser"); },
  },
];
