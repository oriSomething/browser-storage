import { getStorage, getStoragePrivateStorageMap } from "./private/storage-map";
import { createProxy } from "./private/create-proxy";

export class BrowserStorage implements Storage {
  [name: string]: any;

  constructor() {
    // The magic behind `localStorage` and `sessionStorage` special behavior
    // NOTE: In JS if your return an object from `constructor` it become the actual
    //       object returned from `new` expression
    return createProxy(this);
  }

  get length(): number {
    return getStorage(this).size;
  }

  clear(): void {
    getStorage(this).clear();
  }

  getItem(key: string): string | null {
    if (arguments.length === 0) {
      throw new TypeError(
        `Storage.getItem: At least 1 argument required, but only ${arguments.length} passed`,
      );
    }

    const value = getStorage(this).get(key);
    return value == null ? null : value;
  }

  key(index: number): string | null {
    if (arguments.length === 0) {
      throw new TypeError(
        `Storage.key: At least 1 argument required, but only ${arguments.length} passed`,
      );
    }

    let count = 0;

    const i = index % 0x100000000;

    for (const key of getStorage(this).keys()) {
      if (count === i) {
        return key;
      }
      count++;
    }

    return null;
  }

  removeItem(key: string): void {
    if (arguments.length === 0) {
      throw new TypeError(
        `Storage.removeItem: At least 1 argument required, but only ${arguments.length} passed`,
      );
    }

    getStorage(this).delete(key);
  }

  /**
   * @todo Support `QuotaExceededError` throwing for settings "size limit"
   */
  setItem(key: string, value: string): void {
    if (arguments.length < 2) {
      throw new TypeError(
        `Storage.setItem: At least 2 argument required, but only ${arguments.length} passed`,
      );
    }

    getStorage(this).set(key, value);
  }
}

//#region Public helpers

export function subscribePropertyChange(
  storage: BrowserStorage,
  listener: (key: string, value: string | null) => void,
): () => void {
  const s = getStoragePrivateStorageMap(storage);
  return s.onPropertyChange(listener);
}

export function subscribeClear(
  storage: BrowserStorage,
  listener: () => void,
): () => void {
  const s = getStoragePrivateStorageMap(storage);
  return s.onClearChange(listener);
}

/**
 * Set given key and emit `storage` event on `window`.
 * Works only on browser context.
 * `storageArea` can only be `null` or `Storage` instance that cannot be sub-class currently.
 * So we patch `storageArea` with `Object.defineProperty`.
 * @param storage
 * @param key
 * @param value (`null` for deleting properties)
 */
export function setWithEmitStorage(
  storage: BrowserStorage,
  key: string,
  newValue: string,
): void {
  const oldValue = storage.getItem(key);
  storage.setItem(key, newValue);

  // Works only on browser context
  if (typeof window === "undefined" || typeof StorageEvent === "undefined") {
    return;
  }

  // Gets normalized value first
  const newValue_ = storage.getItem(key);

  // Emits only on change
  if (oldValue !== newValue_) {
    const event = new StorageEvent("storage", {
      storageArea: null,
      key,
      newValue: newValue_,
      oldValue,
      bubbles: false,
      cancelable: false,
    });

    Object.defineProperty(event, "storageArea", {
      get: () => storage,
    });

    window.dispatchEvent(event);
  }
}

/**
 * Remove given key and emit `storage` event on `window`.
 * Works only on browser context.
 * `storageArea` can only be `null` or `Storage` instance that cannot be sub-class currently.
 * So we patch `storageArea` with `Object.defineProperty`.
 * @param storage
 * @param key
 * @param value (`null` for deleting properties)
 */
export function removeWithEmitStorage(
  storage: BrowserStorage,
  key: string,
): void {
  const oldValue = storage.getItem(key);
  storage.removeItem(key);

  // Works only on browser context
  if (typeof window === "undefined" || typeof StorageEvent === "undefined") {
    return;
  }

  // Emits only on change
  if (oldValue !== null) {
    const event = new StorageEvent("storage", {
      storageArea: null,
      key,
      newValue: null,
      oldValue,
      bubbles: false,
      cancelable: false,
    });

    Object.defineProperty(event, "storageArea", {
      get: () => storage,
    });

    window.dispatchEvent(event);
  }
}
//#endregion
