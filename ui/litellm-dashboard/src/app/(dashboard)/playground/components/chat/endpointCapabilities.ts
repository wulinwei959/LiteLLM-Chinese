import { EndpointType } from "@/components/chat_ui/mode_endpoint_mapping";
import { AUDIO_ACCEPT, CHAT_ATTACHMENT_ACCEPT, IMAGE_EDIT_ACCEPT } from "../chat_ui/uploadValidation";

export type AttachKind = "chat" | "images" | "audio";

type ComposerMessageKey =
  | "attach.audio"
  | "attach.chat"
  | "attach.images"
  | "placeholder.agent"
  | "placeholder.embeddings"
  | "placeholder.image"
  | "placeholder.imageEdits"
  | "placeholder.speech"
  | "placeholder.testRequest"
  | "placeholder.transcription"
  | "placeholder.video";

type ChatMessageKey =
  | "suggestions.a2a.0"
  | "suggestions.a2a.1"
  | "suggestions.a2a.2"
  | "suggestions.codeInterpreter.0"
  | "suggestions.codeInterpreter.1"
  | "suggestions.codeInterpreter.2"
  | "suggestions.default.0"
  | "suggestions.default.1"
  | "suggestions.default.2";

export type Capabilities = Readonly<{
  target: "model" | "agent" | "mcpTool";
  mcp: boolean;
  vectorStores: boolean;
  guardrails: boolean;
  policies: boolean;
  attach: AttachKind | null;
  codeInterpreter: boolean;
  stream: boolean;
  simulateFallback: boolean;
  sampling: boolean;
  sessions: boolean;
  voice: boolean;
  customHeaders: boolean;
  textRequired: boolean;
  placeholderKey: ComposerMessageKey;
}>;

const BASE: Capabilities = {
  target: "model",
  mcp: false,
  vectorStores: false,
  guardrails: false,
  policies: false,
  attach: null,
  codeInterpreter: false,
  stream: false,
  simulateFallback: false,
  sampling: false,
  sessions: false,
  voice: false,
  customHeaders: true,
  textRequired: true,
  placeholderKey: "placeholder.testRequest",
};

const TEXT_CHAT: Partial<Capabilities> = {
  mcp: true,
  vectorStores: true,
  guardrails: true,
  policies: true,
  stream: true,
};

const CAPABILITIES: Readonly<Record<EndpointType, Capabilities>> = {
  [EndpointType.CHAT]: { ...BASE, ...TEXT_CHAT, attach: "chat", simulateFallback: true, sampling: true },
  [EndpointType.RESPONSES]: { ...BASE, ...TEXT_CHAT, attach: "chat", codeInterpreter: true, sessions: true },
  [EndpointType.ANTHROPIC_MESSAGES]: { ...BASE, ...TEXT_CHAT },
  [EndpointType.IMAGE]: { ...BASE, placeholderKey: "placeholder.image" },
  [EndpointType.VIDEO]: { ...BASE, placeholderKey: "placeholder.video" },
  [EndpointType.IMAGE_EDITS]: { ...BASE, attach: "images", placeholderKey: "placeholder.imageEdits" },
  [EndpointType.EMBEDDINGS]: { ...BASE, placeholderKey: "placeholder.embeddings" },
  [EndpointType.SPEECH]: { ...BASE, voice: true, placeholderKey: "placeholder.speech" },
  [EndpointType.TRANSCRIPTION]: {
    ...BASE,
    attach: "audio",
    textRequired: false,
    placeholderKey: "placeholder.transcription",
  },
  [EndpointType.A2A_AGENTS]: { ...BASE, target: "agent", guardrails: true, placeholderKey: "placeholder.agent" },
  [EndpointType.MCP]: { ...BASE, target: "mcpTool", guardrails: true, textRequired: false },
  [EndpointType.REALTIME]: { ...BASE, guardrails: true, customHeaders: false },
  [EndpointType.INTERACTIONS]: { ...BASE },
};

export const capabilitiesFor = (endpoint: EndpointType): Capabilities => CAPABILITIES[endpoint];

export const ACCEPT_FOR: Readonly<Record<AttachKind, string>> = {
  chat: CHAT_ATTACHMENT_ACCEPT,
  images: IMAGE_EDIT_ACCEPT,
  audio: AUDIO_ACCEPT,
};

export const ATTACH_LABEL_KEYS: Readonly<Record<AttachKind, ComposerMessageKey>> = {
  chat: "attach.chat",
  images: "attach.images",
  audio: "attach.audio",
};

const DEFAULT_SUGGESTION_KEYS: readonly ChatMessageKey[] = [
  "suggestions.default.0",
  "suggestions.default.1",
  "suggestions.default.2",
];

const A2A_SUGGESTION_KEYS: readonly ChatMessageKey[] = [
  "suggestions.a2a.0",
  "suggestions.a2a.1",
  "suggestions.a2a.2",
];

export const SUGGESTION_KEYS: Readonly<Partial<Record<EndpointType, readonly ChatMessageKey[]>>> = {
  [EndpointType.CHAT]: DEFAULT_SUGGESTION_KEYS,
  [EndpointType.RESPONSES]: DEFAULT_SUGGESTION_KEYS,
  [EndpointType.ANTHROPIC_MESSAGES]: DEFAULT_SUGGESTION_KEYS,
  [EndpointType.A2A_AGENTS]: A2A_SUGGESTION_KEYS,
};

export const CODE_INTERPRETER_SUGGESTION_KEYS: readonly ChatMessageKey[] = [
  "suggestions.codeInterpreter.0",
  "suggestions.codeInterpreter.1",
  "suggestions.codeInterpreter.2",
];
