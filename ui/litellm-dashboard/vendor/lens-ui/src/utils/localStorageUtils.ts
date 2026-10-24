import { lensTranslate } from "../host/lensTranslate";
export const LOCAL_STORAGE_EVENT = "local-storage-change";

export function emitLocalStorageChange(key: string) {
  window.dispatchEvent(new CustomEvent(LOCAL_STORAGE_EVENT, { detail: { key } }));
}

export function getLocalStorageItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(lensTranslate("utils.errorReadingLocalStorageKey", { value0: key }), error);
    return null;
  }
}

export function setLocalStorageItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(lensTranslate("utils.errorSettingLocalStorageKey", { value0: key }), error);
  }
}

export function removeLocalStorageItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(lensTranslate("utils.errorRemovingLocalStorageKey", { value0: key }), error);
  }
}
