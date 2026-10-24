import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/utils/dataUtils";

const COPIED_FEEDBACK_MS = 2000;

export const GuardrailIdCopyButton = ({ guardrailId }: { guardrailId: string | null | undefined }) => {
  const commonT = useTranslations("common");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!(await copyToClipboard(guardrailId, commonT("copiedToClipboard")))) return;
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  };

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={handleCopy}
      className={`left-2 z-raised transition-all duration-200 ${
        copied
          ? "text-success bg-success/10 border-success/20"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
    </Button>
  );
};
