"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ToolsetsInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ToolsetsInfoDialog({ open, onOpenChange }: ToolsetsInfoDialogProps) {
  const t = useTranslations("playground");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("toolsets.howItWorks")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-foreground">
            {t.rich("toolsets.toolsetsAre", {
              b: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">{t("toolsets.howToUse")}</h4>
            <ol className="list-inside list-decimal space-y-2 text-foreground">
              <li>
                {t.rich("toolsets.step1", {
                  strong: (chunks) => <span className="font-semibold text-violet-600">{chunks}</span>,
                })}
              </li>
              <li>{t("toolsets.step2")}</li>
              <li>{t("toolsets.step3")}</li>
              <li>{t("toolsets.step4")}</li>
            </ol>
          </div>
          <div className="rounded-sm border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-950">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              {t.rich("toolsets.example", {
                b: (chunks) => <strong>{chunks}</strong>,
                code: (chunks) => <code>{chunks}</code>,
              })}
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold text-foreground">{t("toolsets.creatingToolsets")}</h4>
            <p className="text-sm text-muted-foreground">
              {t.rich("toolsets.creatingDesc", {
                b: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("toolsets.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
