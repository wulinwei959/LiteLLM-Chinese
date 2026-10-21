import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ExternalLink, MessageSquare, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "hideDecisionModelsBanner";

const CostOptimizationFeedbackBanner: React.FC = () => {
  const t = useTranslations("banners.costOptimizationFeedback");
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEY) === "true";
    }
    return false;
  });

  if (dismissed) {
    return null;
  }

  return (
    <div className="mb-4 flex items-center gap-4 rounded-lg border bg-muted/40 px-4 py-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-background">
        <Sparkles className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="m-0 text-sm font-semibold text-foreground">{t("title")}</h4>
        <p className="m-0 mt-0.5 text-xs text-muted-foreground">{t("description")}</p>
      </div>
      <Button
        variant="outline"
        className="shrink-0"
        nativeButton={false}
        role="link"
        render={<a href={DECISIONS_PROVIDERS_DOCS_URL} target="_blank" rel="noopener noreferrer" />}
      >
        Supported providers
      </Button>
      <Button
        className="shrink-0"
        nativeButton={false}
        role="link"
        render={<a href={uiHref(SYSTEM_ONE_PLAYGROUND_ROUTE)} />}
      >
        {t("cta")}
        <ExternalLink />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => {
          setDismissed(true);
          localStorage.setItem(STORAGE_KEY, "true");
        }}
        className="shrink-0"
        aria-label={t("dismiss")}
      >
        <X />
      </Button>
    </div>
  );
};

export default DecisionModelsBanner;
