"use client";

import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MCPServerData } from "@/components/PublicModelHubTableColumns";
import { getProxyBaseUrl } from "@/components/networking";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const mcpUsageSnippet = (serverName: string): string => `# Using MCP Server with Python FastMCP

from fastmcp import Client
import asyncio

# Standard MCP configuration
config = {
    "mcpServers": {
        "${serverName}": {
            "url": "${getProxyBaseUrl()}/${serverName}/mcp",
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
    asyncio.run(main())`;

interface PublicMcpServerDialogProps {
  open: boolean;
  server: MCPServerData | null;
  onClose: () => void;
  onCopy: (text: string) => void;
}

export function PublicMcpServerDialog({ open, server, onClose, onCopy }: PublicMcpServerDialogProps) {
  const t = useTranslations("modelHub");
  const snippet = server ? mcpUsageSnippet(server.server_name) : "";
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="flex min-w-0 items-center space-x-2">
            <span className="break-words">{server?.server_name || t("mcpServerDetailsTitle")}</span>
            {server && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Copy
                      onClick={() => onCopy(server.server_name)}
                      className="cursor-pointer text-muted-foreground hover:text-info w-4 h-4 shrink-0"
                    />
                  }
                />
                <TooltipContent>{t("copyServerName")}</TooltipContent>
              </Tooltip>
            )}
          </DialogTitle>
        </DialogHeader>
        {server && (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold mb-4">{t("secServerOverview")}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-medium">{t("lblServerName")}</p>
                  <p>{server.server_name}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblTransport")}</p>
                  <Badge variant="secondary">{server.transport}</Badge>
                </div>
                {server.alias && (
                  <div>
                    <p className="font-medium">{t("lblAlias")}</p>
                    <p>{server.alias}</p>
                  </div>
                )}
                <div>
                  <p className="font-medium">{t("lblAuthType")}</p>
                  <Badge variant={server.auth_type === "none" ? "outline" : "secondary"}>{server.auth_type}</Badge>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">{t("lblDescription")}</p>
                  <p>{server.mcp_info?.description || "-"}</p>
                </div>
              </div>
            </div>

            {server.mcp_info && Object.keys(server.mcp_info).length > 0 && (
              <div>
                <p className="text-lg font-semibold mb-4">{t("additionalInformation")}</p>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">{JSON.stringify(server.mcp_info, null, 2)}</pre>
                </div>
              </div>
            )}

            <div>
              <p className="text-lg font-semibold mb-4">{t("secUsageExample")}</p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">{snippet}</pre>
              </div>
              <div className="mt-2 text-right">
                <button onClick={() => onCopy(snippet)} className="text-sm text-info hover:text-info/80 cursor-pointer">
                  {t("copyToClipboard")}
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
