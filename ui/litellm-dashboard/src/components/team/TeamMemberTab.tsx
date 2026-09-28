import { useResetTeamMemberBudget } from "@/app/(dashboard)/hooks/teams/useResetTeamMemberBudget";
import { useResetTeamMemberSpend } from "@/app/(dashboard)/hooks/teams/useResetTeamMemberSpend";
import { useUISettings } from "@/app/(dashboard)/hooks/uiSettings/useUISettings";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SimpleTooltip } from "@/components/ui/tooltip";
import MemberTable from "@/components/common_components/MemberTable";
import { Member } from "@/components/networking";
import { parseErrorMessage } from "@/components/shared/errorUtils";
import { DateCell, MoneyCell } from "@/components/shared/table_cells";
import { toast } from "@/lib/toast";
import { formatNumberWithCommas } from "@/utils/dataUtils";
import { isProxyAdminRole, isUserTeamAdminForSingleTeam } from "@/utils/roles";
import { CircleHelp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ComponentProps } from "react";
import { TeamData, TeamMemberBudgetSource, TeamMembership } from "./TeamInfo";

const BUDGET_SOURCE_LABEL_KEYS: Record<Exclude<TeamMemberBudgetSource, "none">, string> = {
  team_default: "member.budgetSourceTeamDefault",
  custom: "member.budgetSourceCustom",
};

const formatBudget = (value: number | null, t: ReturnType<typeof useTranslations>): string =>
  value === null ? t("member.unlimited") : `$${formatNumberWithCommas(value, 2)}`;

export const seedMemberBudgetFields = (
  record: Member,
  budget: TeamMembership["litellm_budget_table"] | undefined,
): Member => ({
  ...record,
  max_budget_in_team: budget?.max_budget ?? null,
  tpm_limit: budget?.tpm_limit ?? null,
  rpm_limit: budget?.rpm_limit ?? null,
  budget_duration: budget?.budget_duration || null,
  allowed_models: budget?.allowed_models || [],
  temp_budget_increase: budget?.temp_budget_increase ?? null,
  temp_budget_expiry: budget?.temp_budget_expiry ?? null,
});

interface TeamMemberTabProps {
  teamData: TeamData;
  canEditTeam: boolean;
  handleMemberDelete: (member: Member) => void;
  setSelectedEditMember: (member: Member) => void;
  setIsEditMemberModalVisible: (visible: boolean) => void;
  setIsAddMemberModalVisible: (visible: boolean) => void;
  onMemberSpendReset: () => void;
  onMemberBudgetReset: () => void;
}

