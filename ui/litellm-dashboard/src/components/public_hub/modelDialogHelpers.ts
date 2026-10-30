import { generateCodeSnippet } from "@/components/chat_ui/CodeSnippets";
import { getEndpointType } from "@/components/chat_ui/mode_endpoint_mapping";
import { MessageType } from "@/components/chat_ui/types";
import { modelUsageExample } from "@/components/AIHub/modelUsageExample";
import { getGlobalLitellmHeaderName, getProxyBaseUrl } from "@/components/networking";
import type { ModelGroupInfo } from "@/components/PublicModelHubTableColumns";
import { isDecisionMode } from "@/lib/decisionModels";

export const modelUsageExampleText = (model: ModelGroupInfo): string =>
  isDecisionMode(model.mode)
    ? modelUsageExample(model.mode, getProxyBaseUrl(), model.model_group, getGlobalLitellmHeaderName())
    : generateCodeSnippet({
        apiKeySource: "custom",
        accessToken: null,
        apiKey: "your_api_key",
        inputMessage: "Hello, how are you?",
        chatHistory: [{ role: "user", content: "Hello, how are you?", isImage: false } as MessageType],
        selectedTags: [],
        selectedVectorStores: [],
        selectedGuardrails: [],
        selectedPolicies: [],
        selectedMCPServers: [],
        endpointType: getEndpointType(model.mode || "chat"),
        selectedModel: model.model_group,
        selectedSdk: "openai",
      });

export const formatCapabilityName = (key: string): string =>
  key
    .replace(/^supports_/, "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const getModelCapabilities = (model: ModelGroupInfo): string[] =>
  Object.entries(model)
    .filter(([key, value]) => key.startsWith("supports_") && value === true)
    .map(([key]) => key);

export const formatCost = (cost: number): string => `$${(cost * 1_000_000).toFixed(4)}`;
