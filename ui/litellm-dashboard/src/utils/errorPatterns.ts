import type { ModelsHealthTranslator } from "@/lib/i18n/translators";

export interface ErrorPattern {
  pattern: RegExp;
  replacementKey:
    | "errorPatterns.missingApiKey"
    | "errorPatterns.connectionTimeout"
    | "errorPatterns.networkConnectionFailed"
    | "errorPatterns.accessForbidden"
    | "errorPatterns.unauthorized"
    | "errorPatterns.rateLimitExceeded"
    | "errorPatterns.providerInternalServerError"
    | "errorPatterns.authenticationFailed"
    | "errorPatterns.apiError";
}

// Centralised list of common error patterns.
// Add new patterns here without touching component files.
export const errorPatterns: ReadonlyArray<ErrorPattern> = [
  // Generic missing API key (covers OpenAI, Anthropic, etc.)
  {
    pattern: /Missing .* API Key/i,
    replacementKey: "errorPatterns.missingApiKey",
  },
  // Network / connectivity issues
  {
    pattern: /Connection timeout/i,
    replacementKey: "errorPatterns.connectionTimeout",
  },
  {
    pattern: /Network.*not.*ok/i,
    replacementKey: "errorPatterns.networkConnectionFailed",
  },
  // HTTP status based errors
  {
    pattern: /403.*Forbidden/i,
    replacementKey: "errorPatterns.accessForbidden",
  },
  {
    pattern: /401.*Unauthorized/i,
    replacementKey: "errorPatterns.unauthorized",
  },
  {
    pattern: /429.*rate limit/i,
    replacementKey: "errorPatterns.rateLimitExceeded",
  },
  {
    pattern: /500.*Internal Server Error/i,
    replacementKey: "errorPatterns.providerInternalServerError",
  },
  // LiteLLM specific wrapped errors
  {
    pattern: /litellm\.AuthenticationError/i,
    replacementKey: "errorPatterns.authenticationFailed",
  },
  {
    pattern: /litellm\.RateLimitError/i,
    replacementKey: "errorPatterns.rateLimitExceeded",
  },
  {
    pattern: /litellm\.APIError/i,
    replacementKey: "errorPatterns.apiError",
  },
];

export const errorPatternReplacement = (t: ModelsHealthTranslator, pattern: ErrorPattern): string =>
  t(pattern.replacementKey);
