import { createApiClient } from "@/lib/http/client";
import { resolveApiBase } from "@/lib/http/resolveApiBase";
import {
  registerAuthHeaderNameGetter,
  registerAuthTokenGetter,
  registerBaseUrlGetter,
  registerErrorHandler,
} from "@/lib/http/runtime";
import { setServerRootPath } from "@/lib/serverRootPath";
import { clearTokenCookies, getCookie } from "@/utils/cookieUtils";
import { decodeToken } from "@/utils/jwtUtils";
import { normalizeBackendPageUrlToUiOrigin } from "@/utils/returnUrlUtils";
import { toast, toastMessage } from "@/lib/toast";

export const isLocal = process.env.NODE_ENV === "development";
// In dev, if NEXT_PUBLIC_USE_REWRITES=true the Next.js dev server proxies API calls
// to the backend — use relative URLs (null) so rewrites can intercept them.
const resolveDefaultBase = (fallback: string | null): string | null => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (isLocal && process.env.NEXT_PUBLIC_USE_REWRITES !== "true") return "http://localhost:4000";
  return fallback;
};
export const defaultProxyBaseUrl = resolveDefaultBase(null);
export const WORKER_URL_KEY = "litellm_worker_url";
// If a worker URL is in localStorage, use it as the initial proxyBaseUrl.
// This survives page navigation.
const _rawWorkerUrl = typeof window !== "undefined" ? window.localStorage.getItem(WORKER_URL_KEY) : null;
// Validate stored worker URL — reject non-HTTP schemes to prevent exfiltration
const _initialWorkerUrl = (() => {
  if (!_rawWorkerUrl) return null;
  try {
    const parsed = new URL(_rawWorkerUrl);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return _rawWorkerUrl;
  } catch {
    /* invalid URL */
  }
  // Invalid URL in storage — clear it
  if (typeof window !== "undefined") window.localStorage.removeItem(WORKER_URL_KEY);
  return null;
})();
export let proxyBaseUrl: string | null = _initialWorkerUrl ?? defaultProxyBaseUrl;
export let discoveredProxyBaseUrl: string | null = defaultProxyBaseUrl;
export let gatewayBaseUrl: string | null = null;
export let runtimeBackendBaseUrl: string | null = null;
if (isLocal != true) {
  console.log = function () {};
}

const getWindowLocation = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.location;
};

export const updateProxyBaseUrl = (serverRootPath: string, receivedProxyBaseUrl: string | null = null) => {
  /**
   * Special function for updating the proxy base url. Should only be called by getUiConfig.
   */
  const resolvedProxyBaseUrl = resolveApiBase({
    explicitBase: receivedProxyBaseUrl || resolveDefaultBase(getWindowLocation()?.origin ?? null),
    serverRootPath,
  });
  discoveredProxyBaseUrl = resolvedProxyBaseUrl || null;
  if (typeof window !== "undefined" && window.localStorage.getItem(WORKER_URL_KEY)) return;
  proxyBaseUrl = resolvedProxyBaseUrl;
};

export const updateServerRootPath = (receivedServerRootPath: string) => {
  setServerRootPath(receivedServerRootPath);
};

export const getProxyBaseUrl = (): string => {
  if (proxyBaseUrl) {
    return proxyBaseUrl;
  }
  const browserLocation = getWindowLocation();
  return browserLocation?.origin ?? "";
};

export const getRuntimeBackendBaseUrl = (): string | null => runtimeBackendBaseUrl;

export const getUiPageUrl = (url: string, relativePath = false): string => {
  const browserLocation = getWindowLocation();
  return normalizeBackendPageUrlToUiOrigin(url, runtimeBackendBaseUrl, browserLocation?.origin ?? null, relativePath);
};

export const normalizeHttpUrl = (url: string | null | undefined): string | null => {
  const trimmedUrl = (url ?? "").trim();
  if (!trimmedUrl || !isValidHttpUrl(trimmedUrl)) return null;
  return trimmedUrl.replace(/\/+$/, "");
};

export const getGatewayBaseUrl = (): string => {
  if (typeof window !== "undefined" && window.localStorage.getItem(WORKER_URL_KEY)) {
    return getProxyBaseUrl();
  }
  return gatewayBaseUrl ?? getProxyBaseUrl();
};

/**
 * Switch API calls to point at a worker (or back to the control plane).
 * Persists to localStorage so it survives page navigation. Also updates the
 * module-level proxyBaseUrl so in-flight code in this JS execution sees the
 * new value immediately.
 */
export function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function switchToWorkerUrl(workerUrl: string | null): void {
  if (workerUrl && !isValidHttpUrl(workerUrl)) {
    return;
  }
  if (typeof window !== "undefined") {
    if (workerUrl) {
      window.localStorage.setItem(WORKER_URL_KEY, workerUrl);
    } else {
      window.localStorage.removeItem(WORKER_URL_KEY);
    }
  }
  proxyBaseUrl = workerUrl ?? discoveredProxyBaseUrl;
}

let lastErrorTime = 0;

export const handleError = async (errorData: string | any) => {
  const currentTime = Date.now();
  if (currentTime - lastErrorTime > 60000) {
    // 60000 milliseconds = 60 seconds
    // Convert errorData to string if it isn't already
    const errorString = typeof errorData === "string" ? errorData : JSON.stringify(errorData);
    if (errorString.includes("Authentication Error - Expired Key")) {
      toast.info(toastMessage("sessionExpired"));
      lastErrorTime = currentTime;
      clearTokenCookies();
      const browserLocation = getWindowLocation();
      if (browserLocation) {
        window.location.href = browserLocation.pathname + browserLocation.search + browserLocation.hash;
      }
    }
    lastErrorTime = currentTime;
  }
};

export let globalLitellmHeaderName: string = "Authorization";

// Function to set the global header name
export function setGlobalLitellmHeaderName(headerName: string = "Authorization") {
  globalLitellmHeaderName = headerName;
}

// Function to get the global header name
export function getGlobalLitellmHeaderName(): string {
  return globalLitellmHeaderName;
}

export const apiClient = createApiClient({
  getBaseUrl: getProxyBaseUrl,
  getAuthHeaderName: getGlobalLitellmHeaderName,
  onError: handleError,
});

export const gatewayApiClient = createApiClient({
  getBaseUrl: getGatewayBaseUrl,
  getAuthHeaderName: getGlobalLitellmHeaderName,
  onError: handleError,
});

registerBaseUrlGetter(getProxyBaseUrl);
registerAuthHeaderNameGetter(getGlobalLitellmHeaderName);
registerAuthTokenGetter(() => decodeToken(getCookie("token"))?.key ?? null);
registerErrorHandler(handleError);

export const setGatewayBaseUrl = (url: string | null): void => {
  gatewayBaseUrl = url;
};

export const setRuntimeBackendBaseUrl = (url: string | null): void => {
  runtimeBackendBaseUrl = url;
};
