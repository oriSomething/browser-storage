import type { BrowserStorage } from "../storage";
import { STORAGE_SYMBOL, StorageMap } from "./storage-map";

export function createProxy(instance: BrowserStorage) {
  const storage = new StorageMap();

  //#region Proxy wrapper
  const proxy = new Proxy(instance, {
    has: (target, key) => {
      if (Reflect.has(target, key)) {
        return true;
      }

      return typeof key === "string" ? storage.has(key) : false;
    },

    get: (target, key, receiver) => {
      if (key === STORAGE_SYMBOL) return storage;

      if (Reflect.has(target.constructor.prototype, key)) {
        return Reflect.get(target.constructor.prototype, key, receiver);
      }

      if (Reflect.has(target, key)) {
        return Reflect.get(target, key, receiver);
      } else {
        return typeof key !== "symbol" ? storage.get(key) : undefined;
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

      if (typeof property === "string" && storage.has(property)) {
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

      if (typeof property === "symbol") {
        return Reflect.defineProperty(target, property, attributes);
      }

      return false;
    },

    deleteProperty: (target, property) => {
      const result = Reflect.deleteProperty(target, property);

      if (typeof property !== "symbol") {
        storage.delete(property);
        return true;
      }

      return result;
    },
  });
  //#endregion

  return proxy;
}
