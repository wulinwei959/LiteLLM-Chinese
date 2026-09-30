import React from "react";
import { useTranslations } from "next-intl";
import { LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface PublishModalProps {
  visible: boolean;
  promptName: string;
  isSaving: boolean;
  onNameChange: (name: string) => void;
  onPublish: () => void;
  onCancel: () => void;
}

const PublishModal: React.FC<PublishModalProps> = ({
  visible,
  promptName,
  isSaving,
  onNameChange,
  onPublish,
  onCancel,
}) => {
  const t = useTranslations("prompts");
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editor.publishTitle")}</DialogTitle>
          <DialogDescription>{t("editor.publishDesc")}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <label htmlFor="publish-prompt-name" className="mb-2 block">
            {t("editor.nameLabel")}
          </label>
          <Input
            id="publish-prompt-name"
            value={promptName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={t("editor.namePlaceholder")}
            onKeyDown={(event) => event.key === "Enter" && onPublish()}
            autoFocus
          />
          <p className="text-muted-foreground text-xs mt-2">
            {t("editor.publishHint")}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {t("form.cancel")}
          </Button>
          <Button onClick={onPublish} disabled={isSaving}>
            {isSaving && <LoaderCircleIcon className="animate-spin" />}
            {t("editor.publish")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishModal;
