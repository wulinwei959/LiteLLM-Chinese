"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TelemetryEnterpriseDialog({
  open,
  onOpenChange,
  premiumUser,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  premiumUser: boolean;
}) {
  const t = useTranslations("telemetry.enterprise");

  return (
    <Dialog open={open} onOpenChange={(next) => onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{premiumUser ? t("titlePremium") : t("titleEnterpriseOnly")}</DialogTitle>
          <DialogDescription>{premiumUser ? t("bodyPremium") : t("bodyEnterpriseOnly")}</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
