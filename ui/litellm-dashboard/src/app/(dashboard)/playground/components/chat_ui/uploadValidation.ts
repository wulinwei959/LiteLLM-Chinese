import type { PlaygroundTranslator } from "@/lib/i18n/translators";

export type UploadValidationResult = { ok: true } | { ok: false; error: string };

export const CHAT_ATTACHMENT_ACCEPT = "image/png,image/jpeg,image/jpg,image/gif,image/webp,application/pdf,.pdf";
export const IMAGE_EDIT_ACCEPT = "image/png,image/jpeg,image/jpg,image/gif,image/webp";
export const AUDIO_ACCEPT = "audio/*,.mp3,.mp4,.mpeg,.mpga,.m4a,.wav,.webm";

export const MAX_CHAT_ATTACHMENT_BYTES = 20 * 1024 * 1024;
export const MAX_IMAGE_EDIT_BYTES = 20 * 1024 * 1024;
export const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
export const MAX_IMAGE_EDIT_COUNT = 10;
export const MAX_CHAT_ATTACHMENT_COUNT = 1;

const IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"]);
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"]);
const PDF_MIME_TYPES = new Set(["application/pdf"]);
const PDF_EXTENSIONS = new Set([".pdf"]);
const AUDIO_MIME_PREFIX = "audio/";
const AUDIO_EXTENSIONS = new Set([".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm"]);

function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  if (dot < 0) {
    return "";
  }
  return fileName.slice(dot).toLowerCase();
}

function formatMb(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

function isImageFile(file: File): boolean {
  if (IMAGE_MIME_TYPES.has(file.type)) {
    return true;
  }
  return IMAGE_EXTENSIONS.has(getExtension(file.name));
}

function isPdfFile(file: File): boolean {
  if (PDF_MIME_TYPES.has(file.type)) {
    return true;
  }
  return PDF_EXTENSIONS.has(getExtension(file.name));
}

function isAudioFile(file: File): boolean {
  if (file.type.startsWith(AUDIO_MIME_PREFIX)) {
    return true;
  }
  return AUDIO_EXTENSIONS.has(getExtension(file.name));
}

function validateSize(t: PlaygroundTranslator, file: File, maxBytes: number): UploadValidationResult {
  if (file.size <= maxBytes) {
    return { ok: true };
  }
  return {
    ok: false,
    error: t("uploadTooLarge", { name: file.name, max: formatMb(maxBytes) }),
  };
}

export function validateChatAttachment(t: PlaygroundTranslator, file: File): UploadValidationResult {
  if (!isImageFile(file) && !isPdfFile(file)) {
    return {
      ok: false,
      error: t("attachmentUnsupported", { name: file.name }),
    };
  }
  return validateSize(t, file, MAX_CHAT_ATTACHMENT_BYTES);
}

export function validateImageEditFile(
  t: PlaygroundTranslator,
  file: File,
  currentCount: number,
): UploadValidationResult {
  if (currentCount >= MAX_IMAGE_EDIT_COUNT) {
    return {
      ok: false,
      error: t("imageEditLimitReached", { count: MAX_IMAGE_EDIT_COUNT }),
    };
  }
  if (!isImageFile(file)) {
    return {
      ok: false,
      error: t("imageEditUnsupported", { name: file.name }),
    };
  }
  return validateSize(t, file, MAX_IMAGE_EDIT_BYTES);
}

export function validateAudioFile(t: PlaygroundTranslator, file: File): UploadValidationResult {
  if (!isAudioFile(file)) {
    return {
      ok: false,
      error: t("audioUnsupported", { name: file.name }),
    };
  }
  return validateSize(t, file, MAX_AUDIO_BYTES);
}