export default function TeamMemberTab({
  teamData,
  canEditTeam,
  handleMemberDelete,
  setSelectedEditMember,
  setIsEditMemberModalVisible,
  setIsAddMemberModalVisible,
  onMemberSpendReset,
  onMemberBudgetReset,
}: TeamMemberTabProps) {
  const t = useTranslations("teams");
  const [memberToResetSpend, setMemberToResetSpend] = useState<Member | null>(null);
  const [memberToResetBudget, setMemberToResetBudget] = useState<Member | null>(null);
  const { mutate: resetMemberSpend, isPending: isResettingSpend } = useResetTeamMemberSpend();
  const { mutate: resetMemberBudget, isPending: isResettingBudget } = useResetTeamMemberBudget();
  const teamDefaultBudget = teamData.team_info.team_member_budget_table?.max_budget ?? null;

  const formatNumber = (value: number | null): string => {
    if (value === null || value === undefined) return "0";

    if (typeof value === "number") {
      // Convert scientific notation to normal decimal
      const normalNumber = Number(value);

      // If it's a whole number, return it without decimals
      if (normalNumber === Math.floor(normalNumber)) {
        return normalNumber.toString();
      }

      // For decimal numbers, use toFixed and remove trailing zeros
      return formatNumberWithCommas(normalNumber, 8).replace(/\.?0+$/, "");
    }

    return "0";
  };

  const getUserCurrentCycleSpend = (userId: string | null): number => {
    if (!userId) return 0;
    const membership = teamData.team_memberships.find((tm) => tm.user_id === userId);
    return membership?.spend ?? 0;
  };

  const getUserTotalSpend = (userId: string | null): number => {
    if (!userId) return 0;
    const membership = teamData.team_memberships.find((tm) => tm.user_id === userId);
    return membership?.total_spend ?? 0;
  };

  const getUserBudgetSource = (userId: string | null): TeamMemberBudgetSource => {
    if (!userId) return "none";
    const membership = teamData.team_memberships.find((tm) => tm.user_id === userId);
    return membership?.budget_source ?? "none";
  };

  const getUserBudget = (userId: string | null): number | null => {
    if (!userId) return null;
    const membership = teamData.team_memberships.find((tm) => tm.user_id === userId);
    return membership?.litellm_budget_table?.max_budget ?? teamDefaultBudget;
  };

  // Helper function to get rate limits for a user
  const getUserRateLimits = (userId: string | null): string => {
    if (!userId) return t("member.noLimits");
    const membership = teamData.team_memberships.find((tm) => tm.user_id === userId);
    const rpmLimit = membership?.litellm_budget_table?.rpm_limit;
    const tpmLimit = membership?.litellm_budget_table?.tpm_limit;

    const rpmText = rpmLimit != null ? `${formatNumber(rpmLimit)} RPM` : null;
    const tpmText = tpmLimit != null ? `${formatNumber(tpmLimit)} TPM` : null;

    const limits = [rpmText, tpmText].filter(Boolean);
    return limits.length > 0 ? limits.join(" / ") : t("member.noLimits");
  };

  const { data: uiSettingsData } = useUISettings();
  const { userId, userRole } = useAuthorized();
  const disableTeamAdminDeleteTeamUser = Boolean(uiSettingsData?.values?.disable_team_admin_delete_team_user);
  const isUserTeamAdmin = isUserTeamAdminForSingleTeam(teamData.team_info.members_with_roles, userId || "");
  const isProxyAdmin = isProxyAdminRole(userRole || "");

  const getUserAllowedModels = (userId: string | null): string[] | null => {
    if (!userId) return null;
    const membership = teamData.team_memberships.find((tm) => tm.user_id === userId);
    const models = membership?.litellm_budget_table?.allowed_models;
    return models && models.length > 0 ? models : null;
  };

  const getUserBudgetReset = (userId: string | null): string | null => {
    if (!userId) return null;
    const membership = teamData.team_memberships.find((tm) => tm.user_id === userId);
    return membership?.litellm_budget_table?.budget_reset_at ?? null;
  };

  const extraColumns: NonNullable<ComponentProps<typeof MemberTable>["extraColumns"]> = [
    {
      title: (
        <span className="flex items-center gap-1">
          {t("member.modelScope")}
          <SimpleTooltip content={t("member.modelScopeTooltip")}>
            <CircleHelp className="size-4" aria-label={t("member.modelScopeInfoAria")} />
          </SimpleTooltip>
        </span>
      ),
      key: "model_scope",
      render: (record: Member) => {
        const models = getUserAllowedModels(record.user_id);
        if (!models) {
          return <span className="text-muted-foreground">{t("member.allTeamModelsInline")}</span>;
        }
        const displayed = models.slice(0, 2);
        const remaining = models.length - displayed.length;
        return (
          <div className="flex flex-wrap gap-1">
            {displayed.map((m) => (
              <code key={m} className="rounded bg-muted px-1 py-0.5 text-xs">
                {m}
              </code>
            ))}
            {remaining > 0 && (
              <SimpleTooltip content={models.slice(2).join(", ")}>
                <span className="text-muted-foreground">{t("member.moreCount", { count: remaining })}</span>
              </SimpleTooltip>
            )}
          </div>
        );
      },
    },
    {
      title: (
        <span className="flex items-center gap-1">
          {t("member.currentCycleSpend")}
          <SimpleTooltip content={t("member.currentCycleSpendTooltip")}>
            <CircleHelp className="size-4" aria-label={t("member.currentCycleSpendInfoAria")} />
          </SimpleTooltip>
        </span>
      ),
      key: "spend",
      sortValue: (record: Member) => getUserCurrentCycleSpend(record.user_id),
      render: (record: Member) => <MoneyCell value={getUserCurrentCycleSpend(record.user_id)} decimals={2} />,
    },
    {
      title: (
        <span className="flex items-center gap-1">
          {t("member.totalSpend")}
          <SimpleTooltip content={t("member.totalSpendTooltip")}>
            <CircleHelp className="size-4" aria-label={t("member.totalSpendInfoAria")} />
          </SimpleTooltip>
        </span>
      ),
      key: "total_spend",
      sortValue: (record: Member) => getUserTotalSpend(record.user_id),
      render: (record: Member) => <MoneyCell value={getUserTotalSpend(record.user_id)} decimals={2} />,
    },
    {
      title: (
        <span className="flex items-center gap-1">
          {t("member.budgetColumn")}
          <SimpleTooltip content={t("member.budgetColumnTooltip")}>
            <CircleHelp className="size-4" aria-label={t("member.budgetInfoAria")} />
          </SimpleTooltip>
        </span>
      ),
      key: "budget",
      sortValue: (record: Member) => getUserBudget(record.user_id),
      render: (record: Member) => {
        const source = getUserBudgetSource(record.user_id);
        return (
          <span className="flex items-center gap-2">
            <MoneyCell value={getUserBudget(record.user_id)} decimals={2} emptyText={t("member.unlimited")} showZero />
            {source !== "none" && (
              <Badge variant={source === "custom" ? "outline" : "secondary"} data-testid="member-budget-source">
                {t(BUDGET_SOURCE_LABEL_KEYS[source])}
              </Badge>
            )}
            {source === "custom" && canEditTeam && (
              <Button
                variant="link"
                size="xs"
                className="h-auto p-0"
                data-testid="reset-member-budget"
                onClick={() => setMemberToResetBudget(record)}
              >
                {t("member.useTeamDefault")}
              </Button>
            )}
          </span>
        );
      },
    },
    {
      title: t("member.budgetReset"),
      key: "budget_reset",
      sortValue: (record: Member) => getUserBudgetReset(record.user_id),
      render: (record: Member) => <DateCell value={getUserBudgetReset(record.user_id)} precision="date" />,
    },
    {
      title: (
        <span className="flex items-center gap-1">
          {t("member.rateLimitsColumn")}
          <SimpleTooltip content={t("member.rateLimitsTooltip")}>
            <CircleHelp className="size-4" aria-label={t("member.rateLimitsInfoAria")} />
          </SimpleTooltip>
        </span>
      ),
      key: "rate_limits",
      render: (record: Member) => <span>{getUserRateLimits(record.user_id)}</span>,
    },
  ];

  const handleResetSpend = () => {
    if (!memberToResetSpend?.user_id) return;
    resetMemberSpend(
      { teamId: teamData.team_id, userId: memberToResetSpend.user_id },
      {
        onSuccess: () => {
          toast.success(t("member.spendResetSuccess"));
          setMemberToResetSpend(null);
          onMemberSpendReset();
        },
        onError: (error) => toast.fromError(parseErrorMessage(error)),
      },
    );
  };

  const handleResetBudget = () => {
    if (!memberToResetBudget?.user_id) return;
    resetMemberBudget(
      { teamId: teamData.team_id, userId: memberToResetBudget.user_id },
      {
        onSuccess: () => {
          toast.success(t("member.budgetResetSuccess"));
          setMemberToResetBudget(null);
          onMemberBudgetReset();
        },
        onError: (error) => toast.fromError(parseErrorMessage(error)),
      },
    );
  };

  return (
    <>
      <MemberTable
        key={teamData.team_id}
        members={teamData.team_info.members_with_roles}
        canEdit={canEditTeam}
        onEdit={(record) => {
          const membership = teamData.team_memberships.find((tm) => tm.user_id === record.user_id);
          setSelectedEditMember(seedMemberBudgetFields(record, membership?.litellm_budget_table));
          setIsEditMemberModalVisible(true);
        }}
        onDelete={handleMemberDelete}
        onAddMember={() => setIsAddMemberModalVisible(true)}
        roleColumnTitle={t("member.teamRole")}
        roleTooltip={t("member.teamRoleTooltip")}
        extraColumns={extraColumns}
        showDeleteForMember={() =>
          isProxyAdmin || (canEditTeam && !isUserTeamAdmin) || (isUserTeamAdmin && !disableTeamAdminDeleteTeamUser)
        }
        onResetSpend={setMemberToResetSpend}
        showResetSpendForMember={(record) =>
          getUserCurrentCycleSpend(record.user_id) > 0 && (isProxyAdmin || record.user_id !== userId)
        }
      />
      <Dialog open={memberToResetSpend !== null} onOpenChange={(open) => !open && setMemberToResetSpend(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("member.resetSpendTitle")}</DialogTitle>
          </DialogHeader>
          <p>
            {t.rich("member.resetSpendBody", {
              name: memberToResetSpend?.user_email || memberToResetSpend?.user_id || "",
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <p className="text-sm text-muted-foreground">
            {t.rich("member.resetSpendDetail", {
              amount: `$${formatNumberWithCommas(getUserCurrentCycleSpend(memberToResetSpend?.user_id ?? null), 4)}`,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMemberToResetSpend(null)}>
              {t("member.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleResetSpend} disabled={isResettingSpend}>
              {t("member.reset")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={memberToResetBudget !== null} onOpenChange={(open) => !open && setMemberToResetBudget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("member.resetBudgetTitle")}</DialogTitle>
          </DialogHeader>
          <p>
            {t.rich("member.resetBudgetBody", {
              name: memberToResetBudget?.user_email || memberToResetBudget?.user_id || "",
              amount: formatBudget(teamDefaultBudget, t),
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <p className="text-sm text-muted-foreground">
            {t.rich("member.resetBudgetDetail", {
              amount: formatBudget(getUserBudget(memberToResetBudget?.user_id ?? null), t),
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMemberToResetBudget(null)}>
              {t("member.cancel")}
            </Button>
            <Button onClick={handleResetBudget} disabled={isResettingBudget}>
              {t("member.useTeamDefault")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
