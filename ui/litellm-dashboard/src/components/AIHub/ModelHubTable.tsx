import { AgentHubData, getAgentHubTableColumns } from "@/components/AIHub/AgentHubTableColumns";
import type { ModelHubTranslator } from "@/lib/i18n/translators";
import { useTranslations } from "next-intl";
import MakeAgentPublicForm from "@/components/AIHub/forms/MakeAgentPublicForm";
import MakeMCPPublicForm from "@/components/AIHub/forms/MakeMCPPublicForm";
import MakeModelPublicForm from "@/components/AIHub/forms/MakeModelPublicForm";
import { getMCPHubTableColumns, MCPServerData } from "@/components/AIHub/MCPHubTableColumns";
import { getModelHubTableColumns, ModelHubData } from "@/components/AIHub/ModelHubTableColumns";
import UsefulLinksManagement from "@/components/AIHub/UsefulLinksManagement";
import { getClaudeCodePluginsList } from "@/components/networking";
import { Plugin } from "@/components/claude_code_plugins/types";
import SkillHubDashboard from "@/components/AIHub/SkillHubDashboard";
import MakeSkillPublicForm from "@/components/claude_code_plugins/MakeSkillPublicForm";
import { DataTable } from "@/components/shared/DataTable";
import ModelFilters from "@/components/model_filters";
import {
  fetchMCPServers,
  getAgentsList,
  getConfigFieldSetting,
  getProxyBaseUrl,
  getUiPageUrl,
  getUiConfig,
  modelHubCall,
  modelHubPublicModelsCall,
} from "@/components/networking";
import PublicModelHub from "@/components/public_model_hub";
import { copyToClipboard } from "@/utils/dataUtils";
import { isAdminRole, isProxyAdminRole } from "@/utils/roles";
import { filterBySearchTerm } from "@/utils/searchUtils";
import { SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Inbox, Search as SearchIcon, X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useSyntaxTheme } from "@/hooks/useSyntaxTheme";
import { useUISettings } from "@/app/(dashboard)/hooks/uiSettings/useUISettings";
import { checkTokenValidity } from "@/utils/jwtUtils";
import { getCookie } from "@/utils/cookieUtils";
import { getLoginUrl } from "@/utils/returnUrlUtils";
import { DECISIONS_MODE, isDecisionMode } from "@/lib/decisionModels";
import DecisionModelGarden from "@/components/AIHub/DecisionModelGarden";
import { ModelHubAgentDialog, ModelHubMcpServerDialog, ModelHubModelDialog } from "./ModelHubDetailDialogs";

interface ModelHubTableProps {
  accessToken: string | null;
  publicPage: boolean;
  premiumUser: boolean;
  userRole: string | null;
  canOpenPlayground: boolean;
  canAddModels: boolean;
}

function isMCPHubVisibilityDisabled(isLoading: boolean, servers: readonly MCPServerData[] | null): boolean {
  return isLoading || servers === null;
}

function modelTableEmptyState(
  t: ModelHubTranslator,
  models: readonly ModelHubData[],
  showsDecisionGarden: boolean,
  selectedMode: string,
): { title: string; body: string } {
  if (showsDecisionGarden && selectedMode === DECISIONS_MODE && !models.some((model) => isDecisionMode(model.mode))) {
    return { title: t("decisionsEmptyTitle"), body: t("decisionsEmptyBody") };
  }
  return models.length > 0
    ? { title: t("noMatchingModels"), body: t("modelsSearchFilterHint") }
    : { title: t("noModelsAvailable"), body: t("modelsEmptyHint") };
}

function HubEmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
        <Inbox className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="text-sm text-muted-foreground">{body}</div>
    </div>
  );
}

