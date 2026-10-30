import { ThemeProvider } from "@/contexts/ThemeContext";
import { ExternalLinkIcon, SearchIcon } from "@heroicons/react/outline";
import { SortingState } from "@tanstack/react-table";
import { Inbox, Info } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MultiSelect } from "./shared/MultiSelect";
import { featureLabel } from "./publicModelHub/publicModelHubFilters";
import { usePublicModelHubFacets } from "./publicModelHub/usePublicModelHubFacets";
import { usePublicModelHubList } from "./publicModelHub/usePublicModelHubList";
import { DataTable } from "./shared/DataTable";
import { toast } from "@/lib/toast";
import Navbar from "./navbar";
import {
  agentHubPublicModelsCall,
  skillHubPublicCall,
  getPublicModelHubInfo,
  getUiConfig,
  mcpHubPublicServersCall,
} from "./networking";
import { Plugin } from "./claude_code_plugins/types";
import SkillHubDashboard from "./AIHub/SkillHubDashboard";
import {
  AgentCard,
  MCPServerData,
  ModelGroupInfo,
  getPublicAgentHubColumns,
  getPublicMCPHubColumns,
  getPublicModelHubColumns,
} from "./PublicModelHubTableColumns";
import { getProviderLogoAndName } from "./provider_info_helpers";
import { displayMode } from "@/lib/decisionModels";
import { filterBySearchTerm, rankBySearchRelevance } from "@/utils/searchUtils";
import { PublicMcpServerDialog } from "@/components/public_hub/PublicMcpServerDialog";
import { PublicAgentDialog } from "@/components/public_hub/PublicAgentDialog";
import { PublicModelDialog } from "@/components/public_hub/PublicModelDialog";

interface PublicModelHubProps {
  accessToken?: string | null;
  isEmbedded?: boolean; // When true, hides navbar and adjusts layout for embedding in dashboard
}

