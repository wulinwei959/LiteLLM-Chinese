import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatNumberWithCommas } from "@/utils/dataUtils";
import type { MemberBudgetResetState } from "./useMemberBudgetReset";

interface ResetMemberBudgetsDialogProps {
  state: MemberBudgetResetState;
  onReset: () => void;
  onRetry: () => void;
  onKeep: () => void;
  onDismiss: () => void;
}

export default function ResetMemberBudgetsDialog({
  state,
  onReset,
  onRetry,
  onKeep,
  onDismiss,
}: ResetMemberBudgetsDialogProps) {
  const t = useTranslations("teams");
  const open = state.phase !== "idle";
  const busy = state.phase === "resetting";
  const failed = state.phase === "resetFailed";
  const memberCount = state.phase === "idle" ? 0 : state.pending.userIds.length;
  const newBudget = state.phase === "idle" ? 0 : state.pending.newBudget;
  const formattedBudget = formatNumberWithCommas(newBudget, 2);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !busy) onDismiss();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("resetMemberTitle")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {t(memberCount === 1 ? "resetMemberPromptOne" : "resetMemberPromptOther", {
            count: memberCount,
            budget: formattedBudget,
          })}
        </p>
        <DialogFooter>
          {failed ? (
            <>
              <Button variant="outline" onClick={onDismiss}>
                {t("resetMemberCancel")}
              </Button>
              <Button onClick={onRetry}>{t("resetMemberRetry")}</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={onDismiss} disabled={busy}>
                {t("resetMemberCancel")}
              </Button>
              <Button variant="outline" onClick={onKeep} disabled={busy}>
                {memberCount === 1 ? t("resetMemberKeepOne") : t("resetMemberKeepOther")}
              </Button>
              <Button onClick={onReset} disabled={busy}>
                {t(memberCount === 1 ? "resetMemberResetOne" : "resetMemberResetOther", { budget: formattedBudget })}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