const ModelHubTable: React.FC<ModelHubTableProps> = ({
  accessToken,
  publicPage,
  premiumUser,
  userRole,
  canOpenPlayground,
  canAddModels,
}) => {
  const t = useTranslations("modelHub");
  const commonT = useTranslations("common");
  const syntaxTheme = useSyntaxTheme(prism);
  // Admin Viewer follows the read-parity rule: see the AI Hub catalog, but
  // cannot toggle public visibility (write).
  const canModify = isProxyAdminRole(userRole || "");

  const [publicPageAllowed, setPublicPageAllowed] = useState<boolean>(false);
  const [modelHubData, setModelHubData] = useState<ModelHubData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState<null | ModelHubData>(null);
  const [filteredData, setFilteredData] = useState<ModelHubData[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>("");
  const showDecisionGarden = !publicPage && (selectedMode === "" || selectedMode === DECISIONS_MODE);
  const [isMakePublicModalVisible, setIsMakePublicModalVisible] = useState(false);
  // Agent Hub state
  const [agentHubData, setAgentHubData] = useState<AgentHubData[] | null>(null);
  const [isMakeAgentPublicModalVisible, setIsMakeAgentPublicModalVisible] = useState(false);
  const [agentLoading, setAgentLoading] = useState<boolean>(true);
  const [selectedAgent, setSelectedAgent] = useState<null | AgentHubData>(null);
  const [isAgentModalVisible, setIsAgentModalVisible] = useState(false);
  const [agentSearchTerm, setAgentSearchTerm] = useState("");
  // MCP Hub state
  const [mcpHubData, setMcpHubData] = useState<MCPServerData[] | null>(null);
  const [mcpLoading, setMcpLoading] = useState<boolean>(true);
  const [selectedMcpServer, setSelectedMcpServer] = useState<null | MCPServerData>(null);
  const [isMcpModalVisible, setIsMcpModalVisible] = useState(false);
  const [isMakeMcpPublicModalVisible, setIsMakeMcpPublicModalVisible] = useState(false);
  // Skill Hub state
  const [skillHubData, setSkillHubData] = useState<Plugin[]>([]);
  const [skillLoading, setSkillLoading] = useState<boolean>(false);
  const [isMakeSkillPublicModalVisible, setIsMakeSkillPublicModalVisible] = useState(false);
  const { data: uiSettings, isLoading: isUISettingsLoading } = useUISettings();

  // Check authentication requirement for public AI Hub
  useEffect(() => {
    // Only check when UI settings are loaded and this is a public page
    if (isUISettingsLoading || !publicPage) {
      return;
    }

    const requireAuth = uiSettings?.values?.require_auth_for_public_ai_hub;

    // If require_auth_for_public_ai_hub is true, verify token
    if (requireAuth === true) {
      const token = getCookie("token");
      const isTokenValid = checkTokenValidity(token);

      // If token is invalid, redirect to login
      if (!isTokenValid) {
        window.location.replace(getUiPageUrl(getLoginUrl(getProxyBaseUrl())));
        return;
      }
    }
    // If require_auth_for_public_ai_hub is false, allow public access (no change)
  }, [isUISettingsLoading, publicPage, uiSettings]);

  useEffect(() => {
    const fetchData = async (accessToken: string) => {
      try {
        setLoading(true);
        const _modelHubData = await modelHubCall(accessToken);
        setModelHubData(_modelHubData.data);

        getConfigFieldSetting(accessToken, "enable_public_model_hub")
          .then((data) => {
            if (data.field_value == true) {
              setPublicPageAllowed(true);
            }
          })
          .catch((error) => {
            // do nothing
          });
      } catch (error) {
        console.error("There was an error fetching the model data", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPublicData = async () => {
      try {
        setLoading(true);
        await getUiConfig();
        const _modelHubData = await modelHubPublicModelsCall();
        setModelHubData(_modelHubData);
        setPublicPageAllowed(true);
      } catch (error) {
        console.error("There was an error fetching the public model data", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchModelData = async () => {
      if (accessToken) {
        await fetchData(accessToken);
      } else if (publicPage) {
        await fetchPublicData();
      } else {
        setLoading(false);
      }
    };
    fetchModelData();
  }, [accessToken, publicPage]);

  // Fetch Agent Hub data
  useEffect(() => {
    const fetchAgentData = async () => {
      if (!accessToken) {
        setAgentLoading(false);
        return;
      }

      try {
        setAgentLoading(true);
        const response = await getAgentsList(accessToken);
        const agents = response.agents;
        const agent_card_list = agents.map((agent: any) => ({
          agent_id: agent.agent_id,
          ...agent.agent_card_params,
          is_public: agent.litellm_params.is_public,
        }));
        setAgentHubData(agent_card_list);
      } catch (error) {
        console.error("There was an error fetching the agent data", error);
      } finally {
        setAgentLoading(false);
      }
    };

    if (!publicPage) {
      fetchAgentData();
    }
  }, [publicPage, accessToken]);

  // Fetch MCP Hub data
  useEffect(() => {
    const fetchMcpData = async () => {
      if (!accessToken) {
        setMcpLoading(false);
        return;
      }

      try {
        setMcpLoading(true);
        const response = await fetchMCPServers(accessToken);
        setMcpHubData(response);
      } catch (error) {
        console.error("There was an error fetching the MCP server data", error);
      } finally {
        setMcpLoading(false);
      }
    };

    if (!publicPage) {
      fetchMcpData();
    }
  }, [publicPage, accessToken]);

  // Fetch Skill Hub data — all skills for admins, enabled-only for public page
  useEffect(() => {
    const fetchSkillData = async () => {
      if (!accessToken) return;
      try {
        setSkillLoading(true);
        const enabledOnly = publicPage === true;
        const response = await getClaudeCodePluginsList(accessToken, enabledOnly);
        setSkillHubData(response.plugins);
      } catch (error) {
        console.error("Error fetching skill hub data", error);
      } finally {
        setSkillLoading(false);
      }
    };

    fetchSkillData();
  }, [accessToken, publicPage]);

  const showModal = useCallback((model: ModelHubData) => {
    setSelectedModel(model);
    setIsModalVisible(true);
  }, []);

  const showAgentModal = useCallback((agent: AgentHubData) => {
    setSelectedAgent(agent);
    setIsAgentModalVisible(true);
  }, []);

  const showMcpModal = useCallback((server: MCPServerData) => {
    setSelectedMcpServer(server);
    setIsMcpModalVisible(true);
  }, []);

  const handleMakePublicPage = () => {
    if (!accessToken) {
      return;
    }

    // Show the modal for selecting models to make public
    setIsMakePublicModalVisible(true);
  };

  const handleMakeAgentPublicPage = () => {
    if (!accessToken) {
      return;
    }

    // Show the modal for selecting agents to make public
    setIsMakeAgentPublicModalVisible(true);
  };

  const handleMakeMcpPublicPage = () => {
    if (!accessToken) {
      return;
    }

    // Show the modal for selecting MCP servers to make public
    setIsMakeMcpPublicModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedModel(null);
    setIsAgentModalVisible(false);
    setSelectedAgent(null);
    setIsMcpModalVisible(false);
    setSelectedMcpServer(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedModel(null);
    setIsAgentModalVisible(false);
    setSelectedAgent(null);
    setIsMcpModalVisible(false);
    setSelectedMcpServer(null);
  };

  const formatCapabilityName = (key: string) => {
    // Remove 'supports_' prefix and convert snake_case to Title Case
    return key
      .replace(/^supports_/, "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getModelCapabilities = (model: ModelHubData) => {
    // Find all properties that start with 'supports_' and are true
    return Object.entries(model)
      .filter(([key, value]) => key.startsWith("supports_") && value === true)
      .map(([key]) => key);
  };

  const formatCost = (cost: number) => {
    return `$${(cost * 1_000_000).toFixed(2)}`;
  };

  const handleMakePublicSuccess = () => {
    // Refresh the model hub data after successful public operation
    if (accessToken) {
      const fetchData = async () => {
        try {
          const _modelHubData = await modelHubCall(accessToken);
          setModelHubData(_modelHubData.data);
        } catch (error) {
          console.error("Error refreshing model data:", error);
        }
      };
      fetchData();
    }
  };

  const handleMakeAgentPublicSuccess = () => {
    // Refresh the agent hub data after successful public operation
    if (accessToken) {
      const fetchAgentData = async () => {
        try {
          const response = await getAgentsList(accessToken);
          const agents = response.agents;
          const agent_card_list = agents.map((agent: any) => ({
            agent_id: agent.agent_id,
            ...agent.agent_card_params,
            is_public: agent.is_public,
          }));
          setAgentHubData(agent_card_list);
        } catch (error) {
          console.error("Error refreshing agent data:", error);
        }
      };
      fetchAgentData();
    }
  };

  const handleMakeMcpPublicSuccess = () => {
    // Refresh the MCP hub data after successful public operation
    if (accessToken) {
      const fetchMcpData = async () => {
        try {
          setMcpLoading(true);
          const response = await fetchMCPServers(accessToken);
          setMcpHubData(response);
        } catch (error) {
          setMcpHubData(null);
          console.error("Error refreshing MCP server data:", error);
        } finally {
          setMcpLoading(false);
        }
      };
      fetchMcpData();
    }
  };

  const handleFilteredDataChange = useCallback((newFilteredData: ModelHubData[]) => {
    setFilteredData(newFilteredData);
  }, []);

  const [modelSorting, setModelSorting] = useState<SortingState>([{ id: "model_group", desc: false }]);
  const [agentSorting, setAgentSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [mcpSorting, setMcpSorting] = useState<SortingState>([{ id: "server_name", desc: false }]);

  const modelColumns = useMemo(() => getModelHubTableColumns({ onModelClick: showModal, t, commonT }), [showModal]);
  const agentColumns = useMemo(() => getAgentHubTableColumns({ onAgentClick: showAgentModal, t }), [showAgentModal]);
  const filteredAgentData = useMemo(
    () => filterBySearchTerm(agentHubData ?? [], agentSearchTerm, (agent) => [agent.name, agent.description]),
    [agentHubData, agentSearchTerm],
  );
  const mcpColumns = useMemo(() => getMCPHubTableColumns({ onServerClick: showMcpModal, t, commonT }), [showMcpModal]);

  // If this is a public page, use the dedicated PublicModelHub component
  if (publicPage && publicPageAllowed) {
    return <PublicModelHub accessToken={accessToken} />;
  }

  return (
    <div className="mx-4">
      {publicPage == false ? (
        <div className="w-full m-2 mt-2 p-8">
          {/* Header with Title, Description and URL */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col items-start">
              <h2 className="text-center text-xl font-semibold">{t("pageTitle")}</h2>
              {isAdminRole(userRole || "") ? (
                <p className="text-sm text-muted-foreground">{t("adminSubtitle")}</p>
              ) : (
                <p className="text-sm text-muted-foreground">{t("userSubtitle")}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <p>{t("publicUrlLabel")}</p>
              <div className="flex items-center bg-border px-2 py-1 rounded-sm">
                <p className="mr-2">{getUiPageUrl(`${getProxyBaseUrl()}/ui/model_hub_table`)}</p>
                <button
                  onClick={() =>
                    void copyToClipboard(
                      getUiPageUrl(`${getProxyBaseUrl()}/ui/model_hub_table`),
                      commonT("copiedToClipboard"),
                    )
                  }
                  className="p-1 hover:bg-accent rounded-sm transition-colors"
                  title={t("copyUrl")}
                >
                  <Copy size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Useful Links Management Section for Admins */}
          {canModify && (
            <div className="mt-8 mb-2">
              <UsefulLinksManagement accessToken={accessToken} userRole={userRole} />
            </div>
          )}

          {/* Tab System for Model Hub, Agent Hub, MCP Hub, and Plugin Marketplace */}
          <Tabs defaultValue="models">
            <TabsList variant="line" className="mb-4 h-auto w-full justify-start rounded-none border-b p-0">
              <TabsTrigger value="models" className="flex-none rounded-none px-4 py-2">
                {t("tabModels")}
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex-none rounded-none px-4 py-2">
                {t("tabAgents")}
              </TabsTrigger>
              <TabsTrigger value="mcp" className="flex-none rounded-none px-4 py-2">
                {t("tabMcp")}
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex-none rounded-none px-4 py-2">
                {t("tabSkills")}
              </TabsTrigger>
            </TabsList>

            <div>
              {/* Model Hub Tab */}
              <TabsContent value="models" keepMounted>
                {/* Model Filters and Table */}
                <Card className="px-6">
                  {/* Header with Make Public Button */}
                  {publicPage == false && canModify && (
                    <div className="flex justify-end mb-4">
                      <Button onClick={() => handleMakePublicPage()}>{t("selectModelsToMakePublic")}</Button>
                    </div>
                  )}

                  {/* Filters */}
                  <ModelFilters
                    modelHubData={modelHubData || []}
                    onFilteredDataChange={handleFilteredDataChange}
                    extraModes={publicPage ? [] : [DECISIONS_MODE]}
                    onModeChange={setSelectedMode}
                  />

                  {/* Model Table */}
                  <DataTable
                    data={filteredData}
                    paginationMode="client"
                    columns={modelColumns}
                    getRowId={(model, index) => model.model_group || String(index)}
                    sortingMode="client"
                    sorting={modelSorting}
                    onSortingChange={setModelSorting}
                    isLoading={loading}
                    loadingMessage={t("loadingModels")}
                    noDataMessage={
                      <HubEmptyState
                        {...modelTableEmptyState(t, modelHubData ?? [], showDecisionGarden, selectedMode)}
                      />
                    }
                    size="compact"
                  />
                </Card>

                <div className="mt-4 text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {t("showingModels", { shown: filteredData.length, total: modelHubData?.length || 0 })}
                  </p>
                </div>

                {showDecisionGarden && <DecisionModelGarden accessToken={accessToken} canAddModels={canAddModels} />}
              </TabsContent>

              {/* Agent Hub Tab */}
              <TabsContent value="agents" keepMounted>
                <Card className="px-6">
                  {/* Header with Make Public Button */}
                  {publicPage == false && canModify && (
                    <div className="flex justify-end mb-4">
                      <Button onClick={() => handleMakeAgentPublicPage()}>{t("selectAgentsToMakePublic")}</Button>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">{t("searchAgentsLabel")}</p>
                    <InputGroup className="max-w-sm">
                      <InputGroupAddon>
                        <SearchIcon className="size-4 text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder={t("searchAgentsPlaceholder")}
                        value={agentSearchTerm}
                        onChange={(e) => setAgentSearchTerm(e.target.value)}
                      />
                      {agentSearchTerm && (
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            size="icon-xs"
                            aria-label={t("clearSearch")}
                            onClick={() => setAgentSearchTerm("")}
                          >
                            <X />
                          </InputGroupButton>
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                  </div>

                  {/* Agent Table */}
                  <DataTable
                    data={filteredAgentData}
                    paginationMode="client"
                    columns={agentColumns}
                    getRowId={(agent, index) => agent.agent_id || agent.name || String(index)}
                    sortingMode="client"
                    sorting={agentSorting}
                    onSortingChange={setAgentSorting}
                    isLoading={agentLoading}
                    loadingMessage={t("loadingAgents")}
                    noDataMessage={
                      <HubEmptyState
                        title={agentHubData?.length ? t("noMatchingAgents") : t("noAgentsYet")}
                        body={agentHubData?.length ? t("agentsSkillFilterHint") : t("agentsEmptyHint")}
                      />
                    }
                    size="compact"
                  />
                </Card>

                <div className="mt-4 text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {t("showingAgents", { shown: filteredAgentData.length, total: agentHubData?.length || 0 })}
                  </p>
                </div>
              </TabsContent>

              {/* MCP Hub Tab */}
              <TabsContent value="mcp" keepMounted>
                <Card className="px-6">
                  {/* Header with Make Public Button */}
                  {publicPage == false && canModify && (
                    <div className="flex justify-end mb-4">
                      <Button
                        onClick={() => handleMakeMcpPublicPage()}
                        disabled={isMCPHubVisibilityDisabled(mcpLoading, mcpHubData)}
                      >
                        {t("manageMcpHubVisibility")}
                      </Button>
                    </div>
                  )}

                  {/* MCP Server Table */}
                  <DataTable
                    data={mcpHubData || []}
                    paginationMode="client"
                    columns={mcpColumns}
                    getRowId={(server, index) => server.server_id || String(index)}
                    sortingMode="client"
                    sorting={mcpSorting}
                    onSortingChange={setMcpSorting}
                    isLoading={mcpLoading}
                    loadingMessage={t("loadingMcpServers")}
                    noDataMessage={<HubEmptyState title={t("noMcpTitle")} body={t("noMcpBody")} />}
                    size="compact"
                  />
                </Card>

                <div className="mt-4 text-center space-y-2">
                  <p className="text-sm text-muted-foreground">{t("mcpCount", { count: mcpHubData?.length || 0 })}</p>
                </div>
              </TabsContent>

              {/* Skill Hub Tab */}
              <TabsContent value="skills" keepMounted>
                {publicPage == false && canModify && (
                  <div className="flex justify-end mb-4">
                    <Button onClick={() => setIsMakeSkillPublicModalVisible(true)}>{t("selectSkillsPublic")}</Button>
                  </div>
                )}
                <SkillHubDashboard
                  skills={skillHubData}
                  isLoading={skillLoading}
                  isAdmin={canModify}
                  accessToken={accessToken}
                  publicPage={publicPage}
                  onPublishSuccess={async () => {
                    const response = await getClaudeCodePluginsList(accessToken || "", publicPage);
                    setSkillHubData(response.plugins);
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      ) : (
        <Card className="mx-auto max-w-xl mt-10 px-6">
          <p className="text-xl text-center mb-2 text-foreground">{t("hubDisabledTitle")}</p>
          <p className="text-base text-center text-foreground">{t("hubDisabledHint")}</p>
        </Card>
      )}

      {/* Model Details Modal */}
      <ModelHubModelDialog
        open={isModalVisible}
        model={selectedModel}
        onClose={handleCancel}
        canOpenPlayground={canOpenPlayground}
      />

      {/* Agent Details Modal */}
      <ModelHubAgentDialog open={isAgentModalVisible} agent={selectedAgent} onClose={handleCancel} />

      {/* MCP Server Details Modal */}
      <ModelHubMcpServerDialog open={isMcpModalVisible} server={selectedMcpServer} onClose={handleCancel} />

      {/* Make Model Public Form */}
      <MakeModelPublicForm
        visible={isMakePublicModalVisible}
        onClose={() => setIsMakePublicModalVisible(false)}
        accessToken={accessToken || ""}
        modelHubData={modelHubData || []}
        onSuccess={handleMakePublicSuccess}
      />

      {/* Make Agent Public Form */}
      <MakeAgentPublicForm
        visible={isMakeAgentPublicModalVisible}
        onClose={() => setIsMakeAgentPublicModalVisible(false)}
        accessToken={accessToken || ""}
        agentHubData={agentHubData || []}
        onSuccess={handleMakeAgentPublicSuccess}
      />

      {/* Make MCP Public Form */}
      <MakeMCPPublicForm
        visible={isMakeMcpPublicModalVisible}
        onClose={() => setIsMakeMcpPublicModalVisible(false)}
        accessToken={accessToken || ""}
        mcpHubData={mcpHubData || []}
        onSuccess={handleMakeMcpPublicSuccess}
      />

      {/* Make Skill Public Form */}
      <MakeSkillPublicForm
        visible={isMakeSkillPublicModalVisible}
        onClose={() => setIsMakeSkillPublicModalVisible(false)}
        accessToken={accessToken || ""}
        skillsList={skillHubData}
        onSuccess={async () => {
          const response = await getClaudeCodePluginsList(accessToken || "", publicPage === true);
          setSkillHubData(response.plugins);
        }}
      />
    </div>
  );
};

export default ModelHubTable;
