import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function RedactableField({
  defaultHidden = true,
  value,
}: {
  defaultHidden?: boolean;
  value: string | null;
}) {
  const t = useTranslations("adminPanel");
  const [isHidden, setIsHidden] = useState(defaultHidden);

  return (
    <div className="flex items-center gap-2">
      <span className="flex-1 font-mono text-muted-foreground">
        {value ? (
          isHidden ? (
            "•".repeat(value.length)
          ) : (
            value
          )
        ) : (
          <span className="text-muted-foreground italic">{t("ssoSettings.notConfigured")}</span>
        )}
      </span>
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={isHidden ? t("ssoSettings.showValue") : t("ssoSettings.hideValue")}
          onClick={() => setIsHidden(!isHidden)}
          className="text-muted-foreground"
        >
          {isHidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
        </Button>
      )}
    </div>
  );
}
