/**
 * Scan the running dashboard for what a static check cannot see: text that is
 * still English in a Chinese interface, and errors thrown while a page renders.
 *
 * The catalogs and the source tree can both look right while a page still
 * throws at runtime, because a message's `<tag>` is an argument the call site
 * has to supply and nothing checks that until the message is rendered. This
 * drives a real browser over every page and reports what comes out.
 *
 * It needs the app to be running:
 *
 *   npm run dev            # in one shell
 *   npm run scan:rendered  # in another
 *
 * Findings are compared against a baseline, the same way the dead-key gate
 * works: a finding already in the baseline is known, a new one fails the run.
 * Refresh the baseline with `npm run scan:rendered -- --update-baseline` after
 * a deliberate change.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { englishPhrases, findingKey, stubFor } from "./rendered-ui-lib.mjs";
import { ADMIN_SESSION_CLAIMS, ALLOWED_ENGLISH, API_STUBS, IGNORED_CONSOLE, PAGES } from "./rendered-ui-fixtures.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASELINE_PATH = join(HERE, "rendered-ui-baseline.json");

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};

const BASE_URL = value("base-url", "http://localhost:3000").replace(/\/+$/, "");
const PROXY_URL = value("proxy-url", "");
const MASTER_KEY = value("master-key", "");
const UPDATE_BASELINE = flag("update-baseline");
const SETTLE_MS = Number(value("settle-ms", "4000"));

const b64url = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const ADMIN_TOKEN = `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url(ADMIN_SESSION_CLAIMS)}.scan`;

/**
 * A session the proxy accepts.
 *
 * Against the stub proxy the fabricated token is enough, because nothing checks
 * it. Against a real proxy the session has to be a JWT the proxy signed, so the
 * master key is exchanged for one through the same login route the sign-in form
 * uses.
 */
const sessionToken = async (proxyUrl) => {
  if (!MASTER_KEY) return ADMIN_TOKEN;
  // eslint-disable-next-line no-restricted-syntax -- Node 端扫描脚本，@/lib/http/client 是面向浏览器运行时的封装
  const response = await fetch(`${proxyUrl}/v2/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: MASTER_KEY }),
  });
  if (!response.ok) {
    throw new Error(`Logging in to ${proxyUrl} failed: ${response.status} ${await response.text()}`);
  }
  const payload = await response.json();
  if (!payload.token) throw new Error(`The proxy did not return a session token for ${proxyUrl}`);
  return payload.token;
};

/** The API responses the dashboard reads, served on the port it expects. */
const startStubProxy = (port) =>
  new Promise((resolve) => {
    const server = createServer((request, response) => {
      const path = (request.url ?? "/").split("?")[0];
      const stub = stubFor(API_STUBS, path);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify(stub ?? {}));
    });
    server.listen(port, () => resolve(server));
  });

const loadBaseline = () => {
  try {
    return JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
  } catch {
    return { findings: [] };
  }
};

const main = async () => {
  const { chromium } = await import("playwright").catch(() => {
    throw new Error("playwright is not installed. Run `npm i -D playwright` and `npx playwright install chromium`.");
  });

  const proxyUrl = PROXY_URL || "http://localhost:4000";
  const stubServer = PROXY_URL ? null : await startStubProxy(new URL(proxyUrl).port || "4000");

  const browser = await chromium.launch().catch((error) => {
    throw new Error(
      `Chromium could not start: ${String(error).split("\n")[0]}\n` +
        "On Linux the browser needs system libraries; `npx playwright install --with-deps chromium` installs them.",
    );
  });
  const context = await browser.newContext({ locale: "zh-CN", viewport: { width: 1440, height: 900 } });
  await context.addCookies([{ name: "token", value: await sessionToken(proxyUrl), url: BASE_URL }]);
  await context.addInitScript(() => window.localStorage.setItem("litellm-ui-locale", "zh-CN"));

  if (!PROXY_URL) {
    await context.route("**/*", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (request.resourceType() !== "xhr" && request.resourceType() !== "fetch") return route.continue();
      if (url.origin !== new URL(proxyUrl).origin) return route.continue();
      const stub = stubFor(API_STUBS, url.pathname);
      if (stub === undefined) console.warn(`[stub-miss] ${url.pathname}`);
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(stub ?? {}) });
    });
  }

  const page = await context.newPage();
  const findings = [];

  for (const target of PAGES) {
    const errors = [];
    const onConsole = (message) => {
      if (message.type() !== "error") return;
      if (IGNORED_CONSOLE.some((pattern) => pattern.test(message.text()))) return;
      errors.push(`console: ${message.text().slice(0, 200)}`);
    };
    const onPageError = (error) => {
      const stack = typeof error === "object" && error !== null && error.stack ? String(error.stack) : String(error);
      const at = stack
        .split("\n")
        .filter((line) => /at /.test(line))
        .slice(0, 2)
        .join(" | ");
      errors.push(`pageerror: ${String(error).slice(0, 160)} @ ${at.slice(0, 220)}`);
    };
    page.on("console", onConsole);
    page.on("pageerror", onPageError);

    await page.goto(`${BASE_URL}${target.path}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(SETTLE_MS);
    const text = await page
      .locator("body")
      .innerText()
      .catch(() => "");
    page.off("console", onConsole);
    page.off("pageerror", onPageError);

    for (const error of errors) findings.push({ page: target.name, kind: "error", text: error });
    const phrases = englishPhrases(text, ALLOWED_ENGLISH);
    for (const phrase of phrases) findings.push({ page: target.name, kind: "english", text: phrase });
    console.warn(`[${target.name}] ${target.path}  ${errors.length} 个渲染错误，${phrases.length} 处英文`);
  }

  await browser.close();
  if (stubServer) stubServer.close();

  if (UPDATE_BASELINE) {
    writeFileSync(BASELINE_PATH, `${JSON.stringify({ findings }, null, 2)}\n`, "utf8");
    console.warn(`基线已写入 ${findings.length} 条已知发现。`);
    return;
  }

  const baseline = loadBaseline();
  const known = new Set((baseline.findings ?? []).map(findingKey));
  const fresh = findings.filter((finding) => !known.has(findingKey(finding)));

  for (const finding of fresh) {
    console.error(`[${finding.page}] ${finding.kind}: ${finding.text}`);
  }
  console.warn(`发现 ${findings.length} 条，其中 ${fresh.length} 条不在基线里。`);
  if (fresh.length > 0) process.exitCode = 1;
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
