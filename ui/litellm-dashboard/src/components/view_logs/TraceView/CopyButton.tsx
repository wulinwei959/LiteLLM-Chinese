"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/cva.config";
import { copyToClipboard } from "@/utils/dataUtils";

const COPIED_RESET_MS = 1600;

interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  iconOnly?: boolean;
  className?: string;
}

/** Copy → check for a moment. `iconOnly` renders a bare icon button with a tooltip. */
export function CopyButton({ value, label, copiedLabel, iconOnly = false, className }: CopyButtonProps) {
  const t = useTranslations("logs");
  const copyLabel = label ?? t("trace.copy");
  const copiedText = copiedLabel ?? t("trace.copied");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const button = (
    <Button
      variant={iconOnly ? "ghost" : "outline"}
      size={iconOnly ? "icon-xs" : "xs"}
      className={cn(
        "font-mono text-[10px] text-muted-foreground hover:text-foreground",
        !iconOnly && "gap-1.5",
        className,
      )}
      onClick={async () => setCopied(await copyToClipboard(value, copiedText))}
      aria-label={copyLabel}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {!iconOnly && <span>{copied ? copiedText : copyLabel}</span>}
    </Button>
  );

  if (!iconOnly) return button;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={button} />
        <TooltipContent>{copied ? copiedText : copyLabel}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
