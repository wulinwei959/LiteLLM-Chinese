"use client";
import { Database, Eraser, Info, Key, Link2, ListPlus, Settings, Shield, Tags, Volume2, Wrench } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

import GuardrailSelector from "@/components/guardrails/GuardrailSelector";
import PolicySelector from "@/components/policies/PolicySelector";
import { MCPServer, MCPToolset } from "@/components/mcp_tools/types";
import TagSelector from "@/components/tag_management/TagSelector";
import VectorStoreSelector from "@/components/vector_store_management/VectorStoreSelector";
import KeyValueInput, { type KeyValuePair } from "@/components/key_value_input";
import { ModelGroup } from "@/components/llm_calls/fetch_models";
import { OPEN_AI_VOICE_SELECT_OPTIONS, OpenAIVoice } from "./chatConstants";
import CodeInterpreterTool from "./CodeInterpreterTool";
import EndpointSelector from "./EndpointSelector";
import SessionManagement from "./SessionManagement";
import { EndpointType } from "@/components/chat_ui/mode_endpoint_mapping";
import { Agent } from "../../llm_calls/fetch_agents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { uiHref } from "@/utils/uiHref";
import { ChatModelConfigSection } from "./ChatModelConfigSection";
import { ChatMcpConfigSection } from "./ChatMcpConfigSection";
import type { MCPServerToolsMap } from "./ChatUI";

interface ChatConfigPanelProps {
  readonly accessToken: string | null;
  readonly apiKeySource: "session" | "custom";
  readonly setApiKeySource: (next: "session" | "custom") => void;
  readonly apiKey: string;
  readonly setApiKey: (next: string) => void;
  readonly disabledPersonalKeyCreation: boolean;
  readonly proxySettings?: {
    PROXY_BASE_URL?: string;
    LITELLM_UI_API_DOC_BASE_URL?: string | null;
  };
  readonly customProxyBaseUrl: string;
  readonly setCustomProxyBaseUrl: (next: string) => void;
  readonly endpointType: string | null;
  readonly onEndpointChange: (value: string | null) => void;
  readonly selectedVoice: OpenAIVoice;
  readonly onVoiceChange: (value: OpenAIVoice | null) => void;
  readonly responsesSessionId: string | null;
  readonly useApiSessionManagement: boolean;
  readonly onToggleSessionManagement: (useApi: boolean) => void;
  readonly selectedModel: string | null | undefined;
  readonly onModelChange: (value: string | null) => void;
  readonly modelInfo: ModelGroup[];
  readonly isLoadingModels: boolean;
  readonly modelLoadError: boolean;
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
  readonly selectedTags: string[];
  readonly setSelectedTags: (next: string[]) => void;
  readonly customHeaderPairs: readonly KeyValuePair[];
  readonly setCustomHeaderPairs: (next: readonly KeyValuePair[]) => void;
  readonly mcpServers: MCPServer[];
  readonly mcpToolsets: MCPToolset[];
  readonly selectedMCPServers: string[];
  readonly onMcpServersChange: (value: string[]) => void;
  readonly isLoadingMCPServers: boolean;
  readonly selectedMCPDirectTool: string | undefined;
  readonly setSelectedMCPDirectTool: (next: string | undefined) => void;
  readonly serverToolsMap: MCPServerToolsMap;
  readonly mcpServerToolRestrictions: Record<string, string[]>;
  readonly setMCPServerToolRestrictions: (next: React.SetStateAction<Record<string, string[]>>) => void;
  readonly setByokModalServer: (server: MCPServer | null) => void;
  readonly onOpenToolsetsInfo: () => void;
  readonly selectedVectorStores: string[];
  readonly setSelectedVectorStores: (next: string[]) => void;
  readonly selectedGuardrails: string[];
  readonly setSelectedGuardrails: (next: string[]) => void;
  readonly selectedPolicies: string[];
  readonly setSelectedPolicies: (next: string[]) => void;
  readonly canViewPolicies: boolean;
  readonly codeInterpreterEnabled: boolean;
  readonly setCodeInterpreterEnabled: (next: boolean) => void;
}

