import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ACTION_ITEMS } from "./action_options";

interface KeywordModalProps {
  visible: boolean;
  keyword: string;
  action: "BLOCK" | "MASK";
  description: string;
  onKeywordChange: (keyword: string) => void;
  onActionChange: (action: "BLOCK" | "MASK") => void;
  onDescriptionChange: (description: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

const KeywordModal: React.FC<KeywordModalProps> = ({
  visible,
  keyword,
  action,
  description,
  onKeywordChange,
  onActionChange,
  onDescriptionChange,
  onAdd,
  onCancel,
}) => {
  const t = useTranslations("guardrails");
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("filter.keywordTitle")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <p className="font-semibold">{t("filter.keywordLabel")}</p>
            <Input
              className="mt-2"
              placeholder={t("filter.keywordPlaceholder")}
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
            />
          </div>

          <div>
            <p className="font-semibold">{t("pii.actionHeader")}</p>
            <p className="mt-1 mb-2 text-muted-foreground">
              {t("filter.actionHintKeyword")}
            </p>
            <Select
              items={ACTION_ITEMS.map((item) => ({ value: item.value, label: t(item.labelKey) }))}
              value={action}
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

          <div>
            <p className="font-semibold">{t("filter.descLabel")}</p>
            <Textarea
              className="mt-2 field-sizing-fixed"
              placeholder={t("filter.descPlaceholder")}
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
            />
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

export default KeywordModal;
