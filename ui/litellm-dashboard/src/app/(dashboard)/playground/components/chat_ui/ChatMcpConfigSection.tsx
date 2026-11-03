"use client";
import { Info, Key, Wrench } from "lucide-react";
import React, { useMemo } from "react";
import { useTranslations } from "next-intl";

import { EndpointType } from "@/components/chat_ui/mode_endpoint_mapping";
import { MCPServer, MCPToolset } from "@/components/mcp_tools/types";
import { MultiSelect, type MultiSelectOption } from "@/components/shared/MultiSelect";
import { SearchSelect } from "@/components/shared/SearchSelect";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { MCPServerToolsMap } from "./ChatUI";

const MCP_SUPPORTED_ENDPOINTS = new Set<EndpointType>([
  EndpointType.CHAT,
  EndpointType.RESPONSES,
  EndpointType.MCP,
  EndpointType.ANTHROPIC_MESSAGES,
]);

interface ChatMcpConfigSectionProps {
  readonly endpointType: string | null;
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
}

interface ChatMcpDirectToolPickerProps {
  readonly endpointType: string | null;
  readonly selectedMCPServers: string[];
  readonly mcpToolsets: MCPToolset[];
  readonly serverToolsMap: MCPServerToolsMap;
  readonly selectedMCPDirectTool: string | undefined;
  readonly setSelectedMCPDirectTool: (next: string | undefined) => void;
}

const ChatMcpDirectToolPicker: React.FC<ChatMcpDirectToolPickerProps> = ({
  endpointType,
  selectedMCPServers,
  mcpToolsets,
  serverToolsMap,
  selectedMCPDirectTool,
  setSelectedMCPDirectTool,
}) => {
  const t = useTranslations("playground");

  if (endpointType !== EndpointType.MCP || selectedMCPServers.length !== 1 || selectedMCPServers[0] === "__all__") {
    return null;
  }

  const rawSel = selectedMCPServers[0];
  const isToolset = rawSel.startsWith("toolset:");
  const toolset = isToolset
    ? mcpToolsets.find((item) => item.toolset_id === rawSel.slice("toolset:".length))
    : undefined;
  const toolOptions = isToolset
    ? (toolset?.tools ?? []).map((item) => ({ value: item.tool_name, label: item.tool_name }))
    : (serverToolsMap[rawSel] || []).map((tool: { name: string }) => ({ value: tool.name, label: tool.name }));

  return (
    <div className="mt-3">
      <p className="mb-1 block text-xs text-muted-foreground">{t("config.selectTool")}</p>
      <SearchSelect
        value={selectedMCPDirectTool}
        placeholder={t("config.selectToolPlaceholder")}
        onValueChange={(value) => setSelectedMCPDirectTool(value || undefined)}
        options={toolOptions}
        className="rounded-md"
      />
    </div>
  );
};

interface ChatMcpToolRestrictionsProps {
  readonly endpointType: string | null;
  readonly mcpServers: MCPServer[];
  readonly selectedMCPServers: string[];
  readonly serverToolsMap: MCPServerToolsMap;
  readonly mcpServerToolRestrictions: Record<string, string[]>;
  readonly setMCPServerToolRestrictions: (next: React.SetStateAction<Record<string, string[]>>) => void;
}

const ChatMcpToolRestrictions: React.FC<ChatMcpToolRestrictionsProps> = ({
  endpointType,
  mcpServers,
  selectedMCPServers,
  serverToolsMap,
  mcpServerToolRestrictions,
  setMCPServerToolRestrictions,
}) => {
  const t = useTranslations("playground");

  if (selectedMCPServers.length === 0 || selectedMCPServers.includes("__all__")) {
    return null;
  }
  if (endpointType === EndpointType.MCP || !MCP_SUPPORTED_ENDPOINTS.has(endpointType as EndpointType)) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      {selectedMCPServers.map((serverId) => {
        const server = mcpServers.find((s) => s.server_id === serverId);
        const tools = serverToolsMap[serverId] || [];
        if (tools.length === 0) {
          return null;
        }

        return (
          <div key={serverId} className="rounded-sm border p-2">
            <p className="mb-1 text-xs text-muted-foreground">
              {t("config.limitTools", { server: server?.alias || server?.server_name || serverId })}
            </p>
            <MultiSelect
              value={mcpServerToolRestrictions[serverId] || []}
              onValueChange={(selectedTools) => {
                setMCPServerToolRestrictions((prev) => ({
                  ...prev,
                  [serverId]: selectedTools,
                }));
              }}
              placeholder={t("config.allToolsDefault")}
              options={tools.map((tool: { name: string }) => ({
                value: tool.name,
                label: tool.name,
              }))}
            />
          </div>
        );
      })}
    </div>
  );
};

interface ChatMcpByokNoticesProps {
  readonly mcpServers: MCPServer[];
  readonly selectedMCPServers: string[];
  readonly setByokModalServer: (server: MCPServer | null) => void;
}

