"use client";

import { ArrowUpRight, SearchX, TriangleAlert } from "lucide-react";
import { LoadingState } from "../../shared/LoadingState";
import { StateMessage } from "../../shared/StateMessage";
import { Button, buttonVariants } from "../../ui/button";

import { ApiError } from "../../../lib/http/client";
import { STANDALONE_DOCS_URL, useLensHost } from "../../../host/LensHost";
import { useLensTranslate } from "../../../host/useLensTranslate";
import { lensTranslate } from "../../../host/lensTranslate";

const DOCS_URL = "https://docs.litellm.ai/docs/proxy/lens";

function DocsLink() {
  const t = useLensTranslate();
  const standalone = useLensHost().surface === "standalone";
  return (
    <a
      href={standalone ? STANDALONE_DOCS_URL : DOCS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonVariants({ variant: "ghost", size: "sm" })}
    >
      {t("investigations.lensDocs")}<ArrowUpRight aria-hidden="true" className="size-3.5" />
    </a>
  );
}

function loadFailureMessage(
  queryError: unknown,
  unavailable: boolean,
  standalone: boolean,
): string {
  if (standalone && unavailable)
    return lensTranslate("investigations.lensDidRecognizeAPI");
  if (unavailable)
    return lensTranslate("investigations.dashboardMayNewerProxy");
  if (queryError instanceof Error) return queryError.message;
  return standalone
    ? lensTranslate("investigations.somethingWentWrongWhile")
    : lensTranslate("investigations.somethingWentWrongWhileContactingTheProxy");
}

export function InvestigationsLoadFailed({
  queryError,
  refresh,
}: {
  queryError: unknown;
  refresh: () => void;
}) {
  const t = useLensTranslate();
  const standalone = useLensHost().surface === "standalone";
  const unavailable =
    queryError instanceof ApiError && queryError.status === 404;
  return (
    <StateMessage
      role="alert"
      tone="destructive"
      icon={<TriangleAlert className="size-5" />}
      title={
        unavailable ? t("investigations.lensAPIUnavailable") : t("investigations.couldnTLoadInvestigations")
      }
      description={loadFailureMessage(queryError, unavailable, standalone)}
    >
      <Button
        size="sm"
        onClick={() => (unavailable ? window.location.reload() : refresh())}
      >
        {unavailable ? t("investigations.reloadPage") : t("agents.tryAgain")}
      </Button>
      <DocsLink />
    </StateMessage>
  );
}

export function InvestigationError({
  message,
  refresh,
}: {
  message: string;
  refresh: () => void;
}) {
  const t = useLensTranslate();
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
    >
      <span className="min-w-0">{message}</span>
      <Button variant="ghost" size="sm" onClick={refresh}>
        {t("investigations.retry")}</Button>
    </div>
  );
}

export function InvestigationsLoading() {
  return (
    <LoadingState
      title={lensTranslate("investigations.loadingInvestigations")}
      description={lensTranslate("investigations.fetchingInvestigationsLatestFindings")}
    />
  );
}

export function InvestigationMissing({
  selectLens,
}: {
  selectLens: (id: string | null) => void;
}) {
  const t = useLensTranslate();
  const standalone = useLensHost().surface === "standalone";
  return (
    <StateMessage
      role="alert"
      icon={<SearchX className="size-5" />}
      title={t("investigations.investigationFound")}
      description={
        standalone
          ? t("investigations.mayBeenDeletedLink")
          : t("investigations.itMayHaveBeenDeletedOrTheLink")
      }
    >
      <Button size="sm" onClick={() => selectLens(null)}>
        {t("investigations.viewAllInvestigations")}</Button>
    </StateMessage>
  );
}
