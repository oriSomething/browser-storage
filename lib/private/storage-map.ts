import type { BrowserStorage } from "../storage";

export const STORAGE_SYMBOL = Symbol("BrowserStorage storage");

export function getStorage(instance: BrowserStorage) {
  return (instance as any)[STORAGE_SYMBOL] as StorageMap;
}

/**
 * Used mainly for tests or if you want to push many items with overcome some bureaucracy
 * @param storage
 */
export function getStoragePrivateStorageMap(
  storage: BrowserStorage,
): StorageMap {
  return getStorage(storage);
}

/**
 * Return the value that closest to how browser convert to string values in `localStorage`
 */
function getString(value: any) {
  return "" + value;
}

/**
 * Wrapper to `Map` with needed modifications to work more as `localStorage` is
 */
export class StorageMap {
  #map = new Map<string, string>();

  //#region Listeners
  #clearListeners = new Set<() => void>();
  #propertyChangeListeners = new Set<
    (key: string, value: string | null) => void
  >();

  onPropertyChange(
    listener: (key: string, value: string | null) => void,
  ): () => void {
    this.#propertyChangeListeners.add(listener);
    return () => void this.#propertyChangeListeners.delete(listener);
  }

  onClearChange(listener: () => void): () => void {
    this.#clearListeners.add(listener);
    return () => void this.#clearListeners.delete(listener);
  }
  //#endregion

  //#region Map needed functionality
  has(key: PropertyKey) {
    return this.#map.has(getString(key));
  }

  get(key: PropertyKey) {
    return this.#map.get(getString(key));
  }

  set(key: PropertyKey, value: string) {
    const k = getString(key);
    const v = getString(value);
    this.#map.set(k, v);

    if (this.#propertyChangeListeners.size !== 0) {
      for (const cb of this.#propertyChangeListeners) {
        cb(k, v);
      }
    }

    return this;
  }

  clear() {
    this.#map.clear();

    if (this.#clearListeners.size !== 0) {
      for (const cb of this.#clearListeners) cb();
    }
  }

  delete(key: PropertyKey) {
    const k = getString(key);
    const returnValue = this.#map.delete(k);

    if (this.#propertyChangeListeners.size !== 0) {
      for (const cb of this.#propertyChangeListeners) {
        cb(k, null);
      }
    }

    return returnValue;
  }

  get size() {
    return this.#map.size;
  }

  *keys() {
    yield* this.#map.keys();
  }
  //#endregion
}
