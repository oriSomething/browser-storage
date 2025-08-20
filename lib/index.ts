/**
 * Used to access to the real `Map` contains all data of storage instance
 */
const STORAGE_SYMBOL = Symbol("BrowserStorage storage");

//#region Helpers
/**
 * Return the value that closest to how browser convert to string values in `localStorage`
 */
function getString(value: any) {
  return "" + value;
}

function getStorage(instance: BrowserStorage) {
  return (instance as any)[STORAGE_SYMBOL] as StorageMap;
}
//#endregion

//#region StorageMap
/**
 * Wrapper to `Map` with needed modifications to work more as `localStorage` is
 */
class StorageMap {
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
//#endregion

//#region Proxy creator
/**
 * @todo `defineProperty` support. (Never actually see support to such as edge case)
 */
function createProxy(instance: BrowserStorage) {
  const storage = new StorageMap();

  //#region Proxy wrapper
  const proxy = new Proxy(instance, {
    has: (target, key) => {
      return Reflect.has(target, key) || storage.has(key);
    },

    get: (target, key, receiver) => {
      if (key === STORAGE_SYMBOL) return storage;

      if (Reflect.has(target.constructor.prototype, key)) {
        return Reflect.get(target.constructor.prototype, key, receiver);
      }

      if (Reflect.has(target, key)) {
        return Reflect.get(target, key, receiver);
      } else {
        return storage.get(key);
      }
    },

    ownKeys: (target) => {
      const keys = Reflect.ownKeys(target);

      for (const key of storage.keys()) {
        if (!Reflect.has(target.constructor.prototype, key)) {
          keys.push(key);
        }
      }

      return keys;
    },

    getOwnPropertyDescriptor: (target, property) => {
      if (Reflect.has(target.constructor.prototype, property)) {
        return undefined;
      }

      if (Reflect.has(target, property)) {
        const value = Reflect.getOwnPropertyDescriptor(target, property);
        if (value !== undefined) return value;
      }

      if (storage.has(property)) {
        return {
          value: storage.get(property),
          writable: true,
          enumerable: true,
          configurable: true,
        };
      }

      return undefined;
    },

    set: (target, property, value, receiver) => {
      if (typeof property === "symbol") {
        return Reflect.set(target, property, value, receiver);
      }

      storage.set(property, value);
      return true;
    },

    /**
     * `configurable`, `enumerable`, `writable` are ignored.
     * Getters and setters aren't allowed
     */
    defineProperty: (target, property, attributes) => {
      if (Reflect.has(target, property)) {
        return Reflect.defineProperty(target, property, attributes);
      }

      if (attributes.get !== undefined || attributes.set !== undefined) {
        throw new TypeError("Accessor properties are not allowed");
      }

      if (typeof property === "string") {
        storage.set(property, attributes.value);
        return true;
      }

      return false;
    },

    // NOTE: Not sure if there is any case it returns `false`
    deleteProperty: (target, property) => {
      Reflect.deleteProperty(target, property);
      storage.delete(property);
      return true;
    },
  });
  //#endregion

  return proxy;
}
//#endregion

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
/**
 * Used mainly for tests or if you want to push many items with overcome some bureaucracy
 * @param storage
 */
export function getStoragePrivateStorageMap(
  storage: BrowserStorage,
): StorageMap {
  return getStorage(storage);
}

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
