import { observeResponseHeaders, type ResponseHeadersListener } from "@/lib/http/observeResponseHeaders";
import openai from "openai";
import { getGatewayBaseUrl } from "@/components/networking";
import { buildPlaygroundHeaders, type CustomHeaders } from "@/components/llm_calls/request_headers";
import { toast } from "@/lib/toast";
import type { PlaygroundTranslator } from "@/lib/i18n/translators";

export async function makeOpenAIAudioTranscriptionRequest(
  t: PlaygroundTranslator,
  audioFile: File,
  updateUI: (transcription: string, model: string) => void,
  selectedModel: string,
  accessToken: string,
  tags?: string[],
  signal?: AbortSignal,
  language?: string,
  prompt?: string,
  responseFormat?: string,
  temperature?: number,
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
    const response = await client.audio.transcriptions.create(
      {
        model: selectedModel,
        file: audioFile,
        ...(language ? { language: language } : {}),
        ...(prompt ? { prompt: prompt } : {}),
        ...(responseFormat ? { response_format: responseFormat as any } : {}),
        ...(temperature !== undefined ? { temperature: temperature } : {}),
      },
      { signal },
    );

    // The response is a transcription object with a text field
    if (response && response.text) {
      updateUI(response.text, selectedModel);
      toast.success(t("llmCalls.audioTranscriptionSuccessToast"));
    } else {
      throw new Error(t("llmCalls.noTranscriptionText"));
    }
  } catch (error: any) {
    console.error("Error making audio transcription request:", error);

    if (signal?.aborted) {
    } else {
      let errorMessage = t("llmCalls.audioTranscriptionDefaultError");

      if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.fromError(t("llmCalls.audioTranscriptionFailedToast", { error: errorMessage }));
    }
    throw error; // Re-throw to allow the caller to handle the error
  }
}
