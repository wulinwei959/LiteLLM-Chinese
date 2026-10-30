"use client";

import { useTranslations } from "next-intl";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useSyntaxTheme } from "@/hooks/useSyntaxTheme";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type GeneratedCodeSdk = "openai" | "azure";

const SDK_ITEMS = [
  { value: "openai", label: "OpenAI SDK" },
  { value: "azure", label: "Azure SDK" },
] as const;

interface GeneratedCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
  sdk: GeneratedCodeSdk;
  onSdkChange: (sdk: GeneratedCodeSdk) => void;
}

export default function GeneratedCodeDialog({ open, onOpenChange, code, sdk, onSdkChange }: GeneratedCodeDialogProps) {
  const t = useTranslations("playground");
  const syntaxTheme = useSyntaxTheme(coy);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("chat.generatedCodeTitle")}</DialogTitle>
        </DialogHeader>
        <div className="my-2 flex items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-sm font-medium text-foreground">{t("chat.sdkType")}</p>
            <ShadcnSelect items={SDK_ITEMS} value={sdk} onValueChange={(value) => onSdkChange(value as GeneratedCodeSdk)}>
              <SelectTrigger className="w-[150px]" size="sm" aria-label={t("chat.sdkType")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SDK_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </ShadcnSelect>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(code).then(
                () => toast.success(t("chat.copyingCode")),
                () => toast.error(t("chat.copyFailed")),
              );
            }}
          >
            {t("chat.copyToClipboard")}
          </Button>
        </div>
        <SyntaxHighlighter
          language="python"
          style={syntaxTheme}
          wrapLines={true}
          wrapLongLines={true}
          className="rounded-md"
          customStyle={{
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </DialogContent>
    </Dialog>
  );
}
