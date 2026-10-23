"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { apiClient } from "@/components/networking";
import { extractErrorMessage } from "@/utils/errorUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { ROIRepository, ROIRepositoriesResponse, ROISettings, ROISettingsUpdate } from "./roiCalculatorData";

export default function ROISettingsPanel({
  accessToken,
  initialSettings,
  onboarding,
  onSaved,
  onReset,
  onStartSync,
  readOnly,
  syncDisabled,
}: {
  accessToken: string | null;
  initialSettings: ROISettings;
  onboarding: boolean;
  onSaved: (settings: ROISettings) => void;
  onReset: (settings: ROISettings) => void;
  onStartSync: () => Promise<void>;
  readOnly: boolean;
  syncDisabled: boolean;
}) {
  const t = useTranslations("roiCalculator");
  const commonT = useTranslations("common");
  const initialStep = initialSettings.has_github_token ? 1 : 0;
  const [step, setStep] = React.useState(initialSettings.ready ? 2 : initialStep);
  const [apiUrl, setApiUrl] = React.useState(initialSettings.github_api_url);
  const [token, setToken] = React.useState("");
  const [clearToken, setClearToken] = React.useState(false);
  const [repos, setRepos] = React.useState(initialSettings.repos);
  const [model, setModel] = React.useState(initialSettings.estimator_model);
  const [prompt, setPrompt] = React.useState(initialSettings.estimator_prompt);
  const [backfillDays, setBackfillDays] = React.useState(String(initialSettings.backfill_days));
  const [intervalHours, setIntervalHours] = React.useState(
    String((initialSettings.update_interval_minutes ?? 1440) / 60),
  );
  const [estimatorKey, setEstimatorKey] = React.useState("");
  const [clearEstimatorKey, setClearEstimatorKey] = React.useState(false);
  const [repositoryName, setRepositoryName] = React.useState("");
  const [resetOpen, setResetOpen] = React.useState(false);
  const [repositoryQuery, setRepositoryQuery] = React.useState("");
  const [repositoryPage, setRepositoryPage] = React.useState(1);
  const [availableRepos, setAvailableRepos] = React.useState<ROIRepository[]>([]);
  const [hasMoreRepos, setHasMoreRepos] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const canLoadRepositories =
    initialSettings.has_github_token && !token.trim() && apiUrl === initialSettings.github_api_url;

  const loadRepositories = async (page: number) => {
    if (!accessToken || !canLoadRepositories) return;
    try {
      setBusy(true);
      const response: ROIRepositoriesResponse = await apiClient.get("/roi-calculator/repositories", {
        accessToken,
        query: { query: repositoryQuery, page },
      });
      setAvailableRepos((current) => (page === 1 ? response.repositories : [...current, ...response.repositories]));
      setHasMoreRepos(response.has_more);
      setRepositoryPage(page);
      setError(null);
    } catch (reason) {
      setError(extractErrorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  const saveSettings = async () => {
    if (!accessToken || readOnly) return false;
    const body: ROISettingsUpdate = {
      github_api_url: apiUrl,
      repos,
      estimator_model: model,
      estimator_prompt: prompt,
      backfill_days: Number(backfillDays),
      update_interval_minutes: Number(intervalHours) * 60,
      ...(clearEstimatorKey ? { estimator_key: null } : {}),
      ...(estimatorKey.trim() ? { estimator_key: estimatorKey.trim() } : {}),
      ...(clearToken ? { github_token: null } : {}),
      ...(token.trim() ? { github_token: token.trim() } : {}),
    };
    try {
      setBusy(true);
      const updated: ROISettings = await apiClient.put("/roi-calculator/settings", { accessToken, body });
      onSaved(updated);
      setToken("");
      setEstimatorKey("");
      setClearEstimatorKey(false);
      setClearToken(false);
      setMessage(t("settingsSaved"));
      setError(null);
      return true;
    } catch (reason) {
      setError(extractErrorMessage(reason));
      setMessage(null);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!(await saveSettings())) return;
    if (onboarding && step === 0) {
      try {
        const result = await apiClient.get<ROIRepositoriesResponse>("/roi-calculator/repositories", { accessToken });
        setAvailableRepos(result.repositories);
        setHasMoreRepos(result.has_more);
        setRepositoryPage(1);
        setStep(1);
      } catch (reason) {
        setError(extractErrorMessage(reason));
      }
    } else if (onboarding && step === 1) setStep(2);
    else if (onboarding) await onStartSync();
  };

  const saveAndRun = async () => {
    if (await saveSettings()) await onStartSync();
  };

  const testConnections = async () => {
    if (!(await saveSettings())) return;
    setBusy(true);
    try {
      await apiClient.post("/roi-calculator/connections/test", { accessToken });
      setMessage(t("connectionsAvailable"));
    } catch (reason) {
      setError(extractErrorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  const resetSetup = async () => {
    setBusy(true);
    try {
      const updated = await apiClient.post<ROISettings>("/roi-calculator/setup/reset", { accessToken });
      setRepos([]);
      setStep(updated.has_github_token ? 1 : 0);
      setResetOpen(false);
      onReset(updated);
    } catch (reason) {
      setError(extractErrorMessage(reason));
    } finally {
      setBusy(false);
    }
  };

  const toggleRepository = (name: string) => {
    setRepos((current) => (current.includes(name) ? current.filter((repo) => repo !== name) : [...current, name]));
  };

  const formDisabled = busy || syncDisabled;
  const runDisabled = formDisabled || !repos.length || !model;
  const githubUrlChanged = apiUrl !== initialSettings.github_api_url;
  const missingReplacementToken = initialSettings.has_github_token && githubUrlChanged && !token.trim();
  const stepReady = [Boolean(token.trim() || initialSettings.has_github_token), repos.length > 0, Boolean(model)][step];
  const onboardingLabel = step < 2 ? commonT("continue") : t("startBackfill");
  const submitLabel = onboarding ? onboardingLabel : t("saveSettings");

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base leading-normal font-medium">
          {onboarding
            ? [t("connectGithubHeading"), t("chooseRepositoriesHeading"), t("chooseEstimatorHeading")][step]
            : t("settingsHeading")}
        </h2>
        <CardDescription>{onboarding ? t("onboardingDescription") : t("settingsDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="text-sm text-emerald-700" role="status">
            {message}
          </p>
        )}
        {onboarding && <p className="text-sm text-muted-foreground">{t("stepIndicator", { step: step + 1 })}</p>}
        <form className="space-y-5" onSubmit={(event) => void submit(event)}>
          <fieldset disabled={busy || syncDisabled || readOnly} className="space-y-5">
            {(!onboarding || step === 0) && (
              <>
                <details>
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    {t("githubEnterpriseSettings")}
                  </summary>
                  <div className="mt-3 grid gap-2">
                    <Label htmlFor="roi-github-url">{t("githubApiUrl")}</Label>
                    <Input
                      disabled={readOnly}
                      id="roi-github-url"
                      value={apiUrl}
                      onChange={(event) => setApiUrl(event.target.value)}
                    />
                  </div>
                </details>
                <div className="grid gap-2">
                  <Label htmlFor="roi-github-token">{t("githubToken")}</Label>
                  <Input
                    autoComplete="new-password"
                    disabled={readOnly}
                    id="roi-github-token"
                    type="password"
                    value={token}
                    onChange={(event) => {
                      setToken(event.target.value);
                      setClearToken(false);
                    }}
                    placeholder={initialSettings.has_github_token ? t("tokenSaved") : t("enterGithubToken")}
                  />
                  <p className="text-xs text-muted-foreground">
                    {initialSettings.has_github_token ? t("tokenSavedHelp") : t("tokenHelp")}
                  </p>
                  {missingReplacementToken && <p className="text-xs text-amber-700">{t("githubUrlChangedWarning")}</p>}
                  {initialSettings.has_github_token && (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        aria-label={t("clearGithubTokenAriaLabel")}
                        checked={clearToken}
                        disabled={readOnly}
                        type="checkbox"
                        onChange={(event) => setClearToken(event.target.checked)}
                      />
                      {t("clearSavedToken")}
                    </label>
                  )}
                </div>
              </>
            )}
            {(!onboarding || step === 1) && (
              <div className="grid gap-2">
                <Label htmlFor="roi-repository-search">{t("repositories")}</Label>
                <div className="flex gap-2">
                  <Input
                    id="roi-repository-search"
                    value={repositoryQuery}
                    onChange={(event) => setRepositoryQuery(event.target.value)}
                    placeholder={t("searchRepositories")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy || !canLoadRepositories}
                    onClick={() => void loadRepositories(1)}
                  >
                    {t("loadRepositories")}
                  </Button>
                </div>
                {!canLoadRepositories && <p className="text-xs text-muted-foreground">{t("saveTokenBeforeLoading")}</p>}
                {repos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {repos.map((repo) => (
                      <Button
                        key={repo}
                        type="button"
                        variant="outline"
                        disabled={readOnly}
                        onClick={() => toggleRepository(repo)}
                        aria-label={t("removeRepositoryAriaLabel", { repo })}
                      >
                        {repo} ×
                      </Button>
                    ))}
                  </div>
                )}
                <details>
                  <summary className="cursor-pointer text-xs text-muted-foreground">{t("addRepositoryByName")}</summary>
                  <div className="mt-2 flex gap-2">
                    <Input
                      aria-label={t("repositoryName")}
                      placeholder="owner/repository"
                      value={repositoryName}
                      onChange={(e) => setRepositoryName(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!repositoryName.trim()}
                      onClick={() => {
                        if (!repos.includes(repositoryName.trim())) setRepos([...repos, repositoryName.trim()]);
                        setRepositoryName("");
                      }}
                    >
                      {commonT("add")}
                    </Button>
                  </div>
                </details>
                <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-3">
                  {availableRepos.map((repository) => (
                    <label key={repository.name} className="flex items-center gap-2 text-sm">
                      <input
                        aria-label={t("selectRepositoryAriaLabel", { repo: repository.name })}
                        checked={repos.includes(repository.name)}
                        disabled={readOnly}
                        type="checkbox"
                        onChange={() => toggleRepository(repository.name)}
                      />
                      <span>{repository.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {repository.visibility}
                        {repository.archived ? t("archivedSuffix") : ""}
                      </span>
                    </label>
                  ))}
                  {availableRepos.length === 0 && (
                    <p className="text-sm text-muted-foreground">{t("loadRepositoriesHint")}</p>
                  )}
                </div>
                {hasMoreRepos && (
                  <Button
                    type="button"
                    variant="link"
                    className="w-fit px-0"
                    disabled={busy}
                    onClick={() => void loadRepositories(repositoryPage + 1)}
                  >
                    {t("loadMoreRepositories")}
                  </Button>
                )}
              </div>
            )}
            {(!onboarding || step === 2) && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="roi-estimator-model">{t("estimatorModel")}</Label>
                  <select
                    id="roi-estimator-model"
                    className="h-9 rounded-md border bg-background px-3 text-sm"
                    disabled={readOnly}
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                  >
                    <option value="">{t("selectRouterModel")}</option>
                    {model && !initialSettings.available_models.includes(model) && (
                      <option value={model}>{model}</option>
                    )}
                    {initialSettings.available_models.map((availableModel) => (
                      <option key={availableModel} value={availableModel}>
                        {availableModel}
                      </option>
                    ))}
                  </select>
                </div>
                <details>
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    {t("advancedEstimatorOptions")}
                  </summary>
                  <div className="mt-3 grid gap-2">
                    <Label htmlFor="roi-estimator-prompt">{t("estimatorPrompt")}</Label>
                    <Textarea
                      id="roi-estimator-prompt"
                      rows={5}
                      disabled={readOnly}
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                    />
                  </div>
                </details>
                <div className="grid max-w-xs gap-2">
                  <Label htmlFor="roi-backfill-days">{t("backfillDays")}</Label>
                  <Input
                    id="roi-backfill-days"
                    min={1}
                    max={3650}
                    type="number"
                    disabled={readOnly}
                    value={backfillDays}
                    onChange={(event) => setBackfillDays(event.target.value)}
                  />
                </div>
                <div className="grid max-w-xs gap-2">
                  <Label htmlFor="roi-interval">{t("updateIntervalHours")}</Label>
                  <Input
                    id="roi-interval"
                    type="number"
                    min={0}
                    max={720}
                    step="any"
                    required
                    value={intervalHours}
                    onChange={(e) => setIntervalHours(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{t("updateIntervalHelp")}</p>
                </div>
                <details>
                  <summary className="cursor-pointer text-sm text-muted-foreground">{t("advancedSettings")}</summary>
                  <div className="mt-3 space-y-3">
                    <Label htmlFor="roi-estimator-key">{t("estimatorApiKey")}</Label>
                    <Input
                      id="roi-estimator-key"
                      type="password"
                      autoComplete="new-password"
                      value={estimatorKey}
                      onChange={(e) => {
                        setEstimatorKey(e.target.value);
                        setClearEstimatorKey(false);
                      }}
                      placeholder={initialSettings.has_estimator_key ? t("keySaved") : t("optionalGatewayKey")}
                    />
                    <p className="text-xs text-muted-foreground">{t("estimatorKeyHelp")}</p>
                    {initialSettings.has_estimator_key && (
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={clearEstimatorKey}
                          onChange={(e) => setClearEstimatorKey(e.target.checked)}
                        />
                        {t("useGatewayAdminKey")}
                      </label>
                    )}
                    <Button type="button" variant="link" onClick={() => setPrompt(initialSettings.default_prompt)}>
                      {t("resetPrompt")}
                    </Button>
                    {!onboarding && !readOnly && (
                      <Button type="button" variant="outline" onClick={() => setResetOpen(true)}>
                        {t("restartSetup")}
                      </Button>
                    )}
                  </div>
                </details>
                <p className="text-xs text-muted-foreground">{t("estimatesNote")}</p>
              </>
            )}
            {!readOnly && (
              <div className="flex flex-wrap gap-2">
                {onboarding && step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy || syncDisabled}
                    onClick={() => setStep(step - 1)}
                  >
                    {commonT("back")}
                  </Button>
                )}
                <Button disabled={formDisabled || (onboarding && !stepReady)} type="submit">
                  {busy ? t("saving") : submitLabel}
                </Button>
                {!onboarding && (
                  <Button type="button" variant="outline" onClick={() => void testConnections()}>
                    {t("testConnections")}
                  </Button>
                )}
                {!onboarding && (
                  <Button disabled={runDisabled} type="button" variant="outline" onClick={() => void saveAndRun()}>
                    {t("saveAndRunAnalysis")}
                  </Button>
                )}
              </div>
            )}
          </fieldset>
        </form>
        <Dialog open={resetOpen} onOpenChange={setResetOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("restartSetupTitle")}</DialogTitle>
              <DialogDescription>{t("restartSetupDescription")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" disabled={busy} onClick={() => setResetOpen(false)}>
                {commonT("cancel")}
              </Button>
              <Button disabled={busy} onClick={() => void resetSetup()}>
                {t("restartSetup")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
