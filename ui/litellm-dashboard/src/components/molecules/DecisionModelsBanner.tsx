import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles, X } from "lucide-react";

import { DECISIONS_DOCS_URL, DECISIONS_PROVIDERS_DOCS_URL, SYSTEM_ONE_PLAYGROUND_ROUTE } from "@/lib/decisionModels";
import { uiHref } from "@/utils/uiHref";

import { Button } from "@/components/ui/button";

const STORAGE_KEY = "hideDecisionModelsBanner";

const DecisionModelsBanner: React.FC = () => {
  const t = useTranslations("molecules.decisionModels");
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
        <p className="m-0 mt-0.5 text-xs text-muted-foreground">
          {t("callBefore")} <code>/v1/decisions</code> {t("or")} <code>/v1/systemone</code>
          {t("orTry")}
          <a href={DECISIONS_DOCS_URL} target="_blank" rel="noopener noreferrer" className="underline">
            {t("howToCall")}
          </a>
        </p>
      </div>
      <Button
        variant="outline"
        className="shrink-0"
        nativeButton={false}
        role="link"
        render={<a href={DECISIONS_PROVIDERS_DOCS_URL} target="_blank" rel="noopener noreferrer" />}
      >
        {t("supportedProviders")}
      </Button>
      <Button
        className="shrink-0"
        nativeButton={false}
        role="link"
        render={<a href={uiHref(SYSTEM_ONE_PLAYGROUND_ROUTE)} />}
      >
        {t("cta")}
        <ArrowRight />
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
