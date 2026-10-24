"use client";

import { ArrowRight, ArrowUpRight, Check, Copy, KeyRound, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { components } from "../../../../lib/http/schema";
import { createApiClient, type RequestOptions } from "../../../../lib/http/client";
import { useIsMounted, useTimeout } from "usehooks-ts";

import { cn } from "../../../../lib/cva.config";
import { Button } from "../../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { copyToClipboard } from "../../../../utils/dataUtils";

import claudeCodeLogo from "../../../../../public/assets/logos/claude-code.svg";
import codexLogo from "../../../../../public/assets/logos/codex.svg";
import otelLogo from "../../../../../public/assets/logos/opentelemetry.svg";
import { agentTraceCall, apiClient, getProxyBaseUrl } from "../../../../lib/http/requests";
import { ActiveDot } from "../../traces/ui/ActiveDot";
import { sampleTraceExport } from "./sampleTrace";
import {
  FRAMEWORKS,
  directModelConnection,
  frameworkSnippet,
  standaloneFrameworkSnippet,
  type FrameworkGuide,
} from "./tracingSetupGuides";
import type { TraceSummary } from "../../traces/types";
import { STANDALONE_DOCS_URL, useLensHost } from "../../../../host/LensHost";
import { SetupAgentPrompt } from "../SetupAgentPrompt";
import { projectTracingInstructions } from "../setupPrompt";
import { connectionAuthStatus } from "../connectionErrors";
import { useLensTranslate } from "../../../../host/useLensTranslate";
import { lensTranslate } from "../../../../host/lensTranslate";

const COPIED_RESET_MS = 1500;
const DOCS_URL = "https://docs.litellm.ai/docs/proxy/lens";
const DEPLOYMENT_URL = `${DOCS_URL}/deployment`;
const EXAMPLE_MODEL = "openai/gpt-6.1-sol";
const SAMPLE_TRACE_POLL_MS = 1000;
export const TRACING_KEY_REQUEST = { get name() { return lensTranslate("onboarding.agentTracing"); } } as const;
const SAMPLE_TRACE_POLL_ATTEMPTS = 15;

type Installer = "pip" | "uv";

const PY_INSTALL: Record<Installer, (packages: string) => string> = {
  pip: (packages) => `pip install ${packages}`,
  uv: (packages) => lensTranslate("onboarding.uvAddValue0", { value0: packages }),
};

export const tracingEnvSnippet = (proxyUrl: string, tracingKey: string | null = null): string =>
  [
    `export LITELLM_TRACING_KEY="${tracingKey ?? lensTranslate("onboarding.yourTracingKey")}"`,
    `export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="${proxyUrl}/v1/traces"`,
    `export OTEL_EXPORTER_OTLP_TRACES_HEADERS="Authorization=Bearer $LITELLM_TRACING_KEY"`,
    'export OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"',
    'export OTEL_METRICS_EXPORTER="none"',
    'export OTEL_LOGS_EXPORTER="none"',
  ].join("\n");

export const codingAgentPrompt = (
  proxyUrl: string,
  traceUrl: string,
  guide: FrameworkGuide,
  model: string,
  standalone = false,
): string =>
  [
    lensTranslate("onboarding.sendValue0ProjectS", { value0: guide.label, value1: standalone ? "Lens" : "LiteLLM" }),
    standalone
      ? lensTranslate("onboarding.keepExistingModelConfiguration")
      : lensTranslate("onboarding.keepTheExistingModelConfigurationAuthenticationAndApplicatio"),
    lensTranslate("onboarding.setTraceDestinationWherever"),
    tracingEnvSnippet(traceUrl),
    guide.install ?? lensTranslate("onboarding.installEnableValue0Value1", { value0: guide.plugin?.label, value1: guide.plugin?.url }),
    guide.plugin?.instruction ??
      lensTranslate("onboarding.initializeOpenTelemetryBeforeCreating"),
    lensTranslate("onboarding.adaptExampleExistingApplication"),
    standalone ? standaloneFrameworkSnippet(guide, traceUrl) : frameworkSnippet(guide, proxyUrl, model, traceUrl),
    guide.note ?? "",
    lensTranslate("onboarding.runAgentOnceConfirm"),
  ]
    .filter(Boolean)
    .join("\n\n");

export const projectSetupPrompt = (traceUrl: string): string =>
  projectTracingInstructions(traceUrl).join("\n\n");

export const maskSecret = (secret: string): string =>
  secret.length > 10 ? `${secret.slice(0, 5)}${"•".repeat(16)}${secret.slice(-4)}` : "•".repeat(secret.length);

export const otlpEndpoints = (proxyUrl: string): readonly (readonly [string, string, boolean])[] => [
  [lensTranslate("onboarding.tracesEndpoint"), `${proxyUrl}/v1/traces`, true],
  [lensTranslate("onboarding.authHeader"), "Authorization: Bearer <Lens tracing key>", true],
  [lensTranslate("onboarding.protocol"), lensTranslate("onboarding.oTLPHTTPProtobufJSON"), false],
];

export function CodeBlock({
  code,
  display = code,
  tabs,
  wrap = false,
  copyLabel = lensTranslate("onboarding.copy"),
}: {
  code: string;
  display?: string;
  tabs?: React.ReactNode;
  wrap?: boolean;
  copyLabel?: string;
}) {
  const t = useLensTranslate();
  const [copied, setCopied] = useState(false);
  useTimeout(() => setCopied(false), copied ? COPIED_RESET_MS : null);
  const copy = async () => setCopied(await copyToClipboard(code));
  return (
    <div className="overflow-hidden rounded-md border border-border bg-muted/30">
      <div className="flex min-h-11 items-center border-b border-border px-3 sm:min-h-9">
        {tabs}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => void copy()}
          aria-label={copied ? t("onboarding.copiedClipboard") : copyLabel}
          title={copied ? t("onboarding.copiedClipboard") : copyLabel}
          className="ml-auto size-11 text-muted-foreground hover:text-foreground sm:size-8"
        >
          {copied ? <Check aria-hidden className="size-3.5" /> : <Copy aria-hidden className="size-3.5" />}
        </Button>
      </div>
      <pre
        className={cn(
          "m-0 px-4 py-3 font-mono text-xs leading-5 text-foreground",
          wrap ? "whitespace-pre-wrap break-words" : "overflow-x-auto",
        )}
      >
        <code>{display}</code>
      </pre>
    </div>
  );
}

function FileLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-foreground">{children}</span>;
}

function LineTabs<T extends string>({
  value,
  options,
  onChange,
  logos,
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
  logos?: Partial<Record<T, string>>;
}) {
  return (
    <div role="tablist" className="flex h-9 items-end gap-3">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "-mb-px inline-flex h-9 items-center gap-1.5 border-b-2 text-xs",
            value === option
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {logos?.[option] && <img src={logos[option]} alt="" className="size-3.5" />}
          {option}
        </button>
      ))}
    </div>
  );
}

function Step({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="mb-3 text-sm font-medium text-foreground">{title}</h3>
      {children}
    </section>
  );
}

type SendState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "waiting" }
  | { kind: "ready"; trace: TraceSummary }
  | { kind: "failed"; message: string };

const SEND_LABEL: Record<Exclude<SendState["kind"], "ready">, string> = {
  get idle() { return lensTranslate("onboarding.sendTestTrace"); },
  get sending() { return lensTranslate("onboarding.sending"); },
  get waiting() { return lensTranslate("onboarding.waitingArrive"); },
  get failed() { return lensTranslate("onboarding.sendTestTrace"); },
};

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

async function waitForTrace(accessToken: string, traceId: string): Promise<TraceSummary | null> {
  for (let attempt = 0; attempt < SAMPLE_TRACE_POLL_ATTEMPTS; attempt++) {
    try {
      return (await agentTraceCall(accessToken, traceId)).summary;
    } catch {
      await delay(SAMPLE_TRACE_POLL_MS);
    }
  }
  return null;
}

