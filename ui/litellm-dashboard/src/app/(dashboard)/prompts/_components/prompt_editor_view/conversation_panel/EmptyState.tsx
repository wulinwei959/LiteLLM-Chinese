import React from "react";
import { useTranslations } from "next-intl";
import { Bot } from "lucide-react";

interface EmptyStateProps {
  hasVariables: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasVariables }) => {
  const t = useTranslations("prompts");
  return (
    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
      <Bot className="mb-4 size-12" aria-hidden="true" />
      <span className="text-base">
        {hasVariables
          ? t("editor.emptyVars")
          : t("editor.emptyPlain")}
      </span>
    </div>
  );
};

export default EmptyState;
