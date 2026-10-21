import { observeResponseHeaders, type ResponseHeadersListener } from "@/lib/http/observeResponseHeaders";
import openai from "openai";
import { getGatewayBaseUrl } from "@/components/networking";
import { buildPlaygroundHeaders, type CustomHeaders } from "@/components/llm_calls/request_headers";
import { toast } from "@/lib/toast";
import type { PlaygroundTranslator } from "@/lib/i18n/translators";

export async function makeOpenAIImageGenerationRequest(
  t: PlaygroundTranslator,
  prompt: string,
  updateUI: (imageUrl: string, model: string) => void,
  selectedModel: string,
  accessToken: string,
  tags?: string[],
  signal?: AbortSignal,
  customBaseUrl?: string,
  customHeaders?: CustomHeaders,
  onResponseHeaders?: ResponseHeadersListener,
) {
  // base url should be the current base_url
  const isLocal = process.env.NODE_ENV === "development";
  if (isLocal !== true) {
    console.log = function () {};
  }
  const proxyBaseUrl = customBaseUrl || getGatewayBaseUrl();
  const client = new openai.OpenAI({
    apiKey: accessToken,
    baseURL: proxyBaseUrl,
    dangerouslyAllowBrowser: true,
    defaultHeaders: buildPlaygroundHeaders(tags, customHeaders),
    ...(onResponseHeaders ? { fetch: observeResponseHeaders(onResponseHeaders) } : {}),
  });

  try {
    const response = await client.images.generate(
      {
        model: selectedModel,
        prompt: prompt,
      },
      { signal },
    );

    if (response.data && response.data[0]) {
      // Handle either URL or base64 data from response
      if (response.data[0].url) {
        // Use the URL directly
        updateUI(response.data[0].url, selectedModel);
      } else if (response.data[0].b64_json) {
        // Convert base64 to data URL format
        const base64Data = response.data[0].b64_json;
        updateUI(`data:image/png;base64,${base64Data}`, selectedModel);
      } else {
        throw new Error(t("llmCalls.noImageDataInResponse"));
      }
    } else {
      throw new Error(t("llmCalls.invalidResponseFormat"));
    }
  } catch (error) {
    if (signal?.aborted) {
    } else {
      toast.fromError(t("llmCalls.errorGeneratingImage", { error: String(error) }));
    }
    throw error; // Re-throw to allow the caller to handle the error
  }
}