export const ChatConfigPanel: React.FC<ChatConfigPanelProps> = ({
  accessToken,
  apiKeySource,
  setApiKeySource,
  apiKey,
  setApiKey,
  disabledPersonalKeyCreation,
  proxySettings,
  customProxyBaseUrl,
  setCustomProxyBaseUrl,
  endpointType,
  onEndpointChange,
  selectedVoice,
  onVoiceChange,
  responsesSessionId,
  useApiSessionManagement,
  onToggleSessionManagement,
  selectedModel,
  onModelChange,
  modelInfo,
  isLoadingModels,
  modelLoadError,
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
  selectedTags,
  setSelectedTags,
  customHeaderPairs,
  setCustomHeaderPairs,
  mcpServers,
  mcpToolsets,
  selectedMCPServers,
  onMcpServersChange,
  isLoadingMCPServers,
  selectedMCPDirectTool,
  setSelectedMCPDirectTool,
  serverToolsMap,
  mcpServerToolRestrictions,
  setMCPServerToolRestrictions,
  setByokModalServer,
  onOpenToolsetsInfo,
  selectedVectorStores,
  setSelectedVectorStores,
  selectedGuardrails,
  setSelectedGuardrails,
  selectedPolicies,
  setSelectedPolicies,
  canViewPolicies,
  codeInterpreterEnabled,
  setCodeInterpreterEnabled,
}) => {
  const t = useTranslations("playground");

  return (
    <div className="max-h-[42%] w-full shrink-0 overflow-y-auto border-b border-border bg-muted p-4 lg:max-h-none lg:w-72 lg:border-r lg:border-b-0 xl:w-80">
      <h2 className="mb-6 mt-2 text-xl font-semibold">{t("config.configurations")}</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-2 flex items-center text-sm font-medium text-foreground">
            <Key className="mr-2 size-4" aria-hidden="true" /> {t("config.virtualKeySource")}
          </label>
          <ShadcnSelect
            disabled={disabledPersonalKeyCreation}
            value={apiKeySource}
            onValueChange={(value) => {
              setApiKeySource(value as "session" | "custom");
            }}
          >
            <SelectTrigger className="w-full" size="sm" aria-label={t("config.virtualKeySource")}>
              <SelectValue>{apiKeySource === "custom" ? t("config.customKey") : t("config.session")}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="session">{t("config.session")}</SelectItem>
              <SelectItem value="custom">{t("config.customKey")}</SelectItem>
            </SelectContent>
          </ShadcnSelect>
          {apiKeySource === "custom" && (
            <div className="relative mt-2">
              <Key className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-8 pl-8"
                placeholder={t("chat.enterVirtualKeyPh")}
                type="password"
                onChange={(event) => setApiKey(event.target.value)}
                value={apiKey}
              />
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="flex items-center text-sm font-medium text-foreground">
              <Settings className="mr-2 size-4" aria-hidden="true" /> {t("config.customProxyUrl")}
            </label>
            {proxySettings?.LITELLM_UI_API_DOC_BASE_URL && !customProxyBaseUrl && (
              <Button
                type="button"
                variant="link"
                size="xs"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setCustomProxyBaseUrl(proxySettings.LITELLM_UI_API_DOC_BASE_URL || "");
                  sessionStorage.setItem("customProxyBaseUrl", proxySettings.LITELLM_UI_API_DOC_BASE_URL || "");
                }}
              >
                <Link2 className="size-3" />
                {t("config.fill")}
              </Button>
            )}
            {customProxyBaseUrl && (
              <Button
                type="button"
                variant="link"
                size="xs"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setCustomProxyBaseUrl("");
                  sessionStorage.removeItem("customProxyBaseUrl");
                }}
              >
                <Eraser className="size-3" />
                {t("config.clear")}
              </Button>
            )}
          </div>
          <div className="relative">
            <Wrench className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-8 pl-8"
              placeholder={t("config.proxyUrlPlaceholder")}
              value={customProxyBaseUrl}
              onChange={(event) => {
                setCustomProxyBaseUrl(event.target.value);
                sessionStorage.setItem("customProxyBaseUrl", event.target.value);
              }}
            />
          </div>
          {customProxyBaseUrl && (
            <p className="mt-1 text-xs text-muted-foreground">
              {t("config.proxyUrlNote", { url: customProxyBaseUrl })}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 flex items-center text-sm font-medium text-foreground">
            <Wrench className="mr-2 size-4" aria-hidden="true" /> {t("config.endpointType")}
          </label>
          <EndpointSelector endpointType={endpointType} onEndpointChange={onEndpointChange} className="mb-4" />

          {endpointType === EndpointType.SPEECH && (
            <div className="mb-4">
              <label className="mb-2 flex items-center text-sm font-medium text-foreground">
                <Volume2 className="mr-2 size-4" aria-hidden="true" />
                {t("config.voice")}
              </label>
              <ShadcnSelect
                items={OPEN_AI_VOICE_SELECT_OPTIONS.map((v) => ({ value: v.value, label: t(v.labelKey) }))}
                value={selectedVoice}
                onValueChange={onVoiceChange}
              >
                <SelectTrigger className="w-full" size="sm" aria-label={t("config.voice")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPEN_AI_VOICE_SELECT_OPTIONS.map((voice) => (
                    <SelectItem key={voice.value} value={voice.value}>
                      {t(voice.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </ShadcnSelect>
            </div>
          )}

          <SessionManagement
            endpointType={endpointType}
            responsesSessionId={responsesSessionId}
            useApiSessionManagement={useApiSessionManagement}
            onToggleSessionManagement={onToggleSessionManagement}
          />
        </div>

        <ChatModelConfigSection
          endpointType={endpointType}
          selectedModel={selectedModel}
          onModelChange={onModelChange}
          modelInfo={modelInfo}
          isLoadingModels={isLoadingModels}
          modelLoadError={modelLoadError}
          apiKeySource={apiKeySource}
          apiKey={apiKey}
          showCustomModelInput={showCustomModelInput}
          onCustomModelInput={onCustomModelInput}
          temperature={temperature}
          setTemperature={setTemperature}
          maxTokens={maxTokens}
          setMaxTokens={setMaxTokens}
          useAdvancedParams={useAdvancedParams}
          setUseAdvancedParams={setUseAdvancedParams}
          mockTestFallbacks={mockTestFallbacks}
          setMockTestFallbacks={setMockTestFallbacks}
          streamingEnabled={streamingEnabled}
          setStreamingEnabled={setStreamingEnabled}
          agentInfo={agentInfo}
          selectedAgent={selectedAgent}
          setSelectedAgent={setSelectedAgent}
        />

        <div>
          <label className="mb-2 flex items-center text-sm font-medium text-foreground">
            <Tags className="mr-2 size-4" aria-hidden="true" /> {t("config.tags")}
          </label>
          <TagSelector
            value={selectedTags}
            onChange={setSelectedTags}
            className="mb-4"
            accessToken={accessToken || ""}
          />
        </div>

        {endpointType !== EndpointType.REALTIME && (
          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-foreground">
              <ListPlus className="mr-2 size-4" aria-hidden="true" /> {t("config.customHeaders")}
            </label>
            <KeyValueInput value={customHeaderPairs} onChange={setCustomHeaderPairs} />
            <p className="mt-2 text-xs text-muted-foreground">{t("config.customHeadersHint")}</p>
          </div>
        )}

        <ChatMcpConfigSection
          endpointType={endpointType}
          mcpServers={mcpServers}
          mcpToolsets={mcpToolsets}
          selectedMCPServers={selectedMCPServers}
          onMcpServersChange={onMcpServersChange}
          isLoadingMCPServers={isLoadingMCPServers}
          selectedMCPDirectTool={selectedMCPDirectTool}
          setSelectedMCPDirectTool={setSelectedMCPDirectTool}
          serverToolsMap={serverToolsMap}
          mcpServerToolRestrictions={mcpServerToolRestrictions}
          setMCPServerToolRestrictions={setMCPServerToolRestrictions}
          setByokModalServer={setByokModalServer}
          onOpenToolsetsInfo={onOpenToolsetsInfo}
        />

        <div>
          <div className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground">
            <Database className="mr-1 size-4" aria-hidden="true" /> {t("config.vectorStore")}
            <Tooltip>
              <TooltipTrigger aria-label={t("config.aboutVectorStores")}>
                <Info className="size-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                {t.rich("config.vectorStoreHint", {
                  link: (chunks) => (
                    <a href={uiHref("vector-stores")} className="text-info underline">
                      {chunks}
                    </a>
                  ),
                })}
              </TooltipContent>
            </Tooltip>
          </div>
          <VectorStoreSelector
            value={selectedVectorStores}
            onChange={setSelectedVectorStores}
            className="mb-4"
            accessToken={accessToken || ""}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground">
            <Shield className="mr-1 size-4" aria-hidden="true" /> {t("config.guardrails")}
            <Tooltip>
              <TooltipTrigger aria-label={t("config.aboutGuardrails")}>
                <Info className="size-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                {t.rich("config.guardrailsHint", {
                  link: (chunks) => (
                    <a href={uiHref("guardrails")} className="text-info underline">
                      {chunks}
                    </a>
                  ),
                })}
              </TooltipContent>
            </Tooltip>
          </div>
          <GuardrailSelector
            value={selectedGuardrails}
            onChange={setSelectedGuardrails}
            className="mb-4"
            accessToken={accessToken || ""}
          />
        </div>

        {canViewPolicies && (
          <div>
            <div className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground">
              <Shield className="mr-1 size-4" aria-hidden="true" /> {t("config.policies")}
              <Tooltip>
                <TooltipTrigger aria-label={t("config.aboutPolicies")}>
                  <Info className="size-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  {t.rich("config.policiesHint", {
                    link: (chunks) => (
                      <a href={uiHref("policies")} className="text-info underline">
                        {chunks}
                      </a>
                    ),
                  })}
                </TooltipContent>
              </Tooltip>
            </div>
            <PolicySelector
              value={selectedPolicies}
              onChange={setSelectedPolicies}
              className="mb-4"
              accessToken={accessToken || ""}
            />
          </div>
        )}

        {endpointType === EndpointType.RESPONSES && (
          <div>
            <CodeInterpreterTool
              accessToken={apiKeySource === "session" ? accessToken || "" : apiKey}
              enabled={codeInterpreterEnabled}
              onEnabledChange={setCodeInterpreterEnabled}
              selectedContainerId={null}
              onContainerChange={() => {}}
              selectedModel={selectedModel || ""}
            />
          </div>
        )}
      </div>
    </div>
  );
};
