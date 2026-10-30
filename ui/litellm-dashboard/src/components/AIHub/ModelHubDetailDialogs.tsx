"use client";

import { useTranslations } from "next-intl";
import type { AgentHubData } from "@/components/AIHub/AgentHubTableColumns";
import type { MCPServerData } from "@/components/AIHub/MCPHubTableColumns";
import type { ModelHubData } from "@/components/AIHub/ModelHubTableColumns";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Copy } from "lucide-react";
import { useSyntaxTheme } from "@/hooks/useSyntaxTheme";
import prism from "react-syntax-highlighter/dist/esm/styles/prism";
import { modelUsageExample } from "@/components/AIHub/modelUsageExample";
import { getGatewayBaseUrl, getGlobalLitellmHeaderName, getProxyBaseUrl } from "@/components/networking";
import { ModelCustomMetadata } from "@/components/AIHub/ModelCustomMetadata";
import { formatCapabilityName, formatCost, getModelCapabilities } from "@/components/public_hub/modelDialogHelpers";
import { DECISIONS_DOCS_URL, SYSTEM_ONE_PLAYGROUND_ROUTE, isDecisionMode } from "@/lib/decisionModels";
import { uiHref } from "@/utils/uiHref";
import { copyToClipboard } from "@/utils/dataUtils";

const statusBadgeVariant = (status: string | undefined): "default" | "destructive" | "outline" => {
  if (status === "active" || status === "healthy") return "default";
  if (status === "inactive" || status === "unhealthy") return "destructive";
  return "outline";
};

