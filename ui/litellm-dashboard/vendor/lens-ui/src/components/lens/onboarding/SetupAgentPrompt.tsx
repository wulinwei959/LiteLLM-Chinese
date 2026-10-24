"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTimeout } from "usehooks-ts";
import { Button } from "../../ui/button";
import { copyToClipboard } from "../../../utils/dataUtils";
import { useLensHost } from "../../../host/LensHost";
import { getRequestBaseUrl } from "../../../lib/http/runtime";
import claudeCodeLogo from "../../../../public/assets/logos/claude-code.svg";
import codexLogo from "../../../../public/assets/logos/codex.svg";
import {
  setupPrompt,
  type SetupConnection,
  type SetupEval,
  type SetupGoal,
} from "./setupPrompt";
import { useLensTranslate } from "../../../host/useLensTranslate";

export function SetupAgentPrompt({
  goal = "start",
  connection,
  evaluation,
  featureConfigured,
  agentName,
  prominent = false,
}: {
  readonly goal?: SetupGoal;
  readonly connection?: SetupConnection;
  readonly evaluation?: SetupEval;
  readonly featureConfigured?: boolean;
  readonly agentName?: string;
  readonly prominent?: boolean;
}) {
  const t = useLensTranslate();
  const standalone = useLensHost().surface === "standalone";
  const [baseUrl, setBaseUrl] = useState("");
  const [copied, setCopied] = useState(false);
  useTimeout(() => setCopied(false), copied ? 1600 : null);
  const currentBaseUrl = () => getRequestBaseUrl() || window.location.origin;
  useEffect(() => {
    setBaseUrl(getRequestBaseUrl() || window.location.origin);
  }, []);
  const context = {
    standalone,
    goal,
    connection,
    evaluation,
    featureConfigured,
    agentName,
  };
  const prompt = setupPrompt({ ...context, baseUrl });
  const copy = async () => {
    const current = currentBaseUrl();
    setBaseUrl(current);
    setCopied(
      await copyToClipboard(
        setupPrompt({ ...context, baseUrl: current }),
        t("onboarding.promptCopied"),
      ),
    );
  };
  return (
    <div
      className={
        prominent
          ? "w-full rounded-lg border bg-card p-5 text-sm sm:p-6"
          : "my-4 w-full rounded-lg border bg-muted/20 p-4 text-sm"
      }
    >
      {prominent && (
        <div className="mb-5 space-y-4">
          <div>
            <h3 className="text-base font-medium">
              {t("onboarding.giveCodingAgent")}</h3>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <img src={claudeCodeLogo.src} alt="Claude Code logo" className="size-6 object-contain" />
                Claude Code
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <img src={codexLogo.src} alt="Codex logo" className="size-5 object-contain dark:invert" />
                Codex
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("onboarding.openProjectCodingAgent")}</p>
          </div>
          <blockquote className="rounded-md bg-muted/40 p-4 text-sm leading-7">
            {t("onboarding.connectProjectLensSend")}</blockquote>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={prominent ? "default" : "outline"}
          size={prominent ? "default" : "sm"}
          aria-label={
            prominent ? t("onboarding.copySetupInstructions") : t("onboarding.setUpMe")
          }
          onClick={() => void copy()}
        >
          {copied ? (
            <Check aria-hidden="true" className="size-3.5" />
          ) : (
            <Copy aria-hidden="true" className="size-3.5" />
          )}
          {copied
            ? t("onboarding.promptCopied")
            : prominent
              ? t("onboarding.copySetupInstructions")
              : t("onboarding.setUpMe")}
        </Button>
        <p className="text-xs leading-5 text-muted-foreground">
          {prominent
            ? t("onboarding.includesLensAddressKeys")
            : t("onboarding.copyPromptCodingAgent")}
        </p>
      </div>
      <details
        className="mt-2 text-xs text-muted-foreground"
        onToggle={(event) => {
          if (event.currentTarget.open) setBaseUrl(currentBaseUrl());
        }}
      >
        <summary className="w-fit cursor-pointer">
          {prominent ? t("onboarding.viewFullInstructions") : t("onboarding.viewPrompt")}
        </summary>
        <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words font-sans leading-5">
          {prompt}
        </pre>
      </details>
    </div>
  );
}
