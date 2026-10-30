"use client";

import { Copy, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getProviderLogoAndName } from "@/components/provider_info_helpers";
import type { ModelGroupInfo } from "@/components/PublicModelHubTableColumns";
import { formatCapabilityName, formatCost, getModelCapabilities, modelUsageExampleText } from "./modelDialogHelpers";

interface PublicModelDialogProps {
  open: boolean;
  model: ModelGroupInfo | null;
  onClose: () => void;
  onCopy: (text: string) => void;
}

function CapabilitiesList({ model, emptyLabel }: { model: ModelGroupInfo; emptyLabel: string }) {
  const capabilities = getModelCapabilities(model);
  if (capabilities.length === 0) {
    return <p className="text-muted-foreground">{emptyLabel}</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {capabilities.map((capability) => (
        <Badge key={capability} variant="secondary">
          {formatCapabilityName(capability)}
        </Badge>
      ))}
    </div>
  );
}

function SupportedParams({ params, title }: { params?: string[]; title: string }) {
  if (!params || params.length === 0) return null;
  return (
    <div>
      <p className="text-lg font-semibold mb-4">{title}</p>
      <div className="flex flex-wrap gap-2">
        {params.map((param) => (
          <Badge key={param} variant="secondary">
            {param}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function PublicModelDialog({ open, model, onClose, onCopy }: PublicModelDialogProps) {
  const t = useTranslations("modelHub");
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="flex min-w-0 items-center space-x-2">
            <span className="break-words">{model?.model_group || t("modelDetailsTitle")}</span>
            {model && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Copy
                      onClick={() => onCopy(model.model_group)}
                      className="cursor-pointer text-muted-foreground hover:text-info w-4 h-4 shrink-0"
                    />
                  }
                />
                <TooltipContent>{t("copyModelName")}</TooltipContent>
              </Tooltip>
            )}
          </DialogTitle>
        </DialogHeader>
        {model && (
          <div className="space-y-6">
            {/* Model Overview */}
            <div>
              <p className="text-lg font-semibold mb-4">{t("secModelOverview")}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-medium">{t("lblModelName")}</p>
                  <p>{model.model_group}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblMode")}</p>
                  <p>{model.mode || t("notSpecified")}</p>
                </div>
                <div>
                  <p className="font-medium">{t("lblProviders")}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(model.providers ?? []).map((provider) => {
                      const { logo } = getProviderLogoAndName(provider);
                      return (
                        <Badge key={provider} variant="secondary" className="min-w-0">
                          <div className="flex items-center space-x-1">
                            {logo && (
                              <img
                                src={logo}
                                alt={provider}
                                className="w-3 h-3 shrink-0 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            )}
                            <span className="capitalize">{provider}</span>
                          </div>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                {model.description && (
                  <div className="col-span-2">
                    <p className="font-medium">{t("lblDescription")}</p>
                    <p className="mt-1">{model.description}</p>
                  </div>
                )}
              </div>

              {/* Wildcard Routing Note */}
              {model.model_group.includes("*") && (
                <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-info mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-info mb-2">{t("wildcardRoutingTitle")}</p>
                      <p className="text-sm text-info mb-2">
                        {t.rich("wildcardRoutingHint", {
                          code: (chunks) => <code className="bg-info/15 px-1 py-0.5 rounded-sm text-xs">{chunks}</code>,
                        })}
                      </p>
                      <p className="text-sm text-info">
                        {t.rich("wildcardRoutingExample", {
                          code: (chunks) => <code className="bg-info/15 px-1 py-0.5 rounded-sm text-xs">{chunks}</code>,
                          modelGroup: model.model_group,
                          example: model.model_group.replaceAll("*", "my-custom-value"),
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
              <p className="text-lg font-semibold mb-4">{t("secCapabilities")}</p>
              <CapabilitiesList model={model} emptyLabel={t("noCapabilitiesListed")} />
            </div>

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

            <SupportedParams params={model.supported_openai_params} title={t("secSupportedParams")} />

            {/* Usage Example */}
            <div>
              <p className="text-lg font-semibold mb-4">{t("secUsageExample")}</p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">{modelUsageExampleText(model)}</pre>
              </div>
              <div className="mt-2 text-right">
                <button
                  onClick={() => onCopy(modelUsageExampleText(model))}
                  className="text-sm text-info hover:text-info/80 cursor-pointer"
                >
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