export function ModelHubModelDialog({
  open,
  model,
  onClose,
  canOpenPlayground,
}: {
  open: boolean;
  model: ModelHubData | null;
  onClose: () => void;
  canOpenPlayground: boolean;
}) {
  const t = useTranslations("modelHub");
  const syntaxTheme = useSyntaxTheme(prism);
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>{model?.model_group || t("modelDetailsTitle")}</DialogTitle>
        </DialogHeader>
        {model && (
          <div className="space-y-6">
            {/* Model Overview */}
            <div>
              <p className="text-lg font-semibold mb-4">{t("secModelOverview")}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-medium">{t("lblModelGroup")}</p>
                  <p>{model.model_group}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblMode")}</p>
                  <p>{model.mode || t("notSpecified")}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblProviders")}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {model.providers.map((provider) => (
                      <Badge key={provider} variant="secondary">
                        {provider}
                      </Badge>
                    ))}
                  </div>
                </div>
                {model.description && (
                  <div className="col-span-2">
                    <p className="font-medium">{t("lblDescription")}</p>
                    <p className="mt-1">{model.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Token and Cost Information */}
            <div>
              <p className="text-lg font-semibold mb-4">{t("secTokenCost")}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{t("lblMaxInputTokens")}</p>
                  <p>{model.max_input_tokens?.toLocaleString() || t("notSpecified")}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblMaxOutputTokens")}</p>
                  <p>{model.max_output_tokens?.toLocaleString() || t("notSpecified")}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblInputCostPer1M")}</p>
                  <p>{model.input_cost_per_token ? formatCost(model.input_cost_per_token) : t("notSpecified")}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblOutputCostPer1M")}</p>
                  <p>{model.output_cost_per_token ? formatCost(model.output_cost_per_token) : t("notSpecified")}</p>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div>
              <p className="text-lg font-semibold mb-4">{t("colCapabilities")}</p>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const capabilities = getModelCapabilities(model);
                  const colors = ["green", "blue", "purple", "orange", "red", "yellow"];

                  if (capabilities.length === 0) {
                    return <p className="text-muted-foreground">{t("noCapabilitiesListed")}</p>;
                  }

                  return capabilities.map((capability, index) => (
                    <Badge key={capability} variant="secondary">
                      {formatCapabilityName(capability)}
                    </Badge>
                  ));
                })()}
              </div>
            </div>

            <ModelCustomMetadata customTags={model.custom_tags} customMetadata={model.custom_metadata} />

            {/* Rate Limits */}
            {(model.tpm || model.rpm) && (
              <div>
                <p className="text-lg font-semibold mb-4">{t("secRateLimits")}</p>
                <div className="grid grid-cols-2 gap-4">
                  {model.tpm && (
                    <div>
                      <p className="font-medium">{t("lblTokensPerMinute")}</p>
                      <p>{model.tpm.toLocaleString()}</p>
                    </div>
                  )}
                  {model.rpm && (
                    <div>
                      <p className="font-medium">{t("lblRequestsPerMinute")}</p>
                      <p>{model.rpm.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Supported OpenAI Parameters */}
            {model.supported_openai_params && (
              <div>
                <p className="text-lg font-semibold mb-4">{t("secSupportedParams")}</p>
                <div className="flex flex-wrap gap-2">
                  {model.supported_openai_params.map((param) => (
                    <Badge key={param} variant="default">
                      {param}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-lg font-semibold mb-4">{t("secUsageExample")}</p>
              {isDecisionMode(model.mode) && (
                <p className="mb-2 text-sm text-muted-foreground">
                  {t.rich("decisionModelsAnswer", { code: (chunks) => <code>{chunks}</code> })}{" "}
                  <a href={DECISIONS_DOCS_URL} target="_blank" rel="noopener noreferrer" className="underline">
                    {t("howToCallDecisionModels")}
                  </a>
                  {canOpenPlayground && (
                    <>
                      {" · "}
                      <a href={uiHref(SYSTEM_ONE_PLAYGROUND_ROUTE)} className="underline">
                        {t("tryInPlayground")}
                      </a>
                    </>
                  )}
                </p>
              )}
              <SyntaxHighlighter language="python" className="text-sm" style={syntaxTheme}>
                {modelUsageExample(model.mode, getGatewayBaseUrl(), model.model_group, getGlobalLitellmHeaderName())}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ModelHubAgentDialog({
  open,
  agent,
  onClose,
}: {
  open: boolean;
  agent: AgentHubData | null;
  onClose: () => void;
}) {
  const t = useTranslations("modelHub");
  const commonT = useTranslations("common");
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>{agent?.name || t("agentDetailsTitle")}</DialogTitle>
        </DialogHeader>
        {agent && (
          <div className="space-y-6">
            {/* Agent Overview */}
            <div>
              <p className="text-lg font-semibold mb-4">{t("secAgentOverview")}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-medium">{t("lblName")}</p>
                  <p>{agent.name}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblVersion")}</p>
                  <Badge variant="secondary">v{agent.version}</Badge>
                </div>
                <div>
                  <p className="font-medium">{t("lblProtocolVersion")}</p>
                  <p>{agent.protocolVersion}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblUrl")}</p>
                  <div className="flex items-center space-x-2">
                    <p className="truncate min-w-0">{agent.url}</p>
                    <Copy
                      onClick={() => void copyToClipboard(agent.url, commonT("copiedToClipboard"))}
                      className="size-3.5 shrink-0 cursor-pointer text-muted-foreground hover:text-info"
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="font-medium">{t("lblDescription")}</p>
                <p className="mt-1">{agent.description}</p>
              </div>
            </div>

            {/* Capabilities */}
            {agent.capabilities && Object.keys(agent.capabilities).length > 0 && (
              <div>
                <p className="text-lg font-semibold mb-4">{t("colCapabilities")}</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(agent.capabilities)
                    .filter(([_, value]) => value === true)
                    .map(([key]) => (
                      <Badge key={key} variant="default">
                        {key}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Input/Output Modes */}
            <div>
              <p className="text-lg font-semibold mb-4">{t("secIOModes")}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{t("lblInputModes")}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.defaultInputModes?.map((mode) => (
                      <Badge key={mode} variant="secondary">
                        {mode}
                      </Badge>
                    )) || <p>{t("notSpecified")}</p>}
                  </div>
                </div>
                <div>
                  <p className="font-medium">{t("lblOutputModes")}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.defaultOutputModes?.map((mode) => (
                      <Badge key={mode} variant="outline">
                        {mode}
                      </Badge>
                    )) || <p>{t("notSpecified")}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            {agent.skills && agent.skills.length > 0 && (
              <div>
                <p className="text-lg font-semibold mb-4">{t("secSkills")}</p>
                <div className="space-y-4">
                  {agent.skills.map((skill) => (
                    <div key={skill.id} className="border border-border rounded-sm p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-base">{skill.name}</p>
                          <p className="text-xs text-muted-foreground">{t("idLabel", { id: skill.id })}</p>
                        </div>
                        {skill.tags && skill.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {skill.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm mb-2">{skill.description}</p>
                      {skill.examples && skill.examples.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-foreground">{t("lblExamples")}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {skill.examples.map((example, idx) => (
                              <Badge key={idx} variant="outline">
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Properties */}
            {agent.supportsAuthenticatedExtendedCard && (
              <div>
                <p className="text-lg font-semibold mb-4">{t("secAdditionalFeatures")}</p>
                <Badge variant="default">{t("supportsAuthExtendedCard")}</Badge>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function ModelHubMcpServerDialog({
  open,
  server,
  onClose,
}: {
  open: boolean;
  server: MCPServerData | null;
  onClose: () => void;
}) {
  const t = useTranslations("modelHub");
  const commonT = useTranslations("common");
  const syntaxTheme = useSyntaxTheme(prism);
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>{server?.server_name || t("mcpServerDetailsTitle")}</DialogTitle>
        </DialogHeader>
        {server && (
          <div className="space-y-6">
            {/* Server Overview */}
            <div>
              <p className="text-lg font-semibold mb-4">{t("secServerOverview")}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-medium">{t("lblServerName")}</p>
                  <p>{server.server_name}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblServerId")}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs truncate min-w-0">{server.server_id}</p>
                    <Copy
                      onClick={() => void copyToClipboard(server.server_id, commonT("copiedToClipboard"))}
                      className="size-3.5 shrink-0 cursor-pointer text-muted-foreground hover:text-info"
                    />
                  </div>
                </div>
                {server.alias && (
                  <div>
                    <p className="font-medium">{t("lblAlias")}</p>
                    <p>{server.alias}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium">{t("lblTransport")}</p>
                  <Badge variant="secondary">{server.transport}</Badge>
                </div>
                <div>
                  <p className="font-medium">{t("lblAuthType")}</p>
                  <Badge variant={server.auth_type === "none" ? "outline" : "default"}>{server.auth_type}</Badge>
                </div>
                <div>
                  <p className="font-medium">{t("lblStatus")}</p>
                  <Badge variant={statusBadgeVariant(server.status)}>{server.status || t("unknownStatus")}</Badge>
                </div>
              </div>
              {server.description && (
                <div className="mt-2">
                  <p className="font-medium">{t("lblDescription")}</p>
                  <p className="mt-1">{server.description}</p>
                </div>
              )}
            </div>

            {/* Connection Details */}
            <div>
              <p className="text-lg font-semibold mb-4">{t("secConnectionDetails")}</p>
              <div className="space-y-2">
                {server.command && (
                  <div>
                    <p className="font-medium">{t("lblCommand")}</p>
                    <p className="text-sm bg-muted p-2 rounded-sm mt-1 font-mono">{server.command}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tools */}
            {server.allowed_tools && server.allowed_tools.length > 0 && (
              <div>
                <p className="text-lg font-semibold mb-4">{t("secAllowedTools")}</p>
                <div className="flex flex-wrap gap-2">
                  {server.allowed_tools.map((tool, idx) => (
                    <Badge key={idx} variant="outline">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Teams */}
            {server.teams && server.teams.length > 0 && (
              <div>
                <p className="text-lg font-semibold mb-4">{t("secTeams")}</p>
                <div className="flex flex-wrap gap-2">
                  {server.teams.map((team, idx) => (
                    <Badge key={idx} variant="secondary">
                      {team}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Access Groups */}
            {server.mcp_access_groups && server.mcp_access_groups.length > 0 && (
              <div>
                <p className="text-lg font-semibold mb-4">{t("secAccessGroups")}</p>
                <div className="flex flex-wrap gap-2">
                  {server.mcp_access_groups.map((group, idx) => (
                    <Badge key={idx} variant="default">
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div>
              <p className="text-lg font-semibold mb-4">{t("secMetadata")}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{t("lblCreatedBy")}</p>
                  <p>{server.created_by}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblUpdatedBy")}</p>
                  <p>{server.updated_by}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblCreatedAt")}</p>
                  <p className="text-sm">{new Date(server.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblUpdatedAt")}</p>
                  <p className="text-sm">{new Date(server.updated_at).toLocaleString()}</p>
                </div>
                {server.last_health_check && (
                  <div>
                    <p className="font-medium">{t("lblLastHealthCheck")}</p>
                    <p className="text-sm">{new Date(server.last_health_check).toLocaleString()}</p>
                  </div>
                )}
              </div>
              {server.health_check_error && (
                <div className="mt-2 p-2 bg-destructive/10 rounded-sm">
                  <p className="font-medium text-destructive">{t("lblHealthCheckError")}</p>
                  <p className="text-sm text-destructive mt-1">{server.health_check_error}</p>
                </div>
              )}
            </div>

            {/* Usage Example */}
            <div>
              <p className="text-lg font-semibold mb-4">{t("secUsageExample")}</p>
              <SyntaxHighlighter language="python" className="text-sm" style={syntaxTheme}>
                {`from fastmcp import Client
import asyncio

# Standard MCP configuration
config = {
  "mcpServers": {
      "${server.server_name}": {
          "url": "${getProxyBaseUrl()}/${server.server_name}/mcp",
          "headers": {
              "x-litellm-api-key": "Bearer <your-master-key>"
          }
      }
  }
}

# Create a client that connects to the server
client = Client(config)

async def main():
  async with client:
      # List available tools
      tools = await client.list_tools()
      print(f"Available tools: {[tool.name for tool in tools]}")

      # Call a tool
      response = await client.call_tool(
          name="tool_name",
          arguments={"arg": "value"}
      )
      print(f"Response: {response}")

if __name__ == "__main__":
  asyncio.run(main())`}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
