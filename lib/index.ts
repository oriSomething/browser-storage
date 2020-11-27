/**
 * Used to access to the real `Map` conatains all data of storage instance
 */
const STORAGE_SYMBOL = Symbol("BrowserStorage storage");
//#region Helpers
/**
 * Return the value that closest to how borwsers convert to string values in `localStorage`
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
  private _map = new Map<string, string>();

  //#region Listeners
  clearListeners = new Set<() => void>();
  propertyChangeListeners = new Set<
    (key: string, value: string | null) => void
  >();
  //#endregion

  //#region Map needed functionality
  has(key: PropertyKey) {
    return this._map.has(getString(key));
  }

  get(key: PropertyKey) {
    return this._map.get(getString(key));
  }

  set(key: PropertyKey, value: string) {
    const k = getString(key);
    const v = getString(value);
    this._map.set(k, v);

    if (this.propertyChangeListeners.size !== 0) {
      for (let cb of this.propertyChangeListeners) {
        cb(k, v);
      }
    }

    return this;
  }

  clear() {
    this._map.clear();

    if (this.clearListeners.size !== 0) {
      for (let cb of this.clearListeners) cb();
    }
  }

  delete(key: PropertyKey) {
    const k = getString(key);
    const returnValue = this._map.delete(k);

    if (this.propertyChangeListeners.size !== 0) {
      for (let cb of this.propertyChangeListeners) {
        cb(k, null);
      }
    }

    return returnValue;
  }

  get size() {
    return this._map.size;
  }

  *keys() {
    yield* this._map.keys();
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

      if (Reflect.has(target, key)) {
        return Reflect.get(target, key, receiver);
      } else {
        return storage.get(key);
      }
    },

    ownKeys: (target) => {
      return [...Reflect.ownKeys(target), ...storage.keys()];
    },

    getOwnPropertyDescriptor: (target, property) => {
      const value = Reflect.getOwnPropertyDescriptor(target, property);
      if (value !== undefined) return value;

      if (storage.has(property)) {
        return {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          value: storage.get(property)!,
          writable: true,
          enumerable: true,
          configurable: true,
        };
      }

      return undefined;
    },

    set: (target, property, value, receiver) => {
      if (Reflect.has(target, property)) {
        return Reflect.set(target, property, value, receiver);
      }

      storage.set(property, value);
      return true;
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
    // The magic behind `localStorage` special behaviour
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
    return getStorage(this).get(key) ?? null;
  }

  key(index: number): string | null {
    let count = 0;

    for (let key of getStorage(this).keys()) {
      if (count === index) {
        return key;
      }
      count++;
    }

    return null;
  }

  removeItem(key: string): void {
    getStorage(this).delete(key);
  }

  /**
   * @todo Support `QuotaExceededError` throwing for settings "size limit"
   */
  setItem(key: string, value: string): void {
    getStorage(this).set(key, value);
  }
}

//#region Public helpers
/**
 * Used mainly for tests or if you want to push many items with overcome some bureaucracy
 * @param storage
 */
export function getStoragePrivateStorageMap(
  storage: BrowserStorage
): StorageMap {
  return getStorage(storage);
}

export function subscribePropertyChange(
  storage: BrowserStorage,
  listener: (key: string, value: string | null) => void
): () => void {
  let s: StorageMap | undefined = getStoragePrivateStorageMap(storage);
  s.propertyChangeListeners.add(listener);

  return () => {
    if (s?.propertyChangeListeners.delete(listener)) {
      s = undefined;
    }
  };
}

export function subscribeClear(
  storage: BrowserStorage,
  listener: () => void
): () => void {
  let s: StorageMap | undefined = getStoragePrivateStorageMap(storage);
  s.clearListeners.add(listener);

  return () => {
    if (s?.clearListeners.delete(listener)) {
      s = undefined;
    }
  };
}
//#endregion

//#region TODO
/**
 * Set given key and emit `storage` event on `window`.
 * Works only on browser context.
 * `storageArea` can only be `null` or `Storage` instance that cannot be sub-class currently.
 * @param storage
 * @param key
 * @param value (`null` for deleting properties)
 */
export function setWithEmitStorage(
  storage: BrowserStorage,
  key: string,
  newValue: string
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

    window.dispatchEvent(event);
  }
}

/**
 * Remove given key and emit `storage` event on `window`.
 * Works only on browser context.
 * `storageArea` can only be `null` or `Storage` instance that cannot be sub-class currently.
 * @param storage
 * @param key
 * @param value (`null` for deleting properties)
 */
export function removeWithEmitStorage(
  storage: BrowserStorage,
  key: string
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

    window.dispatchEvent(event);
  }
}
//#endregion
