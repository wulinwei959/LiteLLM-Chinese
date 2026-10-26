import { serverRootPath } from "@/lib/serverRootPath";

function uiBase(): string {
  // next dev serves the app at the root; only the proxy mounts the static export under /ui
  // (and optionally under server_root_path). Inlined at build time, so production is unaffected.
  if (process.env.NODE_ENV === "development") {
    return "";
  }
  const root = serverRootPath && serverRootPath !== "/" ? `/${serverRootPath.replace(/^\/+|\/+$/g, "")}` : "";
  return `${root}/ui`;
}

/** Absolute (same-origin) href for a dashboard route segment, e.g. "api-reference" -> "/ui/api-reference". */
export function uiHref(routeSegment: string): string {
  return `${uiBase()}/${routeSegment.replace(/^\/+/, "")}`;
}

/** First route segment under the UI base, e.g. "/ui/api-reference/" -> "api-reference" and "/ui/" -> "". */
export function routeSegmentForPathname(pathname: string): string {
  const base = uiBase();
  // The base has to be a whole path segment. A plain prefix match would also
  // strip "/ui" from "/ui-theme", leaving "-theme" and routing the page to no
  // known segment at all.
  const relative =
    base !== "" && (pathname === base || pathname.startsWith(`${base}/`)) ? pathname.slice(base.length) : pathname;
  return relative.replace(/^\/+/, "").split("/")[0];
}
