import type { ChatAttachment, Conversation } from "./types";
import type { ChatTranslator } from "@/lib/i18n/translators";

const DATABASE_NAME = "litellm_chat_media_v1";
const STORE_NAME = "images";
let databasePromise: Promise<IDBDatabase> | undefined;
const imageWrites = new Map<string, Promise<void>>();

function openDatabase(t: ChatTranslator): Promise<IDBDatabase> {
  if (!databasePromise) {
    databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME, { keyPath: ["userId", "id"] });
      };
      request.onsuccess = () => {
        const database = request.result;
        database.onversionchange = () => {
          database.close();
          databasePromise = undefined;
          imageWrites.clear();
        };
        resolve(database);
      };
      request.onerror = () => reject(request.error ?? new Error(t("attachments.storageUnavailable")));
      request.onblocked = () => reject(new Error(t("attachments.storageBlocked")));
    }).catch((error: unknown) => {
      databasePromise = undefined;
      throw error;
    });
  }
  return databasePromise;
}

export function getConversationImages(conversations: Conversation[]): ChatAttachment[] {
  return conversations.flatMap((conversation) =>
    conversation.messages.flatMap((message) => [...(message.attachments ?? []), ...(message.generatedImages ?? [])]),
  );
}

export function persistChatImages(userId: string, images: ChatAttachment[], t: ChatTranslator): Promise<void> {
  return Promise.all(
    images
      .filter((image) => image.url.startsWith("data:"))
      .map((image) => {
        const key = JSON.stringify([userId, image.id]);
        let write = imageWrites.get(key);
        if (!write) {
          write = openDatabase(t)
            .then(
              (database) =>
                new Promise<void>((resolve, reject) => {
                  const transaction = database.transaction(STORE_NAME, "readwrite");
                  transaction.objectStore(STORE_NAME).put({ userId, id: image.id, url: image.url });
                  transaction.oncomplete = () => resolve();
                  transaction.onerror = () => reject(transaction.error ?? new Error(t("attachments.saveFailed")));
                  transaction.onabort = () => reject(transaction.error ?? new Error(t("attachments.saveCanceled")));
                }),
            )
            .catch((error: unknown) => {
              imageWrites.delete(key);
              throw error;
            });
          imageWrites.set(key, write);
        }
        return write;
      }),
  ).then(() => undefined);
}

export async function loadChatImages(userId: string, ids: string[], t: ChatTranslator): Promise<Map<string, string>> {
  if (!ids.length) return new Map();
  const database = await openDatabase(t);
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const loaded = new Map<string, string>();
    for (const id of new Set(ids)) {
      const request = transaction.objectStore(STORE_NAME).get([userId, id]);
      request.onsuccess = () => {
        if (typeof request.result?.url === "string") loaded.set(id, request.result.url);
      };
    }
    transaction.oncomplete = () => resolve(loaded);
    transaction.onerror = () => reject(transaction.error ?? new Error(t("attachments.restoreFailed")));
    transaction.onabort = () => reject(transaction.error ?? new Error(t("attachments.restoreCanceled")));
  });
}

export async function deleteChatImages(userId: string, ids: string[], t: ChatTranslator): Promise<void> {
  if (!ids.length) return;
  for (const id of ids) imageWrites.delete(JSON.stringify([userId, id]));
  const database = await openDatabase(t);
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    for (const id of ids) transaction.objectStore(STORE_NAME).delete([userId, id]);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error(t("attachments.deleteFailed")));
    transaction.onabort = () => reject(transaction.error ?? new Error(t("attachments.deleteCanceled")));
  });
}

export function withoutImageData(conversations: Conversation[]): Conversation[] {
  const stripData = <T extends ChatAttachment>(images: T[] | undefined) =>
    images?.map((image) => (image.url.startsWith("data:") ? { ...image, url: "" } : image));
  return conversations.map((conversation) => ({
    ...conversation,
    messages: conversation.messages.map((message) => ({
      ...message,
      ...(message.attachments ? { attachments: stripData(message.attachments) } : {}),
      ...(message.generatedImages ? { generatedImages: stripData(message.generatedImages) } : {}),
    })),
  }));
}

export function withRestoredImages(conversations: Conversation[], images: Map<string, string>): Conversation[] {
  const restore = <T extends ChatAttachment>(attachments: T[]) =>
    attachments.map((image) => (!image.url && images.has(image.id) ? { ...image, url: images.get(image.id)! } : image));
  return conversations.map((conversation) => ({
    ...conversation,
    messages: conversation.messages.map((message) => ({
      ...message,
      ...(message.attachments ? { attachments: restore(message.attachments) } : {}),
      ...(message.generatedImages ? { generatedImages: restore(message.generatedImages) } : {}),
    })),
  }));
}
