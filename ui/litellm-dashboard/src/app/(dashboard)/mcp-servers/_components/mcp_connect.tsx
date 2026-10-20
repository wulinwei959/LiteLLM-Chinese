"use client";

/* eslint-disable react/no-unescaped-entities */

import React, { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/shared/Alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CopyIcon,
  Code,
  Terminal,
  Globe,
  CheckIcon,
  ExternalLinkIcon,
  Info,
  KeyIcon,
  ServerIcon,
  Zap,
} from "lucide-react";
import { getProxyBaseUrl } from "@/components/networking";
import { copyToClipboard as utilCopyToClipboard } from "@/utils/dataUtils";

interface CodeBlockProps {
  code: string;
  title?: string;
  copyKey: string;
  className?: string;
}

type FeatureCardTitleKey =
  | "mcpConnect.virtualKeySetup"
  | "mcpConnect.mcpServerInfo"
  | "mcpConnect.implementationExample"
  | "mcpConnect.apiKeySetup"
  | "mcpConnect.configuration"
  | "mcpConnect.universalMcpConnection";

type CodeBlockTitleKey = "mcpConnect.environmentVariable" | "mcpConnect.serverUrl" | "mcpConnect.headersConfiguration";

interface FeatureCardProps {
  icon: React.ReactNode;
  titleKey: FeatureCardTitleKey;
  description: string;
  children: React.ReactNode;
  serverName?: string;
  accessGroups?: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  titleKey,
  description,
  children,
  serverName,
  accessGroups = ["dev-group"],
}) => {
  const t = useTranslations("mcpServers");
  const [useServerHeader, setUseServerHeader] = useState(false);
  const serverHeaderToggleId = useId();

  const getHeadersConfig = () => {
    const headers: Record<string, any> = {
      "x-litellm-api-key": "Bearer YOUR_LITELLM_API_KEY",
    };
    if (useServerHeader && serverName) {
      const formattedServerName = serverName.replace(/\s+/g, "_");
      // Include both server name and access groups in the same header (comma-separated string)
      const serverAndGroups = [formattedServerName, ...accessGroups].join(",");
      headers["x-mcp-servers"] = serverAndGroups;
    }
    return headers;
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-3 mb-3">
          <span className="p-2 rounded-lg bg-muted">{icon}</span>
          <div>
            <h5 className="mb-0 text-base font-semibold text-foreground">{t(titleKey)}</h5>
            <span className="text-muted-foreground">{description}</span>
          </div>
        </div>
        {serverName && (titleKey === "mcpConnect.implementationExample" || titleKey === "mcpConnect.configuration") && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Switch
                id={serverHeaderToggleId}
                size="sm"
                checked={useServerHeader}
                onCheckedChange={setUseServerHeader}
              />
              <Label htmlFor={serverHeaderToggleId} className="font-normal leading-normal">
                {t.rich("mcpConnect.limitToolsHint", { code: (chunks) => <code>{chunks}</code> })}
              </Label>
            </div>
            {useServerHeader && (
              <Alert className="mt-2" variant="info">
                <Info />
                <AlertTitle>{t("twoOptions")}</AlertTitle>
                <AlertDescription>
                  <div>
                    <p>
                      <strong>{t("option1")}</strong> {t("mcpConnect.getSpecificServer")}{" "}
                      <code>"{serverName.replace(/\s+/g, "_")}"</code>
                    </p>
                    <p>
                      <strong>{t("option2")}</strong> {t("mcpConnect.getMcpGroup")} <code>"dev-group"</code>
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t("mcpConnect.mixBoth")} <code>"Server1,dev-group"</code>
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement<CodeBlockProps>(child) &&
            child.props.hasOwnProperty("code") &&
            child.props.hasOwnProperty("copyKey")
          ) {
            const code = child.props.code;
            if (code && code.includes('"headers":')) {
              return React.cloneElement(child, {
                code: code.replace(/"headers":\s*{[^}]*}/, `"headers": ${JSON.stringify(getHeadersConfig(), null, 8)}`),
              });
            }
          }
          return child;
        })}
      </CardContent>
    </Card>
  );
};

interface MCPConnectProps {
  currentServerAccessGroups?: string[];
}

