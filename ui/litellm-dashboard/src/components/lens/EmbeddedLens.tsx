"use client";

import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { configureLensHttp, LensHostProvider, LensWorkspace, type LensHost } from "@litellm/lens-ui";
import { LogDetailsDrawer } from "@/components/logs/detail";
import { getGlobalLitellmHeaderName, getProxyBaseUrl, handleError, uiSpendLogsCall } from "@/components/networking";
import { getAuthToken } from "@/lib/http/runtime";
import { serverRootPath } from "@/lib/serverRootPath";

const host: LensHost = {
  surface: "embedded",
  analysis: "deployment",
  spendLogs: { lookup: uiSpendLogsCall, Drawer: LogDetailsDrawer },
};

const http = {
  getBaseUrl: getProxyBaseUrl,
  getAuthToken,
  getAuthHeaderName: getGlobalLitellmHeaderName,
  onError: handleError,
  getServerRootPath: () => serverRootPath,
};

configureLensHttp(http);

export function EmbeddedLens(props: ComponentProps<typeof LensWorkspace>) {
  const translator = useTranslations("lens");
  const hostWithTranslator = { ...host, t: translator as LensHost["t"] };
  return (
    <LensHostProvider host={hostWithTranslator}>
      <LensWorkspace {...props} />
    </LensHostProvider>
  );
}
