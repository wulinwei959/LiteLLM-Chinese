import { EndpointType } from "@/components/chat_ui/mode_endpoint_mapping";

export const OPEN_AI_VOICES = {
  ALLOY: "alloy",
  ASH: "ash",
  BALAD: "ballad",
  CORAL: "coral",
  ECHO: "echo",
  FABLE: "fable",
  NOVA: "nova",
  ONYX: "onyx",
  SAGE: "sage",
  SHIMMER: "shimmer",
} as const;

export type OpenAIVoice = (typeof OPEN_AI_VOICES)[keyof typeof OPEN_AI_VOICES];

export type PlaygroundVoiceMessageKey =
  | "voices.alloy"
  | "voices.ash"
  | "voices.ballad"
  | "voices.coral"
  | "voices.echo"
  | "voices.fable"
  | "voices.nova"
  | "voices.onyx"
  | "voices.sage"
  | "voices.shimmer";

// Every key here resolves under the `playground` namespace.
export const OPEN_AI_VOICE_LABEL_KEYS: Record<keyof typeof OPEN_AI_VOICES, PlaygroundVoiceMessageKey> = {
  ALLOY: "voices.alloy",
  ASH: "voices.ash",
  BALAD: "voices.ballad",
  CORAL: "voices.coral",
  ECHO: "voices.echo",
  FABLE: "voices.fable",
  NOVA: "voices.nova",
  ONYX: "voices.onyx",
  SAGE: "voices.sage",
  SHIMMER: "voices.shimmer",
};

export const OPEN_AI_VOICE_SELECT_OPTIONS = Object.entries(OPEN_AI_VOICES).map(([key, voice]) => ({
  value: voice,
  labelKey: OPEN_AI_VOICE_LABEL_KEYS[key as keyof typeof OPEN_AI_VOICE_LABEL_KEYS],
}));

export const ENDPOINT_OPTIONS = [
  { value: EndpointType.CHAT, label: "/v1/chat/completions" },
  { value: EndpointType.RESPONSES, label: "/v1/responses" },
  { value: EndpointType.ANTHROPIC_MESSAGES, label: "/v1/messages" },
  { value: EndpointType.IMAGE, label: "/v1/images/generations" },
  { value: EndpointType.IMAGE_EDITS, label: "/v1/images/edits" },
  { value: EndpointType.EMBEDDINGS, label: "/v1/embeddings" },
  { value: EndpointType.SPEECH, label: "/v1/audio/speech" },
  { value: EndpointType.TRANSCRIPTION, label: "/v1/audio/transcriptions" },
  { value: EndpointType.A2A_AGENTS, label: "/v1/a2a/message/send" },
  { value: EndpointType.MCP, label: "/mcp-rest/tools/call" },
  { value: EndpointType.REALTIME, label: "/v1/realtime" },
  { value: EndpointType.INTERACTIONS, label: "/v1beta/interactions" },
];
