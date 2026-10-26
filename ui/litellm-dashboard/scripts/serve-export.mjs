/**
 * A static file server for the exported dashboard, used by the rendered-UI
 * scan on machines where `next start` cannot run (the project is configured
 * with `output: export`, so there is no server to start).
 *
 * It serves the `out/` directory, falls back to `404.html` for unknown paths
 * the way a static host does, and rewrites `/` to `index.html`.
 *
 * In production the proxy mounts the export and serves the API from the same
 * origin, so a relative API call lands on the proxy. This server keeps that
 * shape by forwarding every path that is not a static file to the stub proxy,
 * which the scan script runs next to it.
 *
 *   node scripts/serve-export.mjs [port] [upstream]
 */

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer, request as httpRequest } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const HERE = resolve(import.meta.dirname);
const ROOT = join(HERE, "..", "out");
const PORT = Number(process.argv[2] ?? 3000);
const UPSTREAM = process.argv[3] ?? "http://localhost:4000";
const ASSET_PREFIX = "/litellm-asset-prefix";

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

if (!existsSync(ROOT)) {
  process.stderr.write(`没有导出产物：${ROOT}，先跑 npm run build\n`);
  process.exit(1);
}

const resolveFile = (urlPath) => {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const withoutPrefix = decoded.startsWith(ASSET_PREFIX) ? decoded.slice(ASSET_PREFIX.length) || "/" : decoded;
  const relative = normalize(withoutPrefix).replace(/^([/\\])+/, "");
  const candidate = join(ROOT, relative);
  if (!candidate.startsWith(ROOT)) return null;
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  const asIndex = join(candidate, "index.html");
  if (existsSync(asIndex) && statSync(asIndex).isFile()) return asIndex;
  const asHtml = `${candidate}.html`;
  if (existsSync(asHtml) && statSync(asHtml).isFile()) return asHtml;
  return null;
};

const forwardToUpstream = (request, response) => {
  const upstream = new URL(request.url ?? "/", UPSTREAM);
  const options = {
    hostname: upstream.hostname,
    port: upstream.port,
    path: `${upstream.pathname}${request.url ?? "/"}`,
    method: request.method,
    headers: { ...request.headers, host: upstream.host },
  };
  const proxy = httpRequest(options, (upstreamResponse) => {
    response.writeHead(upstreamResponse.statusCode ?? 502, upstreamResponse.headers);
    upstreamResponse.pipe(response);
  });
  proxy.on("error", (error) => {
    response.writeHead(502, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: String(error) }));
  });
  request.pipe(proxy);
};

const server = createServer((request, response) => {
  // The dashboard's API calls ask for JSON, and some of them share a path
  // with a page ("/model-insights" is both). The accept header tells the two
  // apart the same way the proxy does: same origin, different route.
  const wantsJson = (request.headers.accept ?? "").includes("application/json");
  const file = wantsJson ? null : resolveFile(request.url ?? "/");
  if (file === null) {
    forwardToUpstream(request, response);
    return;
  }
  response.writeHead(200, {
    "content-type": CONTENT_TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(file).pipe(response);
});

server.listen(PORT, () => {
  process.stdout.write(`导出产物已托管在 http://localhost:${PORT}，API 转发到 ${UPSTREAM}\n`);
});