function PublicHubEmptyState({ title, body }: { title: string; body: string }) {
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

const PublicModelHub: React.FC<PublicModelHubProps> = ({ accessToken, isEmbedded = false }) => {
  const t = useTranslations("modelHub");
  const anchor = useComboboxAnchor();
  const [proxyConfigured, setProxyConfigured] = useState<boolean>(false);
  const [agentHubData, setAgentHubData] = useState<AgentCard[] | null>(null);
  const [mcpHubData, setMcpHubData] = useState<MCPServerData[] | null>(null);
  const [pageTitle, setPageTitle] = useState<string>("LiteLLM Gateway");
  const [customDocsDescription, setCustomDocsDescription] = useState<string | null>(null);
  const [litellmVersion, setLitellmVersion] = useState<string>("");
  const [usefulLinks, setUsefulLinks] = useState<Record<string, string | { url: string; index: number }>>({});
  const [agentLoading, setAgentLoading] = useState<boolean>(true);
  const [mcpLoading, setMcpLoading] = useState<boolean>(true);
  const [agentSearchTerm, setAgentSearchTerm] = useState<string>("");
  const [mcpSearchTerm, setMcpSearchTerm] = useState<string>("");
  const [selectedAgentSkills, setSelectedAgentSkills] = useState<string[]>([]);
  const [selectedMcpTransports, setSelectedMcpTransports] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAgentModalVisible, setIsAgentModalVisible] = useState(false);
  const [isMcpModalVisible, setIsMcpModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState<null | ModelGroupInfo>(null);
  const [selectedAgent, setSelectedAgent] = useState<null | AgentCard>(null);
  const [selectedMcpServer, setSelectedMcpServer] = useState<null | MCPServerData>(null);
  const [activeTab, setActiveTab] = useState<string>("models");
  const [skillHubData, setSkillHubData] = useState<Plugin[]>([]);
  const [skillLoading, setSkillLoading] = useState<boolean>(false);

  useEffect(() => {
    const initializeAndFetch = async () => {
      // Initialize proxyBaseUrl first to ensure it includes the server root path
      try {
        await getUiConfig();
      } catch (error) {
        console.error("Failed to get UI config:", error);
        // Continue anyway - might work with default proxyBaseUrl
      }
      setProxyConfigured(true);

      const fetchAgentData = async () => {
        try {
          setAgentLoading(true);
          const _agentHubData = await agentHubPublicModelsCall();
          setAgentHubData(Array.isArray(_agentHubData) ? _agentHubData : []);
        } catch (error) {
          console.error("There was an error fetching the public agent data", error);
        } finally {
          setAgentLoading(false);
        }
      };

      const fetchMcpData = async () => {
        try {
          setMcpLoading(true);
          const _mcpHubData = await mcpHubPublicServersCall();
          setMcpHubData(Array.isArray(_mcpHubData) ? _mcpHubData : []);
        } catch (error) {
          console.error("There was an error fetching the public MCP server data", error);
        } finally {
          setMcpLoading(false);
        }
      };

      const fetchPublicModelHubInfo = async () => {
        const publicModelHubInfo = await getPublicModelHubInfo();
        setPageTitle(publicModelHubInfo.docs_title);
        setCustomDocsDescription(publicModelHubInfo.custom_docs_description);
        setLitellmVersion(publicModelHubInfo.litellm_version);
        setUsefulLinks(publicModelHubInfo.useful_links || {});
      };

      const fetchSkillData = async () => {
        try {
          setSkillLoading(true);
          const response = await skillHubPublicCall();
          setSkillHubData(response.plugins ?? []);
        } catch (error) {
          console.error("There was an error fetching the public skill data", error);
        } finally {
          setSkillLoading(false);
        }
      };

      fetchPublicModelHubInfo();

      fetchAgentData();
      fetchMcpData();
      fetchSkillData();
    };

    initializeAndFetch();
  }, []);

  const getUniqueAgentSkills = (data: AgentCard[]) => {
    const skills = new Set<string>();
    data.forEach((agent) => {
      agent.skills?.forEach((skill) => {
        skill.tags?.forEach((tag) => skills.add(tag));
      });
    });
    return Array.from(skills).sort();
  };

  const getUniqueMcpTransports = (data: MCPServerData[]) => {
    const transports = new Set<string>();
    data.forEach((server) => {
      if (server.transport) transports.add(server.transport);
    });
    return Array.from(transports).sort();
  };

  const filteredAgentData = useMemo(() => {
    if (!agentHubData || !Array.isArray(agentHubData)) return [];

    const searchResults = rankBySearchRelevance(
      filterBySearchTerm(agentHubData, agentSearchTerm, (agent) => [agent.name, agent.description]),
      agentSearchTerm,
      (agent) => agent.name,
    );

    // Apply skill filters
    return searchResults.filter((agent) => {
      const matchesSkill =
        selectedAgentSkills.length === 0 ||
        agent.skills?.some((skill) => skill.tags?.some((tag) => selectedAgentSkills.includes(tag)));

      return matchesSkill;
    });
  }, [agentHubData, agentSearchTerm, selectedAgentSkills]);

  const filteredMcpData = useMemo(() => {
    if (!mcpHubData || !Array.isArray(mcpHubData)) return [];

    const searchResults = rankBySearchRelevance(
      filterBySearchTerm(mcpHubData, mcpSearchTerm, (server) => [server.server_name, server.mcp_info?.description]),
      mcpSearchTerm,
      (server) => server.server_name,
    );

    // Apply transport filters
    return searchResults.filter((server) => {
      const matchesTransport = selectedMcpTransports.length === 0 || selectedMcpTransports.includes(server.transport);

      return matchesTransport;
    });
  }, [mcpHubData, mcpSearchTerm, selectedMcpTransports]);

  const showModal = useCallback((model: ModelGroupInfo) => {
    setSelectedModel(model);
    setIsModalVisible(true);
  }, []);

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedModel(null);
  };

  const showAgentModal = useCallback((agent: AgentCard) => {
    setSelectedAgent(agent);
    setIsAgentModalVisible(true);
  }, []);

  const handleAgentModalCancel = () => {
    setIsAgentModalVisible(false);
    setSelectedAgent(null);
  };

  const showMcpModal = useCallback((server: MCPServerData) => {
    setSelectedMcpServer(server);
    setIsMcpModalVisible(true);
  }, []);

  const handleMcpModalCancel = () => {
    setIsMcpModalVisible(false);
    setSelectedMcpServer(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("copiedToClipboard"));
  };

  const models = usePublicModelHubList(proxyConfigured);
  const modelFacets = usePublicModelHubFacets(proxyConfigured);
  const modeOptions = useMemo(
    () =>
      [...new Set(modelFacets.modes.flatMap((mode) => displayMode(mode) ?? []))].map((mode) => ({
        label: mode,
        value: mode,
      })),
    [modelFacets],
  );
  const featureOptions = useMemo(
    () => modelFacets.features.map((feature) => ({ label: featureLabel(feature), value: feature })),
    [modelFacets],
  );
  const serviceStatus = models.error ? t("serviceUnavailable") : t("serviceAlive");
  const [agentSorting, setAgentSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [mcpSorting, setMcpSorting] = useState<SortingState>([{ id: "server_name", desc: false }]);

  const modelColumns = useMemo(() => getPublicModelHubColumns({ onModelClick: showModal }, t), [showModal, t]);
  const agentColumns = useMemo(
    () => getPublicAgentHubColumns({ onAgentClick: showAgentModal }, t),
    [showAgentModal, t],
  );
  const mcpColumns = useMemo(() => getPublicMCPHubColumns({ onServerClick: showMcpModal }, t), [showMcpModal, t]);

  const hasAgents = Array.isArray(agentHubData) && agentHubData.length > 0;
  const hasMcpServers = Array.isArray(mcpHubData) && mcpHubData.length > 0;

  const agentSkillOptions = useMemo(
    () =>
      Array.isArray(agentHubData)
        ? getUniqueAgentSkills(agentHubData).map((skill) => ({ label: skill, value: skill }))
        : [],
    [agentHubData],
  );
  const mcpTransportOptions = useMemo(
    () =>
      Array.isArray(mcpHubData)
        ? getUniqueMcpTransports(mcpHubData).map((transport) => ({ label: transport, value: transport }))
        : [],
    [mcpHubData],
  );

  return (
    <ThemeProvider accessToken={accessToken}>
      <TooltipProvider>
        <div className={isEmbedded ? "w-full" : "min-h-screen bg-card"}>
          {/* Navigation - only show when not embedded */}
          {!isEmbedded && <Navbar accessToken={accessToken || null} isPublicPage={true} />}

          <div className={isEmbedded ? "w-full p-6" : "w-full px-8 py-12"}>
            {/* Embedded Explainer - only shown when embedded in dashboard */}
            {isEmbedded && (
              <div className="mb-6 p-4 bg-info/10 border border-info/20 rounded-lg">
                <p className="text-sm text-foreground">{t("embeddedExplainer")}</p>
              </div>
            )}

            {/* About Section - only shown when not embedded */}
            {!isEmbedded && (
              <Card className="mb-10 p-8 bg-card border border-border rounded-lg shadow-xs">
                <h2 className="text-2xl font-semibold mb-6 text-foreground">{t("aboutTitle")}</h2>
                <p className="text-foreground mb-6 text-base leading-relaxed">
                  {customDocsDescription ?? t("defaultDocsDescription")}
                </p>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <span className="w-4 h-4 mr-2">🔧</span>
                    {t("builtWithLitellm", { version: `v${litellmVersion}` })}
                  </span>
                </div>
              </Card>
            )}

            {/* Useful Links - only shown when not embedded */}
            {usefulLinks && Object.keys(usefulLinks).length > 0 && (
              <Card className="mb-10 p-8 bg-card border border-border rounded-lg shadow-xs">
                <h2 className="text-2xl font-semibold mb-6 text-foreground">{t("usefulLinksTitle")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(usefulLinks || {})
                    .map(([title, value]) => {
                      // Handle both old format (string) and new format ({url, index})
                      const url = typeof value === "string" ? value : value.url;
                      const index = typeof value === "string" ? 0 : value.index ?? 0;
                      return { title, url, index };
                    })
                    .sort((a, b) => a.index - b.index)
                    .map(({ title, url }) => (
                      <button
                        key={title}
                        onClick={() => window.open(url, "_blank")}
                        className="flex min-w-0 items-center space-x-3 text-info transition-colors p-3 rounded-lg hover:bg-info/10 border border-border"
                      >
                        <ExternalLinkIcon className="w-4 h-4 shrink-0" />
                        <p className="text-sm font-medium break-words">{title}</p>
                      </button>
                    ))}
                </div>
              </Card>
            )}

            {/* Health and Endpoint Status - only shown when not embedded */}
            {!isEmbedded && (
              <Card className="mb-10 p-8 bg-card border border-border rounded-lg shadow-xs">
                <h2 className="text-2xl font-semibold mb-6 text-foreground">{t("healthSectionTitle")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <p className="text-success font-medium text-sm">
                    {t("serviceStatusLabel", { status: serviceStatus })}
                  </p>
                </div>
              </Card>
            )}

            {/* Tabs for Models and Agents */}
            <Card className="p-8 bg-card border border-border rounded-lg shadow-xs">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="public-hub-tabs">
                <TabsList>
                  <TabsTrigger value="models">{t("tabModels")}</TabsTrigger>
                  {hasAgents && <TabsTrigger value="agents">{t("tabAgents")}</TabsTrigger>}
                  {hasMcpServers && <TabsTrigger value="mcp">{t("tabMcp")}</TabsTrigger>}
                  <TabsTrigger value="skills">{t("tabSkills")}</TabsTrigger>
                </TabsList>

                {/* Models Tab */}
                <TabsContent value="models">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-foreground">{t("availableModelsTitle")}</h2>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 p-6 bg-muted rounded-lg border border-border">
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <p className="text-sm font-medium text-foreground">{t("searchModelsLabel")}</p>
                        <Tooltip>
                          <TooltipTrigger render={<Info className="w-4 h-4 text-muted-foreground cursor-help" />} />
                          <TooltipContent side="top">{t("modelsSearchTooltip")}</TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="relative">
                        <SearchIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder={t("searchModelsPlaceholder")}
                          aria-label={t("modelsSearchAria")}
                          value={models.searchValue}
                          onChange={(e) => models.onSearchChange(e.target.value)}
                          className="border border-border rounded-lg pl-10 pr-4 py-2 w-full text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-transparent bg-card"
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium mb-3 text-foreground">{t("lblProvider")}</p>
                      <Combobox
                        multiple
                        items={modelFacets.providers}
                        value={models.providerValues}
                        onValueChange={models.onProvidersChange}
                      >
                        <ComboboxChips render={<div ref={anchor} />} className="min-h-8 w-full py-1 text-sm">
                          <ComboboxValue>
                            {(values: string[]) =>
                              values.map((provider) => (
                                <ComboboxChip key={provider} aria-label={provider}>
                                  {provider}
                                </ComboboxChip>
                              ))
                            }
                          </ComboboxValue>
                          <ComboboxChipsInput
                            placeholder={t("selectProvidersPlaceholder")}
                            aria-label={t("selectProvidersPlaceholder")}
                            className="min-w-24"
                          />
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                          <ComboboxEmpty>{t("noProvidersFound")}</ComboboxEmpty>
                          <ComboboxList>
                            {(provider: string) => {
                              const { logo } = getProviderLogoAndName(provider);
                              return (
                                <ComboboxItem key={provider} value={provider}>
                                  <span className="flex min-w-0 items-center space-x-2">
                                    {logo && (
                                      <img
                                        src={logo}
                                        alt={provider}
                                        className="w-5 h-5 shrink-0 object-contain"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                      />
                                    )}
                                    <span className="capitalize break-words">{provider}</span>
                                  </span>
                                </ComboboxItem>
                              );
                            }}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium mb-3 text-foreground">{t("lblMode")}</p>
                      <MultiSelect
                        options={modeOptions}
                        value={models.modeValues}
                        onValueChange={models.onModesChange}
                        placeholder={t("selectModesPlaceholder")}
                        className="w-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium mb-3 text-foreground">{t("lblFeatures")}</p>
                      <MultiSelect
                        options={featureOptions}
                        value={models.featureValues}
                        onValueChange={models.onFeaturesChange}
                        placeholder={t("selectFeaturesPlaceholder")}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <DataTable
                    data={models.rows}
                    columns={modelColumns}
                    getRowId={(model, index) => model.model_group || String(index)}
                    sortingMode="server"
                    sorting={models.sorting}
                    onSortingChange={models.onSortingChange}
                    paginationMode="server"
                    pagination={models.pagination}
                    onPaginationChange={models.onPaginationChange}
                    rowCount={models.rowCount}
                    isLoading={models.isLoading}
                    loadingMessage={t("loadingModels")}
                    noDataMessage={
                      <PublicHubEmptyState
                        title={models.hasActiveQuery ? t("noMatchingModels") : t("noModelsAvailable")}
                        body={models.hasActiveQuery ? t("modelsSearchFilterHint") : t("publicModelsEmptyHint")}
                      />
                    }
                    size="compact"
                  />
                </TabsContent>

                {/* Agents Tab */}
                {hasAgents && (
                  <TabsContent value="agents">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-semibold text-foreground">{t("availableAgentsTitle")}</h2>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-muted rounded-lg border border-border">
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <p className="text-sm font-medium text-foreground">{t("searchAgentsLabel")}</p>
                          <Tooltip>
                            <TooltipTrigger render={<Info className="w-4 h-4 text-muted-foreground cursor-help" />} />
                            <TooltipContent side="top">{t("agentsSearchTooltip")}</TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <SearchIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder={t("searchAgentsPlaceholder")}
                            value={agentSearchTerm}
                            onChange={(e) => setAgentSearchTerm(e.target.value)}
                            className="border border-border rounded-lg pl-10 pr-4 py-2 w-full text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-transparent bg-card"
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium mb-3 text-foreground">{t("skillsFilterLabel")}</p>
                        <MultiSelect
                          options={agentSkillOptions}
                          value={selectedAgentSkills}
                          onValueChange={setSelectedAgentSkills}
                          placeholder={t("selectSkillsPlaceholder")}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <DataTable
                      data={filteredAgentData}
                      paginationMode="client"
                      columns={agentColumns}
                      getRowId={(agent, index) => agent.name || String(index)}
                      sortingMode="client"
                      sorting={agentSorting}
                      onSortingChange={setAgentSorting}
                      isLoading={agentLoading}
                      loadingMessage={t("loadingAgents")}
                      noDataMessage={
                        <PublicHubEmptyState title={t("noMatchingAgents")} body={t("agentsSkillFilterHint")} />
                      }
                      size="compact"
                    />

                    <div className="mt-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        {t("showingAgents", { shown: filteredAgentData.length, total: agentHubData?.length || 0 })}
                      </p>
                    </div>
                  </TabsContent>
                )}

                {/* MCP Servers Tab */}
                {hasMcpServers && (
                  <TabsContent value="mcp">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-semibold text-foreground">{t("availableMcpServersTitle")}</h2>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-muted rounded-lg border border-border">
                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <p className="text-sm font-medium text-foreground">{t("searchMcpLabel")}</p>
                          <Tooltip>
                            <TooltipTrigger render={<Info className="w-4 h-4 text-muted-foreground cursor-help" />} />
                            <TooltipContent side="top">{t("searchMcpTooltip")}</TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <SearchIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder={t("searchMcpPlaceholder")}
                            value={mcpSearchTerm}
                            onChange={(e) => setMcpSearchTerm(e.target.value)}
                            className="border border-border rounded-lg pl-10 pr-4 py-2 w-full text-sm focus:outline-hidden focus:ring-2 focus:ring-ring focus:border-transparent bg-card"
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium mb-3 text-foreground">{t("lblTransport")}</p>
                        <MultiSelect
                          options={mcpTransportOptions}
                          value={selectedMcpTransports}
                          onValueChange={setSelectedMcpTransports}
                          placeholder={t("selectTransportPlaceholder")}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <DataTable
                      data={filteredMcpData}
                      paginationMode="client"
                      columns={mcpColumns}
                      getRowId={(server, index) => server.server_id || String(index)}
                      sortingMode="client"
                      sorting={mcpSorting}
                      onSortingChange={setMcpSorting}
                      isLoading={mcpLoading}
                      loadingMessage={t("loadingMcpServers")}
                      noDataMessage={
                        <PublicHubEmptyState title={t("noMatchingMcpServers")} body={t("mcpTransportFilterHint")} />
                      }
                      size="compact"
                    />

                    <div className="mt-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        {t("showingMcpServers", { shown: filteredMcpData.length, total: mcpHubData?.length || 0 })}
                      </p>
                    </div>
                  </TabsContent>
                )}

                {/* Skill Hub Tab */}
                <TabsContent value="skills">
                  <SkillHubDashboard skills={skillHubData} isLoading={skillLoading} publicPage={true} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <PublicModelDialog
            open={isModalVisible}
            model={selectedModel}
            onClose={handleModalCancel}
            onCopy={copyToClipboard}
          />
          <PublicAgentDialog
            open={isAgentModalVisible}
            agent={selectedAgent}
            onClose={handleAgentModalCancel}
            onCopy={copyToClipboard}
          />
          <PublicMcpServerDialog
            open={isMcpModalVisible}
            server={selectedMcpServer}
            onClose={handleMcpModalCancel}
            onCopy={copyToClipboard}
          />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default PublicModelHub;
