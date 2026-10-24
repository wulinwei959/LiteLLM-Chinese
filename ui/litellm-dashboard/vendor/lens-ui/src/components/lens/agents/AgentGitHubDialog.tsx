"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ExternalLink, Github, Loader2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import type { EvalDefinition } from "../evals/runs/types";
import { GitHubEvalSetupDialog } from "./GitHubEvalSetupDialog";
import { gitHubAuthorizationDestination, openGitHubAuthorization, useGitHubConnection } from "./githubConnection";
import { useLensTranslate } from "../../../host/useLensTranslate";

interface AgentGitHubDialogProps {
  readonly agent: string;
  readonly authorizationId?: string | null;
  readonly definition?: EvalDefinition;
  readonly onOpenChange: (open: boolean) => void;
  readonly onOpenDatasets?: () => void;
  readonly onAuthorize?: (url: string) => void;
  readonly onAuthorizationComplete?: () => void;
}

export function AgentGitHubDialog({
  agent,
  authorizationId,
  definition,
  onOpenChange,
  onOpenDatasets,
  onAuthorize = openGitHubAuthorization,
  onAuthorizationComplete,
}: AgentGitHubDialogProps) {
  const t = useLensTranslate();
  const github = useGitHubConnection(agent, authorizationId);
  const [repositoryId, setRepositoryId] = useState<string | null>(null);
  const [settingUpEvals, setSettingUpEvals] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);
  const started = useRef(false);
  const connection = github.status.data?.connection;
  const authorized = github.authorization.data;
  const repositories = authorized?.repositories ?? [];
  const selected = repositories.find((repo) => String(repo.id) === repositoryId) ?? repositories[0];
  const startAuthorization = github.start.mutate;
  const begin = useCallback(
    (install: boolean) => {
      setRedirectError(null);
      startAuthorization(install, {
        onSuccess: ({ authorization_url }) => {
          try {
            onAuthorize(gitHubAuthorizationDestination(authorization_url, github.status.data?.service_origin));
          } catch {
            setRedirectError(t("agents.couldOpenGitHubTry"));
          }
        },
      });
    },
    [startAuthorization, onAuthorize, github.status.data?.service_origin],
  );

  useEffect(() => {
    if (
      started.current ||
      authorizationId ||
      !github.status.isFetchedAfterMount ||
      github.status.isFetching ||
      github.status.isError ||
      !github.status.data?.configured ||
      connection
    )
      return;
    started.current = true;
    begin(true);
  }, [
    authorizationId,
    github.status.data,
    github.status.isFetchedAfterMount,
    github.status.isFetching,
    github.status.isError,
    connection,
    begin,
  ]);

  useEffect(() => {
    if (authorizationId && (github.connect.isSuccess || (connection && authorized?.status === "connected")))
      onAuthorizationComplete?.();
  }, [authorizationId, github.connect.isSuccess, connection, authorized?.status, onAuthorizationComplete]);

  if (settingUpEvals && connection)
    return (
      <GitHubEvalSetupDialog
        agent={agent}
        repository={connection.repository}
        definition={definition}
        onOpenChange={onOpenChange}
        onOpenDatasets={onOpenDatasets}
      />
    );

  const error =
    redirectError || github.start.error?.message || github.connect.error?.message || github.disconnect.error?.message;
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github aria-hidden="true" className="size-5" /> {t("workspace.connectGitHub")}</DialogTitle>
          <DialogDescription>
            {t("agents.connect")}<span className="font-medium text-foreground">{agent}</span> {t("agents.repositoryThroughLensGitHub")}</DialogDescription>
        </DialogHeader>

        {github.status.isPending ? (
          <p role="status" className="flex items-center gap-2 py-8 text-sm">
            <Loader2 aria-hidden="true" className="size-4 animate-spin" /> {t("agents.checkingGitHubConnection")}</p>
        ) : github.status.error ? (
          <div className="space-y-3">
            <p role="alert" className="text-sm text-destructive">
              {t("agents.couldCheckGitHubConnection")}</p>
            <Button variant="outline" onClick={() => void github.status.refetch()}>
              {t("agents.tryAgain")}</Button>
          </div>
        ) : !github.status.data?.configured ? (
          <div className="space-y-4 rounded-lg border p-4 text-sm">
            <h3 className="font-medium">{t("agents.gitHubConnectionUnavailable")}</h3>
            <p className="text-muted-foreground">
              {t("agents.lensGitHubServiceBeen")}</p>
            <a
              className="inline-flex items-center gap-1 underline underline-offset-4"
              href="https://github.com/BerriAI/lens/blob/main/docs/github-app.md"
              target="_blank"
              rel="noreferrer"
            >
              {t("agents.gitHubConnectionGuide")}<ExternalLink aria-hidden="true" className="size-3" />
            </a>
            <Button variant="outline" onClick={() => void github.status.refetch()}>
              {t("agents.checkConfiguration")}</Button>
          </div>
        ) : connection && (!authorizationId || github.connect.isSuccess || authorized?.status === "connected") ? (
          <div className="space-y-4">
            <div className="space-y-2 rounded-lg border p-4">
              <h3 className="flex items-center gap-2 font-medium">
                <Check aria-hidden="true" className="size-4" /> {t("agents.gitHubConnected")}</h3>
              <a
                className="inline-flex items-center gap-1 break-all text-sm underline underline-offset-4"
                href={`https://github.com/${connection.repository}`}
                target="_blank"
                rel="noreferrer"
              >
                {connection.repository} <ExternalLink aria-hidden="true" className="size-3 shrink-0" />
              </a>
              <p className="text-xs text-muted-foreground">
                {t("agents.connectedThroughGitHubApp")}</p>
            </div>
            {connection.available ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("agents.nextConfigureEvalShould")}</p>
                <Button onClick={() => setSettingUpEvals(true)}>{t("agents.setUpPREvals")}</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p role="alert" className="text-sm text-destructive">
                  {t("agents.gitHubAccessNeedsAttention", { value0: connection.availability_error ||
                    t("agents.appMayBeenRemoved") })}</p>
                <Button disabled={github.start.isPending} onClick={() => begin(true)}>
                  {t("agents.restoreGitHubAccess")}</Button>
                <Button variant="outline" disabled={github.status.isFetching} onClick={() => void github.status.refetch()}>
                  {t("agents.checkConnectionAgain")}</Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button variant="outline" disabled={github.start.isPending} onClick={() => begin(true)}>
                {t("agents.manageRepositoryAccess")}</Button>
              <Button
                variant="ghost"
                disabled={github.disconnect.isPending}
                onClick={() => {
                  started.current = true;
                  github.disconnect.mutate();
                }}
              >
                {t("agents.disconnect")}</Button>
            </div>
          </div>
        ) : authorizationId ? (
          <div className="space-y-4">
            {github.authorization.isPending || authorized?.status === "pending" ? (
              <p role="status" className="flex items-center gap-2 py-8 text-sm">
                <Loader2 aria-hidden="true" className="size-4 animate-spin" /> {t("agents.completingGitHubAuthorization")}</p>
            ) : github.authorization.error || authorized?.status === "failed" ? (
              <>
                <p role="alert" className="text-sm text-destructive">
                  {t("agents.gitHubAuthorizationCancelledExpired")}</p>
                <Button disabled={github.start.isPending} onClick={() => begin(false)}>
                  {t("agents.tryGitHubAgain")}</Button>
              </>
            ) : repositories.length === 0 ? (
              <>
                <h3 className="font-medium">{t("agents.giveLensAccessRepository")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("agents.installLensGitHubApp", { value0: agent })}</p>
                <Button disabled={github.start.isPending} onClick={() => begin(true)}>
                  <Github aria-hidden="true" className="size-4" /> {t("agents.installGitHubApp")}</Button>
                <Button variant="ghost" disabled={github.start.isPending} onClick={() => begin(false)}>
                  {t("agents.iAlreadyInstalled")}</Button>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <h3 className="font-medium">{t("agents.chooseRepository")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("agents.onlyRepositoriesAvailableThrough")}</p>
                </div>
                <label htmlFor="github-repository" className="text-sm font-medium">
                  {t("agents.gitHubRepository")}</label>
                <Select value={selected ? String(selected.id) : null} onValueChange={setRepositoryId}>
                  <SelectTrigger id="github-repository" className="w-full">
                    <SelectValue>{selected?.full_name}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {repositories.map((repo) => (
                      <SelectItem key={repo.id} value={String(repo.id)}>
                        {repo.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  disabled={!selected || github.connect.isPending}
                  onClick={() => selected && github.connect.mutate(selected.id)}
                >
                  {github.connect.isPending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />} {t("agents.connectRepository")}</Button>
                <Button variant="ghost" disabled={github.start.isPending} onClick={() => begin(true)}>
                  {t("agents.missingRepositoryManageApp")}</Button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <p role="status" className="text-sm text-muted-foreground">
              {t("agents.chooseGitHubAccountOrganization")}</p>
            <Button disabled={github.start.isPending} onClick={() => begin(true)}>
              {github.start.isPending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />} {t("agents.continueGitHub")}</Button>
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
