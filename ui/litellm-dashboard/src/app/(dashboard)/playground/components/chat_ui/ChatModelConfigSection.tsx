"use client";
import { Bot, Settings } from "lucide-react";
import React, { useMemo } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchSelect } from "@/components/shared/SearchSelect";
import { ModelGroup } from "@/components/llm_calls/fetch_models";
import { Agent } from "../../llm_calls/fetch_agents";
import AdditionalModelSettings from "./AdditionalModelSettings";
import { filterModelsForEndpoint } from "./EndpointUtils";
import { EndpointType } from "@/components/chat_ui/mode_endpoint_mapping";

interface ChatModelConfigSectionProps {
  readonly endpointType: string | null;
  readonly selectedModel: string | null | undefined;
  readonly onModelChange: (value: string | null) => void;
  readonly modelInfo: ModelGroup[];
  readonly isLoadingModels: boolean;
  readonly modelLoadError: boolean;
  readonly apiKeySource: "session" | "custom";
  readonly apiKey: string;
  readonly showCustomModelInput: boolean;
  readonly onCustomModelInput: (value: string) => void;
  readonly temperature: number;
  readonly setTemperature: (next: number) => void;
  readonly maxTokens: number;
  readonly setMaxTokens: (next: number) => void;
  readonly useAdvancedParams: boolean;
  readonly setUseAdvancedParams: (next: boolean) => void;
  readonly mockTestFallbacks: boolean;
  readonly setMockTestFallbacks: (next: boolean) => void;
  readonly streamingEnabled: boolean;
  readonly setStreamingEnabled: (next: boolean) => void;
  readonly agentInfo: Agent[];
  readonly selectedAgent: string | null;
  readonly setSelectedAgent: (next: string | null) => void;
}

export const ChatModelConfigSection: React.FC<ChatModelConfigSectionProps> = ({
  endpointType,
  selectedModel,
  onModelChange,
  modelInfo,
  isLoadingModels,
  modelLoadError,
  apiKeySource,
  apiKey,
  showCustomModelInput,
  onCustomModelInput,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  useAdvancedParams,
  setUseAdvancedParams,
  mockTestFallbacks,
  setMockTestFallbacks,
  streamingEnabled,
  setStreamingEnabled,
  agentInfo,
  selectedAgent,
  setSelectedAgent,
}) => {
  const t = useTranslations("playground");

  const isChatModel = (): boolean => {
    if (!selectedModel || selectedModel === "custom") {
      return false;
    }
    const model = modelInfo.find((m) => m.model_group === selectedModel);
    if (!model) {
      return false;
    }
    // Check if mode is explicitly "chat" or undefined (which defaults to chat per backend)
    return !model.mode || model.mode === "chat";
  };

  const supportsStreamingToggle =
    endpointType === EndpointType.CHAT ||
    endpointType === EndpointType.RESPONSES ||
    endpointType === EndpointType.ANTHROPIC_MESSAGES;

  const modelsForEndpoint = useMemo(
    () => filterModelsForEndpoint(modelInfo, endpointType as EndpointType),
    [modelInfo, endpointType],
  );

  let modelEmptyText = t("config.noModelsAvailable");
  if (modelLoadError) {
    modelEmptyText = t("config.unableToLoadModels");
  } else if (apiKeySource === "custom" && !apiKey.trim()) {
    modelEmptyText = t("config.enterVirtualKey");
  } else if (modelInfo.length > 0 && modelsForEndpoint.length === 0) {
    modelEmptyText = t("config.noModelsForEndpoint");
  }

  return (
    <>
      {endpointType !== EndpointType.A2A_AGENTS && endpointType !== EndpointType.MCP && (
        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-medium text-foreground">
            <span className="flex items-center">
              <Bot className="mr-2 size-4" aria-hidden="true" /> {t("config.selectModel")}
            </span>
            {isChatModel() || supportsStreamingToggle ? (
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={t("config.modelSettings")}
                      data-testid="model-settings-button"
                    />
                  }
                >
                  <Settings className="size-3.5" />
                </PopoverTrigger>
                <PopoverContent side="right" className="w-auto p-0">
                  <div className="border-b border-border px-4 py-2 text-sm font-medium">
                    {t("config.modelSettings")}
                  </div>
                  <AdditionalModelSettings
                    showAdvancedParams={isChatModel()}
                    temperature={temperature}
                    maxTokens={maxTokens}
                    useAdvancedParams={useAdvancedParams}
                    onTemperatureChange={setTemperature}
                    onMaxTokensChange={setMaxTokens}
                    onUseAdvancedParamsChange={setUseAdvancedParams}
                    mockTestFallbacks={mockTestFallbacks}
                    onMockTestFallbacksChange={setMockTestFallbacks}
                    streamingEnabled={streamingEnabled}
                    onStreamingChange={supportsStreamingToggle ? setStreamingEnabled : undefined}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="cursor-not-allowed text-muted-foreground"
                      disabled
                      aria-label={`${t("config.modelSettings")} ${t("config.unavailable")}`}
                    />
                  }
                >
                  <Settings className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>{t("config.advancedParamsUnavailable")}</TooltipContent>
              </Tooltip>
            )}
          </div>
          <SearchSelect
            value={selectedModel}
            placeholder={isLoadingModels ? t("config.loadingModels") : t("config.selectModel")}
            emptyText={modelEmptyText}
            disabled={isLoadingModels}
            onValueChange={onModelChange}
            options={[
              { value: "custom", label: t("config.customModelOption") },
              ...modelsForEndpoint.map((model) => ({
                value: model.model_group,
                label: model.model_group,
                sublabel: model.mode ? t("config.modeSublabel", { mode: model.mode }) : undefined,
              })),
            ]}
          />
          {showCustomModelInput && (
            <Input
              className="mt-2 h-8"
              placeholder={t("config.enterCustomModel")}
              onChange={(event) => onCustomModelInput(event.target.value)}
            />
          )}
        </div>
      )}

      {endpointType === EndpointType.A2A_AGENTS && (
        <div>
          <label className="mb-2 flex items-center text-sm font-medium text-foreground">
            <Bot className="mr-2 size-4" aria-hidden="true" /> {t("config.selectAgent")}
          </label>
          <SearchSelect
            value={selectedAgent}
            placeholder={t("config.selectAgent")}
            onValueChange={(value) => setSelectedAgent(value)}
            options={agentInfo.map((agent) => ({
              value: agent.agent_name,
              label: agent.agent_name || agent.agent_id,
              sublabel: agent.agent_card_params?.description,
            }))}
          />
          {agentInfo.length === 0 && <p className="mt-2 text-xs text-muted-foreground">{t("config.noAgentsFound")}</p>}
        </div>
      )}
    </>
  );
};