function SendTestTrace({
  accessToken,
  traceUrl,
  tracingKey,
  onOpenTrace,
}: {
  accessToken: string;
  traceUrl: string;
  tracingKey: string | null;
  onOpenTrace: (trace: TraceSummary) => void;
}) {
  const t = useLensTranslate();
  const [state, setState] = useState<SendState>({ kind: "idle" });
  const send = async () => {
    setState({ kind: "sending" });
    const sample = sampleTraceExport(Date.now());
    try {
      if (!tracingKey) throw new Error("Generate a tracing key first");
      const client = createApiClient({ getBaseUrl: () => traceUrl });
      const options: RequestOptions = {
        credentials: "omit",
        redirect: "error",
        accessToken: tracingKey,
        body: sample.body,
        signal: AbortSignal.timeout(15000),
      };
      await client.post("/v1/traces", options);
    } catch {
      setState({ kind: "failed", message: t("onboarding.couldSendTestTrace") });
      return;
    }
    setState({ kind: "waiting" });
    const trace = await waitForTrace(accessToken, sample.traceId);
    setState(
      trace
        ? { kind: "ready", trace }
        : {
            kind: "failed",
            message: t("onboarding.sentShownUpYet"),
          },
    );
  };
  if (state.kind === "ready") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span role="status" className="inline-flex items-center gap-1 text-sm text-emerald-700 dark:text-emerald-400">
          <Check aria-hidden="true" className="size-4" /> {t("onboarding.testTraceReceived")}</span>
        <Button onClick={() => onOpenTrace(state.trace)}>
          {t("investigations.viewTrace")}<ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    );
  }
  const busy = state.kind === "sending" || state.kind === "waiting";
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" onClick={() => void send()} disabled={busy || !tracingKey || !traceUrl}>
        {busy ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Send aria-hidden="true" className="size-4" />
        )}
        {SEND_LABEL[state.kind]}
      </Button>
      {state.kind === "failed" && <p className="text-sm text-destructive">{state.message}</p>}
    </div>
  );
}

