import type { ResponseHeadersListener } from "@/lib/http/observeResponseHeaders";
import { toast } from "@/lib/toast";
import { getGatewayBaseUrl, getGlobalLitellmHeaderName } from "@/components/networking";
import {
  buildPlaygroundHeaders,
  type CustomHeaders,
  withRequiredHeaders,
} from "@/components/llm_calls/request_headers";
import type { PlaygroundTranslator } from "@/lib/i18n/translators";

export async function makeOpenAIEmbeddingsRequest(
  t: PlaygroundTranslator,
  input: string,
  updateEmbeddingsUI: (embeddings: string, model?: string) => void,
  selectedModel: string,
  accessToken: string,
  tags?: string[],
  customBaseUrl?: string,
  customHeaders?: CustomHeaders,
  onResponseHeaders?: ResponseHeadersListener,
) {
  if (!accessToken) {
    throw new Error(t("llmCalls.virtualKeyRequired"));
  }

  // Base URL should be the current base_url
  const isLocal = process.env.NODE_ENV === "development";
  if (isLocal !== true) {
    console.log = function () {};
  }

  const proxyBaseUrl = customBaseUrl || getGatewayBaseUrl();
  const headers = withRequiredHeaders(buildPlaygroundHeaders(tags, customHeaders), {
    "Content-Type": "application/json",
    [getGlobalLitellmHeaderName()]: `Bearer ${accessToken}`,
  });

  try {
    const normalizedBaseUrl = proxyBaseUrl.endsWith("/") ? proxyBaseUrl.slice(0, -1) : proxyBaseUrl;
    const requestUrl = `${normalizedBaseUrl}/embeddings`;

    const response = await fetch(requestUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: selectedModel,
        input,
      }),
    });
    onResponseHeaders?.(response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || t("llmCalls.requestFailedWithStatus", { status: response.status }));
    }

    const responseData = await response.json();
    const embedding = responseData?.data?.[0]?.embedding;

    if (!embedding) {
      throw new Error(t("llmCalls.noEmbeddingReturned"));
    }

    updateEmbeddingsUI(JSON.stringify(embedding), responseData?.model ?? selectedModel);
  } catch (error: unknown) {
    toast.fromError(t("llmCalls.errorMakingEmbeddingsRequest", { error: String(error) }));

    throw error; // Re-throw to allow the caller to handle the error
  }
}
