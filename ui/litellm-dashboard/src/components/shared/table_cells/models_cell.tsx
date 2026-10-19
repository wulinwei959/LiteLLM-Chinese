"use client";

import { useTranslations } from "next-intl";

import { deriveKeyModelScope } from "@/components/key_scope";
import { getModelDisplayName } from "@/components/key_team_helpers/fetch_available_models_team_key";
import { Badge } from "@/components/ui/badge";

import { CellTooltip } from "./cell_tooltip";

interface ModelsCellProps {
  models: string[] | null | undefined;
  maxVisible?: number;
  allowedRoutes?: string[] | null;
  keyType?: string | null;
}

const WILDCARD_MODEL = "all-proxy-models";

export function ModelsCell({ models, maxVisible = 3, allowedRoutes, keyType }: ModelsCellProps) {
  const t = useTranslations("tableCells");
  const commonT = useTranslations("common");
  const formatModel = (model: string): string => {
    if (model === WILDCARD_MODEL) {
      return t("allProxyModels");
    }
    const name = getModelDisplayName(model);
    return name.length > 30 ? `${name.slice(0, 30)}...` : name;
  };

  if (!Array.isArray(models) || models.length === 0) {
    const scope = deriveKeyModelScope(commonT, allowedRoutes, keyType);
    if (!scope.hasModelAccess) {
      return (
        <CellTooltip
          content={t("scopedRoutesTooltip", { routes: String(scope.label) })}
          trigger={
            <Badge variant="secondary" className="cursor-default">
              {t("noModelAccess")}
            </Badge>
          }
        />
      );
    }
    return <Badge variant="secondary">{t("allProxyModels")}</Badge>;
  }

  const visible = models.slice(0, maxVisible);
  const overflow = models.slice(maxVisible);

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visible.map((model, index) => (
        <Badge key={index} variant={model === WILDCARD_MODEL ? "secondary" : "outline"}>
          {formatModel(model)}
        </Badge>
      ))}
      {overflow.length > 0 && (
        <CellTooltip
          content={
            <div className="flex max-w-[280px] flex-col gap-0.5">
              {overflow.map((model, index) => (
                <span key={index}>{formatModel(model)}</span>
              ))}
            </div>
          }
          trigger={
            <Badge variant="outline" className="cursor-default">
              {t("moreCount", { count: overflow.length })}
            </Badge>
          }
        />
      )}
    </div>
  );
}
