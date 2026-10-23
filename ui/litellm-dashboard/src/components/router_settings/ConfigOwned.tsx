import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

export type RouterSettingSource = "config" | "db" | "env" | "default" | "unset";
export type RouterSettingsSource = { [key: string]: RouterSettingSource };

export function isOwnedByConfig(source: RouterSettingsSource, key: string): boolean {
  return source[key] === "config";
}

export function ConfigOwnedBadge(): React.ReactElement {
  const t = useTranslations("routerSettings");
  return (
    <Tooltip>
      <TooltipTrigger
        render={<Badge variant="outline" data-testid="config-owned-badge" className="ml-2 align-middle" />}
      >
        <Lock aria-hidden />
        config.yaml
      </TooltipTrigger>
      <TooltipContent>{t("configOwnedHint")}</TooltipContent>
    </Tooltip>
  );
}
