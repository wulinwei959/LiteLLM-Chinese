import { useTranslations } from "next-intl";

import { TeamAccessGroupModelGrant } from "../team/teamModelAccess";

type InheritedGrantsTranslator = ReturnType<typeof useTranslations<"inheritedGrants">>;

export interface InheritedGrant {
  id: string;
  accessGroupNames: string[];
}

export function computeInheritedGrants(
  ids: string[] | undefined,
  grants: TeamAccessGroupModelGrant[] | undefined,
  idsOf: (grant: TeamAccessGroupModelGrant) => string[] | undefined,
): InheritedGrant[] {
  const known = grants ?? [];
  const allIds = [...new Set([...(ids ?? []), ...known.flatMap((grant) => idsOf(grant) ?? [])])];
  return allIds.map((id) => ({
    id,
    accessGroupNames: known
      .filter((grant) => (idsOf(grant) ?? []).includes(id))
      .map((grant) => grant.access_group_name),
  }));
}

export const inheritedGrantTooltip = (t: InheritedGrantsTranslator, grant: InheritedGrant): string => {
  const names = grant.accessGroupNames;
  if (names.length > 1) return t("grantedViaGroups", { groups: names.join(", "), id: grant.id });
  if (names.length === 1) return t("grantedViaGroup", { group: names[0], id: grant.id });
  return t("grantedViaGeneric", { id: grant.id });
};