const MCPConnect: React.FC<MCPConnectProps> = ({ currentServerAccessGroups = [] }) => {
  const t = useTranslations("mcpServers");
  const commonT = useTranslations("common");
  const proxyBaseUrl = getProxyBaseUrl();
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [currentServer] = useState("Zapier_MCP"); // This should match the current server being viewed

  const copyToClipboard = async (text: string, key: string) => {
    const success = await utilCopyToClipboard(text, commonT("copiedToClipboard"));
    if (success) {
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    }
  };

  const CodeBlock: React.FC<{
    code: string;
    copyKey: string;
    titleKey?: CodeBlockTitleKey;
    className?: string;
  }> = ({ code, copyKey, titleKey, className = "" }) => (
    <div className="relative group">
      {titleKey && (
        <div className="flex items-center gap-2 mb-2">
          <Code size={16} className="text-info" />
          <strong className="font-semibold text-foreground">{t(titleKey)}</strong>
        </div>
      )}
      <Card className={`relative bg-muted ${className}`}>
        <CardContent>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => copyToClipboard(code, copyKey)}
            className={`absolute top-2 right-2 z-raised transition-all duration-200 ${
              copiedStates[copyKey]
                ? "text-success bg-success/10 border-success/20"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {copiedStates[copyKey] ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
          </Button>
          <pre className="text-sm overflow-x-auto pr-10 text-foreground font-mono leading-relaxed">{code}</pre>
        </CardContent>
      </Card>
    </div>
  );

  const StepCard: React.FC<{
    step: number;
    titleKey: "mcpConnect.openSettings" | "mcpConnect.navigateToMcpTools" | "mcpConnect.addConfiguration";
    children: React.ReactNode;
  }> = ({ step, titleKey, children }) => (
    <div className="flex gap-4">
      <div className="shrink-0">
        <div className="w-8 h-8 bg-info text-info-foreground rounded-full flex items-center justify-center text-sm font-semibold">
          {step}
        </div>
      </div>
      <div className="flex-1">
        <strong className="mb-2 block font-semibold text-foreground">{t(titleKey)}</strong>
        {children}
      </div>
    </div>
  );

  const LiteLLMProxyTab = () => (
    <div className="flex w-full flex-col gap-6">
      <div className="bg-linear-to-r from-success/15 to-success/5 p-6 rounded-lg border border-success/15">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="text-success" size={24} />
          <h4 className="mb-0 text-xl font-semibold text-success">{t("mcpConnect.litellmProxyApiIntegration")}</h4>
        </div>
        <span className="text-success">
          {t("mcpConnect.litellmProxyDesc")}
        </span>
      </div>

      <div className="flex w-full flex-col gap-6">
        <FeatureCard
          icon={<KeyIcon className="text-success" size={16} />}
          titleKey="mcpConnect.virtualKeySetup"
          description={t("mcpConnect.virtualKeyDesc")}
        >
          <div className="flex w-full flex-col gap-4">
            <div>
              <span>{t("mcpConnect.getVirtualKey")}</span>
            </div>
            <CodeBlock
              titleKey="mcpConnect.environmentVariable"
              code='export LITELLM_API_KEY="sk-..."'
              copyKey="litellm-env"
            />
          </div>
        </FeatureCard>

        <FeatureCard
          icon={<ServerIcon className="text-success" size={16} />}
          titleKey="mcpConnect.mcpServerInfo"
          description={t("mcpConnect.connectionDetails")}
        >
          <CodeBlock titleKey="mcpConnect.serverUrl" code={`${proxyBaseUrl}/mcp`} copyKey="litellm-server-url" />
        </FeatureCard>

        <FeatureCard
          icon={<Code className="text-success" size={16} />}
          titleKey="mcpConnect.implementationExample"
          description={t("mcpConnect.curlExampleDesc")}
          serverName={currentServer}
          accessGroups={["dev-group"]}
        >
          <CodeBlock
            code={`curl --location '${proxyBaseUrl}/v1/responses' \\
--header 'Content-Type: application/json' \\
--header "Authorization: Bearer $LITELLM_VIRTUAL_KEY" \\
--data '{
    "model": "gpt-4",
    "tools": [
        {
            "type": "mcp",
            "server_label": "litellm",
            "server_url": "litellm_proxy",
            "require_approval": "never",
            "headers": {
                "x-litellm-api-key": "Bearer YOUR_LITELLM_VIRTUAL_KEY",
                "x-mcp-servers": "Zapier_MCP,dev-group"
            }
        }
    ],
    "input": "Run available tools",
    "tool_choice": "required"
}'`}
            copyKey="litellm-curl"
            className="text-xs"
          />
        </FeatureCard>
      </div>
    </div>
  );

  const OpenAITab = () => (
    <div className="flex w-full flex-col gap-6">
      <div className="bg-linear-to-r from-info/15 to-info/5 p-6 rounded-lg border border-info/15">
        <div className="flex items-center gap-3 mb-3">
          <Code className="text-info" size={24} />
          <h4 className="mb-0 text-xl font-semibold text-info">{t("mcpConnect.openaiResponsesApi")}</h4>
        </div>
        <span className="text-info">
          {t("mcpConnect.openaiDesc")}
        </span>
      </div>

      <div className="flex w-full flex-col gap-6">
        <FeatureCard
          icon={<KeyIcon className="text-info" size={16} />}
          titleKey="mcpConnect.apiKeySetup"
          description={t("mcpConnect.configureOpenaiKey")}
        >
          <div className="flex w-full flex-col gap-4">
            <div>
              <span>
                {t.rich("mcpConnect.getApiKeyFrom", {
                  platform: t("mcpConnect.openaiPlatform"),
                  link: (chunks) => (
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-info hover:text-info/80 inline-flex items-center gap-1"
                    >
                      {chunks}
                      <ExternalLinkIcon size={12} />
                    </a>
                  ),
                })}
              </span>
            </div>
            <CodeBlock
              titleKey="mcpConnect.environmentVariable"
              code='export OPENAI_API_KEY="sk-..."'
              copyKey="openai-env"
            />
          </div>
        </FeatureCard>

        <FeatureCard
          icon={<ServerIcon className="text-info" size={16} />}
          titleKey="mcpConnect.mcpServerInfo"
          description={t("mcpConnect.connectionDetails")}
        >
          <CodeBlock titleKey="mcpConnect.serverUrl" code={`${proxyBaseUrl}/mcp`} copyKey="openai-server-url" />
        </FeatureCard>

        <FeatureCard
          icon={<Code className="text-info" size={16} />}
          titleKey="mcpConnect.implementationExample"
          description={t("mcpConnect.curlExampleDesc")}
          serverName="Zapier Gmail"
          accessGroups={["dev-group"]}
        >
          <CodeBlock
            code={`curl --location 'https://api.openai.com/v1/responses' \\
--header 'Content-Type: application/json' \\
--header "Authorization: Bearer $OPENAI_API_KEY" \\
--data '{
    "model": "gpt-4.1",
    "tools": [
        {
            "type": "mcp",
            "server_label": "litellm",
            "server_url": "${proxyBaseUrl}/mcp",
            "require_approval": "never",
            "headers": {
                "x-litellm-api-key": "Bearer YOUR_LITELLM_API_KEY",
                "x-mcp-servers": "Zapier_MCP,dev-group"
            }
        }
    ],
    "input": "Run available tools",
    "tool_choice": "required"
}'`}
            copyKey="openai-curl"
            className="text-xs"
          />
        </FeatureCard>
      </div>
    </div>
  );

  const CursorTab = () => (
    <div className="flex w-full flex-col gap-6">
      <div className="bg-linear-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-100 dark:from-purple-950 dark:to-blue-950 dark:border-purple-900">
        <div className="flex items-center gap-3 mb-3">
          <Terminal className="text-purple-600 dark:text-purple-400" size={24} />
          <h4 className="mb-0 text-xl font-semibold text-purple-900 dark:text-purple-100">{t("mcpConnect.cursorIdeIntegration")}</h4>
        </div>
        <span className="text-purple-700 dark:text-purple-300">{t("mcpConnect.cursorDesc")}</span>
      </div>

      <Card>
        <CardContent>
          <h5 className="mb-4 text-base font-semibold text-foreground">{t("mcpConnect.setupInstructions")}</h5>
          <div className="flex w-full flex-col gap-6">
            <StepCard step={1} titleKey="mcpConnect.openSettings">
              <span className="text-muted-foreground">
                {t("mcpConnect.openSettingsShortcut", { mac: "⇧+⌘+J", windows: "Ctrl+Shift+J" })}
              </span>
            </StepCard>

            <StepCard step={2} titleKey="mcpConnect.navigateToMcpTools">
              <span className="text-muted-foreground">{t("mcpConnect.goToMcpTools")}</span>
            </StepCard>

            <StepCard step={3} titleKey="mcpConnect.addConfiguration">
              <span className="mb-3 text-muted-foreground">
                {t("mcpConnect.copyConfig", { mac: "Cmd+S", windows: "Ctrl+S" })}
              </span>
              <FeatureCard
                icon={<Code className="text-purple-600 dark:text-purple-400" size={16} />}
                titleKey="mcpConnect.configuration"
                description={t("mcpConnect.cursorMcpConfig")}
                serverName="Zapier Gmail"
                accessGroups={["dev-group"]}
              >
                <CodeBlock
                  code={`{
    "mcpServers": {
      "Zapier_MCP": {
        "url": "${proxyBaseUrl}/mcp",
        "headers": {
          "x-litellm-api-key": "Bearer YOUR_LITELLM_API_KEY",
          "x-mcp-servers": "Zapier_MCP,dev-group"
        }
      }
    }
  }`}
                  copyKey="cursor-config"
                  className="text-xs"
                />
              </FeatureCard>
            </StepCard>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const StreamableHTTPTab = () => (
    <div className="flex w-full flex-col gap-6">
      <div className="bg-linear-to-r from-success/15 to-success/5 p-6 rounded-lg border border-success/15">
        <div className="flex items-center gap-3 mb-3">
          <Globe className="text-success" size={24} />
          <h4 className="mb-0 text-xl font-semibold text-success">{t("mcpConnect.streamableHttpTransport")}</h4>
        </div>
        <span className="text-success">
          {t("mcpConnect.httpTransportDesc")}
        </span>
      </div>

      <FeatureCard
        icon={<Globe className="text-success" size={16} />}
        titleKey="mcpConnect.universalMcpConnection"
        description={t("mcpConnect.useWithAnyClient")}
      >
        <div className="flex w-full flex-col gap-4">
          <div>
            <span>{t("mcpConnect.differentTransports")}</span>
          </div>
          <CodeBlock titleKey="mcpConnect.serverUrl" code={`${proxyBaseUrl}/mcp`} copyKey="http-server-url" />
          <CodeBlock
            titleKey="mcpConnect.headersConfiguration"
            code={JSON.stringify(
              {
                "x-litellm-api-key": "Bearer YOUR_LITELLM_API_KEY",
              },
              null,
              2,
            )}
            copyKey="http-headers"
          />
          <div className="mt-4">
            <Button
              variant="link"
              className="p-0 h-auto text-info hover:text-info/80"
              nativeButton={false}
              render={
                <a
                  href="https://modelcontextprotocol.io/docs/concepts/transports"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <ExternalLinkIcon size={14} />
              {t("mcpConnect.learnMoreTransports")}
            </Button>
          </div>
        </div>
      </FeatureCard>
    </div>
  );

  return (
    <div>
      <div className="flex w-full flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-3">{t("mcpConnect.connectToClient")}</h2>
          <p className="text-lg text-muted-foreground">
            {t("mcpConnect.subtitle")}
          </p>
        </div>

        <Tabs defaultValue="openai" className="w-full">
          <TabsList variant="line" className="mt-8 mb-6 h-auto w-full justify-start rounded-none border-b p-0">
            <div className="flex rounded-lg bg-muted p-1">
              <TabsTrigger value="openai" className="flex-none px-6 py-3">
                <span className="flex items-center gap-2 font-medium">
                  <Code size={18} />
                  {t("mcpConnect.openaiApi")}
                </span>
              </TabsTrigger>
              <TabsTrigger value="litellm" className="flex-none px-6 py-3">
                <span className="flex items-center gap-2 font-medium">
                  <Zap size={18} />
                  {t("mcpConnect.litellmProxy")}
                </span>
              </TabsTrigger>
              <TabsTrigger value="cursor" className="flex-none px-6 py-3">
                <span className="flex items-center gap-2 font-medium">
                  <Terminal size={18} />
                  {t("mcpConnect.cursor")}
                </span>
              </TabsTrigger>
              <TabsTrigger value="http" className="flex-none px-6 py-3">
                <span className="flex items-center gap-2 font-medium">
                  <Globe size={18} />
                  {t("mcpConnect.streamableHttp")}
                </span>
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent value="openai" keepMounted className="mt-6">
            <OpenAITab />
          </TabsContent>
          <TabsContent value="litellm" keepMounted className="mt-6">
            <LiteLLMProxyTab />
          </TabsContent>
          <TabsContent value="cursor" keepMounted className="mt-6">
            <CursorTab />
          </TabsContent>
          <TabsContent value="http" keepMounted className="mt-6">
            <StreamableHTTPTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MCPConnect;
