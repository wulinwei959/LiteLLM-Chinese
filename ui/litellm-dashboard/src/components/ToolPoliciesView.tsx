"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import useCan from "@/app/(dashboard)/hooks/useCan";
import { ToolDetail } from "@/components/ToolDetail";
import { ToolPoliciesPanel } from "@/components/ToolPolicies/ToolPoliciesPanel";

type View = { type: "overview" } | { type: "detail"; toolName: string };

interface ToolPoliciesViewProps {
  accessToken: string | null;
}

export default function ToolPoliciesView({ accessToken }: ToolPoliciesViewProps) {
  const canViewToolPolicies = useCan("viewToolPolicies");
  const navT = useTranslations("nav");
  const commonT = useTranslations("common");
  const [view, setView] = useState<View>({ type: "overview" });

  const handleSelectTool = (toolName: string) => {
    setView({ type: "detail", toolName });
  };

  const handleBack = () => {
    setView({ type: "overview" });
  };

  if (!canViewToolPolicies) {
    return (
      <div className="p-6 w-full min-w-0 flex-1">
        <h1 className="text-2xl font-semibold text-foreground mb-2">{navT("toolPolicies")}</h1>
        <p className="text-sm text-muted-foreground">{commonT("adminOnlyNotice", { pageTitle: navT("toolPolicies") })}</p>
      </div>
    );
  }

  return (
    <div className="p-6 w-full min-w-0 flex-1">
      {view.type === "detail" ? (
        <ToolDetail toolName={view.toolName} onBack={handleBack} accessToken={accessToken} />
      ) : (
        <ToolPoliciesPanel accessToken={accessToken} onSelectTool={handleSelectTool} />
      )}
    </div>
  );
}
