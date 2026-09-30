import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACTION_ITEMS } from "./action_options";

interface CustomPatternModalProps {
  visible: boolean;
  patternName: string;
  patternRegex: string;
  patternAction: "BLOCK" | "MASK";
  onNameChange: (name: string) => void;
  onRegexChange: (regex: string) => void;
  onActionChange: (action: "BLOCK" | "MASK") => void;
  onAdd: () => void;
  onCancel: () => void;
}

const CustomPatternModal: React.FC<CustomPatternModalProps> = ({
  visible,
  patternName,
  patternRegex,
  patternAction,
  onNameChange,
  onRegexChange,
  onActionChange,
  onAdd,
  onCancel,
}) => {
  const t = useTranslations("guardrails");
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("filter.customTitle")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <p className="font-semibold">{t("filter.patternName")}</p>
            <Input
              className="mt-2"
              placeholder="e.g., internal_id, employee_code"
              value={patternName}
              onChange={(e) => onNameChange(e.target.value)}
            />
          </div>

          <div>
            <p className="font-semibold">{t("filter.regexLabel")}</p>
            <Input
              className="mt-2"
              placeholder="e.g., ID-[0-9]{6}"
              value={patternRegex}
              onChange={(e) => onRegexChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">{t("filter.regexHint")}</p>
          </div>

          <div>
            <p className="font-semibold">{t("pii.actionHeader")}</p>
            <p className="mt-1 mb-2 text-muted-foreground">
              {t("filter.actionHintPattern")}
            </p>
            <Select
              items={ACTION_ITEMS.map((item) => ({ value: item.value, label: t(item.labelKey) }))}
              value={patternAction}
              onValueChange={(value: string | null) => value && onActionChange(value as "BLOCK" | "MASK")}
            >
              <SelectTrigger className="w-full" aria-label={t("pii.actionHeader")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTION_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {t(item.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t("form.cancel")}
          </Button>
          <Button onClick={onAdd}>{t("filter.add")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomPatternModal;
