import { useTranslations } from "next-intl";

export interface PermissionInfo {
  method: string;
  endpoint: string;
  description: string;
  route: string;
}

/**
 * Map of permission endpoint patterns to the translation key for their description
 */
export const PERMISSION_DESCRIPTION_KEYS: Record<string, string> = {
  "/auto_router/manage": "perm.autoRouterManage",
  "/key/generate": "perm.keyGenerate",
  "/key/service-account/generate": "perm.keyServiceAccountGenerate",
  "/key/update": "perm.keyUpdate",
  "/key/delete": "perm.keyDelete",
  "/key/info": "perm.keyInfo",
  "/key/regenerate": "perm.keyRegenerate",
  "/key/{key_id}/regenerate": "perm.keyRegenerate",
  "/key/list": "perm.keyList",
  "/key/block": "perm.keyBlock",
  "/key/unblock": "perm.keyUnblock",
  "/key/access_group_assignment": "perm.keyAccessGroupAssignment",
  "/team/daily/activity": "perm.teamDailyActivity",
  "/spend/logs": "perm.spendLogs",
};

/**
 * Determines the HTTP method for a given permission endpoint
 */
export const getMethodForEndpoint = (endpoint: string): string => {
  if (
    endpoint.includes("/info") ||
    endpoint.includes("/list") ||
    endpoint.includes("/activity") ||
    endpoint === "/spend/logs"
  ) {
    return "GET";
  }
  return "POST";
};

const getDescriptionKey = (permission: string): string | undefined =>
  PERMISSION_DESCRIPTION_KEYS[permission] ??
  Object.entries(PERMISSION_DESCRIPTION_KEYS).find(([pattern]) => permission.includes(pattern))?.[1];

/**
 * Parses a permission string into a structured PermissionInfo object
 */
export const getPermissionInfo = (permission: string, t: ReturnType<typeof useTranslations>): PermissionInfo => {
  const method = getMethodForEndpoint(permission);
  const descriptionKey = getDescriptionKey(permission);

  return {
    method,
    endpoint: permission,
    description: descriptionKey ? t(descriptionKey) : t("perm.accessEndpoint", { endpoint: permission }),
    route: permission,
  };
};
