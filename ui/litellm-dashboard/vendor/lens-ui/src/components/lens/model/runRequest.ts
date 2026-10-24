import type { RunWindow } from "./types";
import { lensTranslate } from "../../../host/lensTranslate";

export const RUN_PRESETS = [
  { get label() { return lensTranslate("model.sinceLastRun"); }, hours: null },
  { get label() { return lensTranslate("model.lastHour"); }, hours: 1 },
  { get label() { return lensTranslate("model.last24h"); }, hours: 24 },
  { get label() { return lensTranslate("model.last7d"); }, hours: 168 },
  { get label() { return lensTranslate("model.custom"); }, hours: -1 },
] as const;

export type RunPreset = (typeof RUN_PRESETS)[number]["hours"];

export interface RunChoice {
  preset: RunPreset;
  agent: string;
  saved: string;
  start: string;
  end: string;
}

export function runRequest({ preset, agent, saved, start, end }: RunChoice): RunWindow | string {
  const agentPart = agent.trim() && agent.trim() !== saved ? { agent_name: agent.trim() } : {};
  if (preset === null) return agentPart;
  if (preset > 0) return { ...agentPart, lookback_hours: preset };
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return lensTranslate("model.chooseStartEndTime");
  if (startMs >= endMs) return lensTranslate("model.startTimeMustBefore");
  return { ...agentPart, start: new Date(startMs).toISOString(), end: new Date(endMs).toISOString() };
}