const ChatMcpByokNotices: React.FC<ChatMcpByokNoticesProps> = ({
  mcpServers,
  selectedMCPServers,
  setByokModalServer,
}) => {
  const t = useTranslations("playground");

  if (selectedMCPServers.length === 0 || selectedMCPServers.includes("__all__")) {
    return null;
  }

  const hasByokServer = selectedMCPServers.some(
    (serverId) => mcpServers.find((s) => s.server_id === serverId)?.is_byok,
  );
  if (!hasByokServer) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      {selectedMCPServers.map((serverId) => {
        const server = mcpServers.find((s) => s.server_id === serverId);
        if (!server?.is_byok) {
          return null;
        }
        const serverName = server.alias || server.server_name || serverId;
        return (
          <div
            key={serverId}
            className="flex items-center justify-between rounded-sm border border-info/15 bg-info/10 p-2"
          >
            <p className="text-xs text-info">{t("config.byokRequiresKey", { server: serverName })}</p>
            {server.has_user_credential ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-medium text-success">
                  <Key className="size-3" /> {t("config.byokConnected")}
                </span>
                <button
                  type="button"
                  className="text-xs text-muted-foreground underline hover:text-info"
                  onClick={() => setByokModalServer(server)}
                >
                  {t("config.byokReconnect")}
                </button>
              </div>
            ) : (
              <Button
                type="button"
                size="xs"
                className="rounded-lg bg-info px-3 py-1 text-xs font-medium text-info-foreground hover:bg-info/80"
                onClick={() => setByokModalServer(server)}
              >
                {t("config.byokConnect")}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ChatMcpConfigSection: React.FC<ChatMcpConfigSectionProps> = ({
  endpointType,
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
}) => {
  const t = useTranslations("playground");

  const mcpServerOptions = useMemo((): MultiSelectOption[] => {
    const options: MultiSelectOption[] = [];
    if (endpointType !== EndpointType.MCP) {
      options.push({
        value: "__all__",
        label: t("config.allMcpServers"),
        description: t("config.allMcpServersDesc"),
      });
    }
    for (const toolset of mcpToolsets) {
      options.push({
        value: `toolset:${toolset.toolset_id}`,
        label: toolset.toolset_name,
        description: toolset.description || t("config.toolsetToolsCount", { count: toolset.tools.length }),
      });
    }
    for (const server of mcpServers) {
      options.push({
        value: server.server_id,
        label: server.alias || server.server_name || server.server_id,
        description: server.description ?? undefined,
      });
    }
    return options;
  }, [endpointType, mcpToolsets, mcpServers, t]);

  return (
    <div>
      <div className="mb-2 flex items-center gap-1 text-sm font-medium text-foreground">
        <Wrench className="mr-1 size-4" aria-hidden="true" />
        {endpointType === EndpointType.MCP ? t("config.mcpServer") : t("config.mcpServers")}
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                type="button"
                className="inline-flex"
                aria-label={t("config.aboutMcpServers")}
                onClick={onOpenToolsetsInfo}
              />
            }
          >
            <Info className="size-3.5 cursor-pointer text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            {endpointType === EndpointType.MCP ? t("config.mcpDirectModeDesc") : t("config.mcpChatModeDesc")}
          </TooltipContent>
        </Tooltip>
      </div>
      {endpointType === EndpointType.MCP ? (
        <SearchSelect
          value={
            selectedMCPServers[0] !== "__all__" && selectedMCPServers.length === 1 ? selectedMCPServers[0] : undefined
          }
          placeholder={t("config.selectMcpServer")}
          emptyText={isLoadingMCPServers ? t("config.loadingMcpServers") : t("config.noMcpServers")}
          disabled={!MCP_SUPPORTED_ENDPOINTS.has(endpointType as EndpointType) || isLoadingMCPServers}
          onValueChange={(value) => onMcpServersChange(value ? [value] : [])}
          options={mcpServerOptions}
          className="mb-2"
        />
      ) : (
        <MultiSelect
          value={selectedMCPServers}
          onValueChange={onMcpServersChange}
          placeholder={t("config.mcpServers")}
          emptyText={isLoadingMCPServers ? t("config.loadingMcpServers") : t("config.noMcpServers")}
          disabled={!MCP_SUPPORTED_ENDPOINTS.has(endpointType as EndpointType)}
          loading={isLoadingMCPServers}
          options={mcpServerOptions}
          className="mb-2"
        />
      )}

      <ChatMcpDirectToolPicker
        endpointType={endpointType}
        selectedMCPServers={selectedMCPServers}
        mcpToolsets={mcpToolsets}
        serverToolsMap={serverToolsMap}
        selectedMCPDirectTool={selectedMCPDirectTool}
        setSelectedMCPDirectTool={setSelectedMCPDirectTool}
      />

      <ChatMcpToolRestrictions
        endpointType={endpointType}
        mcpServers={mcpServers}
        selectedMCPServers={selectedMCPServers}
        serverToolsMap={serverToolsMap}
        mcpServerToolRestrictions={mcpServerToolRestrictions}
        setMCPServerToolRestrictions={setMCPServerToolRestrictions}
      />

      <ChatMcpByokNotices
        mcpServers={mcpServers}
        selectedMCPServers={selectedMCPServers}
        setByokModalServer={setByokModalServer}
      />
    </div>
  );
};
