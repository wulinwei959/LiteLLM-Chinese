"use client";

import { Page, PageTabs, PageTabsList, PageTabsTrigger } from "@/components/shared/Page";
import React from "react";
import { Info, PiggyBank } from "lucide-react";
import { useTranslations } from "next-intl";

import useCan from "@/app/(dashboard)/hooks/useCan";
import { Alert, AlertDescription } from "@/components/shared/Alert";
import { TabsContent } from "@/components/ui/tabs";
import { PageHeader, PageHeaderControls, PageHeaderDescription, PageHeaderTitle } from "@/components/shared/PageHeader";
import UsageTab from "./UsageTab";
import PromptCompressionTab from "./PromptCompressionTab";
import PromptCachingTab from "./PromptCachingTab";
import AutoRouterBenchmarksTab from "./AutoRouterBenchmarksTab";
import { useDailyActivityRange } from "./useDailyActivityRange";

interface CostOptimizationViewProps {
  accessToken: string | null;
  userId: string | null;
  userRole: string;
}

const CostOptimizationView: React.FC<CostOptimizationViewProps> = ({ accessToken, userId, userRole }) => {
  const t = useTranslations("costOptimization");
  const activity = useDailyActivityRange(accessToken, userId, userRole);
  const canViewProxyWideCostData = useCan("viewProxyWideCostData");
  const [visitedTabs, setVisitedTabs] = React.useState<readonly string[]>(["usage"]);

  const handleTabChange = (value: unknown) => {
    if (typeof value !== "string") {
      return;
    }

    setVisitedTabs((currentTabs) => (currentTabs.includes(value) ? currentTabs : [...currentTabs, value]));
  };

  return (
    <Page>
      <PageTabs defaultValue="usage" onValueChange={handleTabChange}>
        <PageHeader>
          <PageHeaderTitle>
            <PiggyBank />
            {t("view.title")}
          </PageHeaderTitle>
          <PageHeaderDescription>{t("view.subtitle")}</PageHeaderDescription>
          <PageHeaderControls>
            <PageTabsList>
              <PageTabsTrigger value="usage">{t("view.tabOverall")}</PageTabsTrigger>
              {canViewProxyWideCostData && (
                <>
                  <PageTabsTrigger value="compression">{t("view.tabCompression")}</PageTabsTrigger>
                  <PageTabsTrigger value="caching">{t("view.tabCaching")}</PageTabsTrigger>
                  <PageTabsTrigger value="autorouter-usage">{t("view.tabAutoRouter")}</PageTabsTrigger>
                </>
              )}
            </PageTabsList>
          </PageHeaderControls>
        </PageHeader>

        <div
          role="alert"
          className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-lg border border-border bg-muted/50 px-4 py-4"
        >
          <Info className="mt-0.5 size-5 text-primary" aria-hidden="true" />
          <p className="font-medium text-foreground">{t("view.experimental")}</p>
          <p className="col-start-2 text-sm text-muted-foreground">
            {t("view.feedbackPre")}{" "}
            <a
              href="https://github.com/BerriAI/litellm/discussions/32168"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              {t("view.feedbackLink")}
            </a>
          </p>
        </div>

        {activity.failed && (
          <Alert variant="error">
            <AlertDescription className="text-inherit">{t("view.spendFetchFailedAlert")}</AlertDescription>
          </Alert>
        )}
        <TabsContent value="usage" keepMounted={visitedTabs.includes("usage")}>
          <UsageTab accessToken={accessToken} activity={activity} />
        </TabsContent>
        {canViewProxyWideCostData && (
          <>
            <TabsContent value="compression" keepMounted={visitedTabs.includes("compression")}>
              <PromptCompressionTab accessToken={accessToken} />
            </TabsContent>
            <TabsContent value="caching" keepMounted={visitedTabs.includes("caching")}>
              <PromptCachingTab accessToken={accessToken} activity={activity} />
            </TabsContent>
            <TabsContent value="autorouter-usage" keepMounted={visitedTabs.includes("autorouter-usage")}>
              <AutoRouterBenchmarksTab accessToken={accessToken} activity={activity} />
            </TabsContent>
          </>
        )}
      </PageTabs>
    </Page>
  );
};

export default CostOptimizationView;
