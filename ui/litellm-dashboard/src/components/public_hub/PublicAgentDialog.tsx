"use client";

import { ExternalLinkIcon } from "@heroicons/react/outline";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { AgentCard } from "@/components/PublicModelHubTableColumns";

interface PublicAgentDialogProps {
  open: boolean;
  agent: AgentCard | null;
  onClose: () => void;
  onCopy: (text: string) => void;
}

export function PublicAgentDialog({ open, agent, onClose, onCopy }: PublicAgentDialogProps) {
  const t = useTranslations("modelHub");
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="flex min-w-0 items-center space-x-2">
            <span className="break-words">{agent?.name || t("agentDetailsTitle")}</span>
            {agent && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Copy
                      onClick={() => onCopy(agent.name)}
                      className="cursor-pointer text-muted-foreground hover:text-info w-4 h-4 shrink-0"
                    />
                  }
                />
                <TooltipContent>{t("copyAgentName")}</TooltipContent>
              </Tooltip>
            )}
          </DialogTitle>
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
                  <p>{agent.version}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">{t("lblDescription")}</p>
                  <p>{agent.description}</p>
                </div>
                {agent.url && (
                  <div>
                    <p className="font-medium">{t("lblUrl")}</p>
                    <a
                      href={agent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-info hover:text-info/80 text-sm break-all"
                    >
                      {agent.url}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Capabilities */}
            {agent.capabilities && (
              <div>
                <p className="text-lg font-semibold mb-4">{t("secCapabilities")}</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(agent.capabilities)
                    .filter(([_, value]) => value === true)
                    .map(([key]) => (
                      <Badge key={key} variant="secondary" className="capitalize">
                        {key}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {agent.skills && agent.skills.length > 0 && (
              <div>
                <p className="text-lg font-semibold mb-4">{t("secSkills")}</p>
                <div className="space-y-4">
                  {agent.skills.map((skill, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-base">{skill.name}</p>
                          <p className="text-sm text-muted-foreground">{skill.description}</p>
                        </div>
                      </div>
                      {skill.tags && skill.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {skill.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
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
                    {(agent.defaultInputModes ?? []).map((mode) => (
                      <Badge key={mode} variant="secondary">
                        {mode}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium">{t("lblOutputModes")}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(agent.defaultOutputModes ?? []).map((mode) => (
                      <Badge key={mode} variant="secondary">
                        {mode}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Documentation */}
            {agent.documentationUrl && (
              <div>
                <p className="text-lg font-semibold mb-4">{t("agentDocumentationTitle")}</p>
                <a
                  href={agent.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info hover:text-info/80 flex items-center space-x-2"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  <span>{t("viewDocumentation")}</span>
                </a>
              </div>
            )}

            {/* A2A Usage Example */}
            <div>
              <p className="text-lg font-semibold mb-4">{t("usageExampleA2A")}</p>

              {/* Step 1: Retrieve Agent Card */}
              <div className="mb-4">
                <p className="text-sm font-medium mb-2 text-foreground">{t("a2aStep1Title")}</p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs">
                    {`base_url = '${agent.url}'

resolver = A2ACardResolver(
    httpx_client=httpx_client,
    base_url=base_url,
    # agent_card_path uses default, extended_agent_card_path also uses default
)

# Fetch Public Agent Card and Initialize Client
final_agent_card_to_use: AgentCard | None = None
_public_card = (
    await resolver.get_agent_card()
)  # Fetches from default public path - \`/agents/{agent_id}/\`
final_agent_card_to_use = _public_card

if _public_card.supports_authenticated_extended_card:
    try:
        auth_headers_dict = {
        'Authorization': 'Bearer dummy-token-for-extended-card'
        }
        _extended_card = await resolver.get_agent_card(
        relative_card_path=EXTENDED_AGENT_CARD_PATH,
        http_kwargs={'headers': auth_headers_dict},
        )
        final_agent_card_to_use = (
        _extended_card  # Update to use the extended card
        )
    except Exception as e_extended:
        logger.warning(
        f'Failed to fetch extended agent card: {e_extended}. Will proceed with public card.',
        exc_info=True,
        )`}
                  </pre>
                </div>
                <div className="mt-2 text-right">
                  <button
                    onClick={() => {
                      const codeSnippet = `from a2a.client import A2ACardResolver, A2AClient
from a2a.types import (
    AgentCard,
    MessageSendParams,
    SendMessageRequest,
    SendStreamingMessageRequest,
)
from a2a.utils.constants import (
    AGENT_CARD_WELL_KNOWN_PATH,
    EXTENDED_AGENT_CARD_PATH,
)

base_url = '${agent.url}'

resolver = A2ACardResolver(
    httpx_client=httpx_client,
    base_url=base_url,
    # agent_card_path uses default, extended_agent_card_path also uses default
)

# Fetch Public Agent Card and Initialize Client
final_agent_card_to_use: AgentCard | None = None
_public_card = (
    await resolver.get_agent_card()
)  # Fetches from default public path - \`/agents/{agent_id}/\`
final_agent_card_to_use = _public_card

if _public_card.supports_authenticated_extended_card:
    try:
        auth_headers_dict = {
        'Authorization': 'Bearer dummy-token-for-extended-card'
        }
        _extended_card = await resolver.get_agent_card(
        relative_card_path=EXTENDED_AGENT_CARD_PATH,
        http_kwargs={'headers': auth_headers_dict},
        )
        final_agent_card_to_use = (
        _extended_card  # Update to use the extended card
        )
    except Exception as e_extended:
        logger.warning(
        f'Failed to fetch extended agent card: {e_extended}. Will proceed with public card.',
        exc_info=True,
        )`;
                      onCopy(codeSnippet);
                    }}
                    className="text-sm text-info hover:text-info/80 cursor-pointer"
                  >
                    {t("copyToClipboard")}
                  </button>
                </div>
              </div>

              {/* Step 2: Call the Agent */}
              <div>
                <p className="text-sm font-medium mb-2 text-foreground">{t("a2aStep2Title")}</p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs">
                    {`client = A2AClient(
    httpx_client=httpx_client, agent_card=final_agent_card_to_use
)

send_message_payload: dict[str, Any] = {
    'message': {
        'role': 'user',
        'parts': [
        {'kind': 'text', 'text': 'how much is 10 USD in INR?'}
        ],
        'messageId': uuid4().hex,
    },
}
request = SendMessageRequest(
    id=str(uuid4()), params=MessageSendParams(**send_message_payload)
)

response = await client.send_message(request)
print(response.model_dump(mode='json', exclude_none=True))`}
                  </pre>
                </div>
                <div className="mt-2 text-right">
                  <button
                    onClick={() => {
                      const codeSnippet = `client = A2AClient(
    httpx_client=httpx_client, agent_card=final_agent_card_to_use
)

send_message_payload: dict[str, Any] = {
    'message': {
        'role': 'user',
        'parts': [
        {'kind': 'text', 'text': 'how much is 10 USD in INR?'}
        ],
        'messageId': uuid4().hex,
    },
}
request = SendMessageRequest(
    id=str(uuid4()), params=MessageSendParams(**send_message_payload)
)

response = await client.send_message(request)
print(response.model_dump(mode='json', exclude_none=True))`;
                      onCopy(codeSnippet);
                    }}
                    className="text-sm text-info hover:text-info/80 cursor-pointer"
                  >
                    {t("copyToClipboard")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
