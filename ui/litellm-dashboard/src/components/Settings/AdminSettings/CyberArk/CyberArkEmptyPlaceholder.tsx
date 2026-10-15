import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface CyberArkEmptyPlaceholderProps {
  onAdd: () => void;
}

export default function CyberArkEmptyPlaceholder({ onAdd }: CyberArkEmptyPlaceholderProps) {
  const t = useTranslations("secretManager");
  return (
    <div className="flex w-full flex-col items-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
        <KeyRound className="size-6 text-muted-foreground" />
      </div>
      <h4 className="text-base font-semibold text-foreground">{t("cyberark.emptyTitle")}</h4>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{t("cyberark.emptyDescription")}</p>
      <Button size="lg" onClick={onAdd} className="mt-4">
        {t("cyberark.emptyAction")}
      </Button>
    </div>
  );
}