function TraceReceipt({
  connected,
  checked,
  checking,
  onCheck,
}: {
  connected: boolean;
  checked: boolean;
  checking: boolean;
  onCheck: () => void;
}) {
  const t = useLensTranslate();
  const missingAfterCheck = checked && !checking && !connected;
  return (
    <section className="mt-6 border-t pt-6" aria-label={t("onboarding.traceConnectionStatus")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p role="status" className="text-sm font-medium">
            {connected ? t("onboarding.tracesConnected") : t("onboarding.waitingFirstTrace")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{t("onboarding.runAgentOnceTraces")}</p>
        </div>
        <Button variant="outline" onClick={onCheck} disabled={checking}>
          {checking && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
          {checking ? t("onboarding.checking") : t("onboarding.checkTraces")}
        </Button>
      </div>
      {missingAfterCheck && (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {t("onboarding.tracesReceivedYetCheck")}</p>
      )}
    </section>
  );
}

export function TracingKey({
  accessToken,
  tracingKey,
  onCreated,
  name = TRACING_KEY_REQUEST.name,
  compact = false,
}: {
  accessToken: string;
  tracingKey: string | null;
  onCreated: (key: string, active: boolean) => void;
  name?: string;
  compact?: boolean;
}) {
  const t = useLensTranslate();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [pendingActivation, setPendingActivation] = useState(false);
  const isMounted = useIsMounted();
  const create = async () => {
    setCreating(true);
    setError("");
    try {
      const result = await apiClient.post<components["schemas"]["IngestionKeyCreated"]>("/lens/tracing/keys", {
        accessToken,
        body: { name },
      });
      if (!isMounted()) return;
      if (!result.key) throw new Error("Lens did not return the new key");
      setPendingActivation(!result.active);
      onCreated(result.key, result.active);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("onboarding.couldCreateKey"));
    } finally {
      setCreating(false);
    }
  };
  if (tracingKey) {
    return (
      <div className="space-y-2">
        {pendingActivation && (
          <p role="status" className="text-sm text-muted-foreground">
            {t("onboarding.keySavedLensConfirmed")}</p>
        )}
        <CodeBlock code={tracingKey} display={maskSecret(tracingKey)} tabs={<FileLabel>{t("onboarding.tracingKey2")}</FileLabel>} />
        <p className="text-sm text-muted-foreground">
          {compact ? (
            t("onboarding.copySaveKeyBefore")
          ) : (
            <>
              {t("onboarding.hiddenSafetyCopyCopies")}</>
          )}
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" onClick={() => void create()} disabled={creating}>
        {creating ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <KeyRound aria-hidden="true" className="size-4" />
        )}
        {t("onboarding.generateTracingKey")}</Button>
      <span className="text-sm text-muted-foreground">{t("onboarding.useDedicatedLensKey")}</span>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function EndpointValue({ value }: { value: string }) {
  const t = useLensTranslate();
  const [copied, setCopied] = useState(false);
  useTimeout(() => setCopied(false), copied ? COPIED_RESET_MS : null);
  const copy = async () => setCopied(await copyToClipboard(value));
  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label={t("agents.copyValue0", { value0: value })}
      className="group inline-flex min-w-0 items-center gap-2 text-left font-mono text-xs text-foreground"
    >
      <span className="break-all">{value}</span>
      {copied ? (
        <Check aria-hidden="true" className="size-3.5 shrink-0" />
      ) : (
        <Copy aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
      )}
    </button>
  );
}

export function Endpoints({ proxyUrl, children }: { proxyUrl: string; children?: React.ReactNode }) {
  const t = useLensTranslate();
  return (
    <section className="mt-6" aria-labelledby="otel-endpoints">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="otel-endpoints" className="inline-flex items-center gap-2 text-sm font-medium">
          <img src={otelLogo.src} alt="" className="size-5" />
          {t("onboarding.connectionDetails")}</h3>
        {children}
      </div>
      <dl className="mt-3 grid gap-x-6 gap-y-3 rounded-md border bg-muted/30 p-4 md:grid-cols-2">
        {otlpEndpoints(proxyUrl).map(([label, value, copyable]) => (
          <div key={label} className={cn("min-w-0", label === "Traces endpoint" && "md:col-span-2")}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-0.5">
              {copyable ? <EndpointValue value={value} /> : <span className="text-xs">{value}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function setupTitle(enabled: boolean, connected: boolean) {
  if (!enabled) return lensTranslate("onboarding.setUpLens");
  return connected ? lensTranslate("onboarding.connectAnotherAgent") : lensTranslate("onboarding.connectAgent");
}

interface ConnectAgentProps {
  accessToken: string;
  onOpenTrace: (trace: TraceSummary) => void;
  connected: boolean;
  checked: boolean;
  checking: boolean;
  onCheck: () => void;
  readOnly: boolean;
  canMintTracingKey: boolean;
  framework: string;
  setFramework: (framework: string) => void;
  installer: Installer;
  setInstaller: (installer: Installer) => void;
  tracingKey: string | null;
  setTracingKey: (key: string) => void;
}

export function useLensService(accessToken: string, options: { enabled?: boolean; refetchInterval?: number } = {}) {
  return useQuery({
    queryKey: ["lens-service", accessToken],
    queryFn: () => apiClient.get<components["schemas"]["ServiceConnection"]>("/lens/service", { accessToken }),
    enabled: options.enabled ?? true,
    retry: (failureCount, error) => !connectionAuthStatus(error) && failureCount < 3,
    refetchInterval: (query) =>
      connectionAuthStatus(query.state.error) ? false : (options.refetchInterval ?? 15000),
    refetchOnWindowFocus: (query) => !connectionAuthStatus(query.state.error),
    refetchOnReconnect: (query) => !connectionAuthStatus(query.state.error),
  });
}

function EnableTracing({
  connection,
  checking,
  onCheck,
}: {
  connection: components["schemas"]["ServiceConnection"];
  checking: boolean;
  onCheck: () => void;
}) {
  const t = useLensTranslate();
  const standalone = useLensHost().surface === "standalone";
  const configured = connection.configured ?? connection.connected;
  if (standalone)
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium">{t("onboarding.checkLensConnection")}</p>
        <p className="text-sm leading-6 text-muted-foreground">
          {!connection.connected
            ? t("onboarding.lensIsUnavailableCheckTheServiceLogsAnd")
            : !connection.status.storage_ready
              ? t("onboarding.lensCannotReachTrace")
              : t("onboarding.setLENSPUBLICURL")}
        </p>
        <a href={STANDALONE_DOCS_URL} target="_blank" rel="noreferrer" className="text-sm underline underline-offset-4">
          {t("onboarding.deploymentGuide")}</a>
        <Button variant="outline" onClick={onCheck} disabled={checking}>
          {checking ? t("onboarding.checking") : t("onboarding.checkSetup")}
        </Button>
      </div>
    );
  let message = t("onboarding.lensConnectedSetPublic");
  if (!configured) {
    message = t("onboarding.enableLensExistingHelmDocker");
  } else if (!connection.connected) {
    message = t("onboarding.lensConfiguredLiteLLMUnreachable");
  } else if (!connection.status.storage_ready) {
    message = t("onboarding.lensConnectedTracingStorageUnavailable");
  }
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">{configured ? t("onboarding.checkLensConnection") : t("onboarding.installLens")}</p>
      <p className="text-sm leading-6 text-muted-foreground">{message}</p>
      {!configured && (
        <p className="text-sm text-muted-foreground">
          {t("onboarding.useLensReleaseSupported")}</p>
      )}
      <div className="flex flex-wrap gap-3">
        <a
          className="inline-flex items-center gap-1 text-sm underline underline-offset-4"
          href={`${DEPLOYMENT_URL}/kubernetes#existing-deployment`}
          target="_blank"
          rel="noreferrer"
        >
          {t("onboarding.helmSetup")}<ArrowUpRight aria-hidden="true" className="size-3.5" />
        </a>
        <a
          className="inline-flex items-center gap-1 text-sm underline underline-offset-4"
          href={`${DEPLOYMENT_URL}/docker-compose`}
          target="_blank"
          rel="noreferrer"
        >
          {t("onboarding.dockerSetup")}<ArrowUpRight aria-hidden="true" className="size-3.5" />
        </a>
      </div>
      <Button variant="outline" onClick={onCheck} disabled={checking}>
        {checking && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        {checking ? t("onboarding.checking") : t("onboarding.checkSetup")}
      </Button>
    </div>
  );
}

export function CodingAgentSetup({
  proxyUrl,
  traceUrl,
  guide,
  model = EXAMPLE_MODEL,
  instructions: providedInstructions,
  onCopied,
  heading = lensTranslate("onboarding.connectProject"),
  embedded = false,
}: {
  proxyUrl: string;
  traceUrl: string;
  guide?: FrameworkGuide;
  model?: string;
  instructions?: string;
  onCopied?: () => void;
  heading?: string;
  embedded?: boolean;
}) {
  const t = useLensTranslate();
  const standalone = useLensHost().surface === "standalone";
  const [copied, setCopied] = useState<string | null>(null);
  const instructions =
    providedInstructions ??
    (guide ? codingAgentPrompt(proxyUrl, traceUrl, guide, model, standalone) : projectSetupPrompt(traceUrl));
  useTimeout(() => setCopied(null), copied === null ? null : COPIED_RESET_MS);
  const copy = async () => {
    if (await copyToClipboard(instructions)) {
      setCopied(instructions);
      onCopied?.();
    }
  };
  return (
    <section className="mt-6" aria-labelledby="connect-project">
      <h3 id="connect-project" className={embedded ? "sr-only" : "text-sm font-medium"}>
        {heading}
      </h3>
      <div className={embedded ? "" : "mt-3 overflow-hidden rounded-md border"}>
        <div className={cn("flex flex-wrap items-center gap-5", !embedded && "border-b bg-muted/30 px-4 py-3")}>
          <span className="inline-flex items-center gap-2 text-sm font-medium">
            <img src={claudeCodeLogo.src} alt="Claude Code logo" className="size-6 object-contain" />
            Claude Code
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium">
            <img src={codexLogo.src} alt="Codex logo" className="size-5 object-contain dark:invert" />
            Codex
          </span>
        </div>
        <div className={embedded ? "pt-3" : "p-4"}>
          <p className="text-[13px] leading-5 text-muted-foreground">
            {embedded ? t("onboarding.pasteSetupInstructionsCoding") : t("onboarding.pasteInstructionsClaudeCode")}
          </p>
          <Button className="mt-3 min-h-11 sm:min-h-9" onClick={() => void copy()}>
            {copied === instructions ? (
              <Check aria-hidden="true" className="size-4" />
            ) : (
              <Copy aria-hidden="true" className="size-4" />
            )}
            {copied === instructions ? t("onboarding.copied") : t("onboarding.copySetupInstructions")}
          </Button>
          <details className="mt-3">
            <summary className="w-fit cursor-pointer text-xs text-muted-foreground">{t("onboarding.viewInstructions")}</summary>
            <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-xs leading-5">
              <code>{instructions}</code>
            </pre>
          </details>
        </div>
      </div>
    </section>
  );
}

function ConnectAgent({
  accessToken,
  onOpenTrace,
  connected,
  checked,
  checking,
  onCheck,
  readOnly,
  canMintTracingKey,
  framework,
  setFramework,
  installer,
  setInstaller,
  tracingKey,
  setTracingKey,
}: ConnectAgentProps) {
  const t = useLensTranslate();
  const standalone = useLensHost().surface === "standalone";
  const proxyUrl = getProxyBaseUrl().replace(/\/$/, "");
  const connection = useLensService(accessToken);
  const traceUrl = connection.data?.url ?? "";
  const guide = FRAMEWORKS.find((f) => f.id === framework) ?? FRAMEWORKS[0];
  const install = guide.install?.startsWith("pip install ")
    ? PY_INSTALL[installer](guide.install.slice("pip install ".length))
    : guide.install;
  const model = EXAMPLE_MODEL;
  const quickstart = standalone
    ? standaloneFrameworkSnippet(guide, traceUrl)
    : frameworkSnippet(guide, proxyUrl, model, traceUrl);
  if (!traceUrl)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        {connection.isPending
          ? t("onboarding.checkingLensConnection")
          : standalone
            ? t("onboarding.setLENSPUBLICURLToTheLensAddress")
            : t("onboarding.setLITELLMLENSPUBLIC")}
      </p>
    );
  return (
    <>
      {!connection.data?.connected && (
        <p role="alert" className="text-sm text-destructive">
          {t("onboarding.lensServiceUnavailableCheck")}</p>
      )}
      {connection.data?.connected && !connection.data.status.storage_ready && (
        <p role="alert" className="text-sm text-destructive">
          {t("onboarding.lensConnectedClickHouseUnavailable")}</p>
      )}
      <div className="mt-6 space-y-2">
        <label id="tracing-framework" className="block text-sm font-medium">
          {t("onboarding.agentFramework")}</label>
        <Select
          value={framework}
          onValueChange={(value) => {
            if (value) setFramework(value);
          }}
        >
          <SelectTrigger aria-labelledby="tracing-framework" className="w-full">
            <SelectValue>
              <img src={guide.logo} alt="" className="size-4 shrink-0 object-contain" />
              {guide.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {FRAMEWORKS.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                <img src={f.logo} alt="" className="size-4 shrink-0 object-contain" />
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Step title={t("onboarding.createTracingKey")}>
        {canMintTracingKey && !readOnly ? (
          <TracingKey accessToken={accessToken} tracingKey={tracingKey} onCreated={setTracingKey} />
        ) : (
          <p className="text-sm text-muted-foreground">
            {standalone
              ? t("onboarding.askLensAdministratorDedicated")
              : t("onboarding.askProxyAdminDedicated")}
          </p>
        )}
      </Step>
      <div className="mt-6 border-t pt-6">
        {install && (
          <Step title={t("onboarding.installDependencies")}>
            <CodeBlock
              code={install}
              wrap
              tabs={
                guide.language === "typescript" ? (
                  <FileLabel>npm</FileLabel>
                ) : (
                  <LineTabs value={installer} options={["pip", "uv"]} onChange={setInstaller} />
                )
              }
            />
          </Step>
        )}
        {guide.plugin && (
          <Step title={t("onboarding.enablePlugin")}>
            <p className="text-sm leading-6 text-muted-foreground">
              {t("onboarding.installEnable")}{" "}
              <a className="underline underline-offset-4" href={guide.plugin.url} target="_blank" rel="noreferrer">
                {guide.plugin.label}
              </a>
              . {guide.plugin.instruction}
            </p>
          </Step>
        )}
        <Step title={t("onboarding.configureEnvironment")}>
          <p className="mb-3 text-sm leading-6 text-muted-foreground">
            {standalone ? (
              <>
                {t("onboarding.tracingUses")}<code>LITELLM_TRACING_KEY</code>{t("onboarding.keepAgentSExisting")}{guide.existingModel ? (
                  "."
                ) : (
                  <>
                    {t("onboarding.exampleReads")}<code>{directModelConnection(guide).key}</code>.
                  </>
                )}
              </>
            ) : tracingKey ? (
              <>
                {t("onboarding.tracingUsesKeyAbove")}<code>LITELLM_API_KEY</code> to a key with model access.
              </>
            ) : (
              <>
                {t("onboarding.set")}<code>LITELLM_TRACING_KEY</code> {t("onboarding.lensTracingKeyKeep")}<code>LITELLM_API_KEY</code> for
                model calls.
              </>
            )}
          </p>
          <CodeBlock
            copyLabel={t("onboarding.copyTracingConfiguration")}
            code={tracingEnvSnippet(traceUrl, tracingKey)}
            display={tracingEnvSnippet(traceUrl, tracingKey && maskSecret(tracingKey))}
            tabs={<FileLabel>{t("onboarding.shell")}</FileLabel>}
            wrap
          />
        </Step>
        <Step title={t("onboarding.runAgent")}>
          <p className="mb-3 text-sm leading-6 text-muted-foreground">
            {guide.existingModel ? t("onboarding.keepExistingModelSettings") : t("onboarding.saveRunExample")}
            {t("onboarding.replace")}<code>research_agent</code> {t("onboarding.agentSName")}{!guide.existingModel &&
              (standalone ? t("onboarding.exampleCallsProviderDirectly") : t("onboarding.useModelConfiguredProxy"))}
          </p>
          <CodeBlock code={quickstart} tabs={<FileLabel>{guide.fileName}</FileLabel>} wrap />
          {guide.note && <p className="mt-3 text-sm leading-6 text-muted-foreground">{guide.note}</p>}
          {!guide.existingModel && (
            <div className="mt-3">
              <CodeBlock
                code={guide.language === "typescript" ? "npx tsx agent.mts" : "python agent.py"}
                tabs={<FileLabel>{t("onboarding.shell")}</FileLabel>}
              />
            </div>
          )}
          <a
            href={
              standalone
                ? t("onboarding.value0RecordFirstTrace", { value0: STANDALONE_DOCS_URL })
                : t("onboarding.value0FirstTraceFramework", { value0: DOCS_URL, value1: guide.id })
            }
            className="mt-3 inline-flex items-center gap-1 text-sm underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            {t("onboarding.viewDocs")}<ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
        </Step>
      </div>
      <CodingAgentSetup proxyUrl={proxyUrl} traceUrl={traceUrl} guide={guide} model={model} />
      <Endpoints proxyUrl={traceUrl}>
        {!readOnly && (
          <SendTestTrace
            accessToken={accessToken}
            traceUrl={traceUrl}
            tracingKey={tracingKey}
            onOpenTrace={onOpenTrace}
          />
        )}
      </Endpoints>
      <TraceReceipt connected={connected} checked={checked} checking={checking} onCheck={onCheck} />
    </>
  );
}

type TracingSetupProps = {
  detail: string | null;
  accessToken: string;
  onOpenTrace: (trace: TraceSummary) => void;
  connected?: boolean;
  onCheck?: () => void;
  checking?: boolean;
  readOnly?: boolean;
  canMintTracingKey?: boolean;
};

export function TracingSetupFields({
  accessToken,
  onOpenTrace,
  connected = false,
  onCheck,
  checking = false,
  readOnly = false,
  canMintTracingKey = false,
}: TracingSetupProps) {
  const t = useLensTranslate();
  const [framework, setFramework] = useState(FRAMEWORKS[0].id);
  const [installer, setInstaller] = useState<Installer>("pip");
  const [tracingKey, setTracingKey] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const connection = useLensService(accessToken);
  const check = () => {
    setChecked(true);
    void connection.refetch();
    onCheck?.();
  };
  if (connection.isPending)
    return (
      <p role="status" className="text-sm text-muted-foreground">
        {t("onboarding.checkingLensConnection")}</p>
    );
  if (!connection.data)
    return (
      <div className="space-y-3">
        <p role="alert" className="text-sm text-muted-foreground">
          {t("onboarding.couldCheckLensConnection")}</p>
        <Button variant="outline" onClick={check}>
          {t("agents.tryAgain")}</Button>
      </div>
    );
  if (!connection.data.connected || !connection.data.status.storage_ready || !connection.data.url)
    return <EnableTracing connection={connection.data} checking={checking || connection.isFetching} onCheck={check} />;
  return (
    <ConnectAgent
      framework={framework}
      setFramework={setFramework}
      installer={installer}
      setInstaller={setInstaller}
      tracingKey={tracingKey}
      setTracingKey={setTracingKey}
      accessToken={accessToken}
      onOpenTrace={onOpenTrace}
      connected={connected}
      checked={checked}
      checking={checking || connection.isFetching}
      onCheck={check}
      readOnly={readOnly}
      canMintTracingKey={canMintTracingKey}
    />
  );
}

export function TracingSetupCard(props: TracingSetupProps) {
  const t = useLensTranslate();
  const standalone = useLensHost().surface === "standalone";
  const connection = useLensService(props.accessToken);
  const enabled = Boolean(connection.data?.connected && connection.data.status.storage_ready && connection.data.url);

  return (
    <div className="w-full max-w-3xl pb-8" data-testid="tracing-setup-card">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="text-xl font-semibold tracking-tight">{setupTitle(enabled, props.connected ?? false)}</h2>
        <span role="status" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          {enabled ? (
            <ActiveDot />
          ) : (
            <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/50" />
          )}
          {enabled ? t("onboarding.tracingEnabled2") : t("onboarding.setupRequired")}
        </span>
        <a
          className="ml-auto inline-flex shrink-0 items-center gap-1 text-sm underline underline-offset-4"
          href={standalone ? STANDALONE_DOCS_URL : DOCS_URL}
          target="_blank"
          rel="noreferrer"
        >
          {t("onboarding.docs")}<ArrowUpRight aria-hidden="true" className="size-3.5" />
        </a>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {enabled
          ? standalone
            ? t("onboarding.sendAgentSRuns")
            : t("onboarding.sendYourAgentSRunsToLiteLLMTo")
          : t("onboarding.connectLensStartRecording")}
      </p>
      <SetupAgentPrompt goal="tracing" connection={connection.data} />
      <TracingSetupFields {...props} />
    </div>
  );
}
