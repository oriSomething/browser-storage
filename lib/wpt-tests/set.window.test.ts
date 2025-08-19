/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/set.window.js}
 */

//#region Imports
import { describe, expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

describe.sequential.each([9, "x"])("Testing key: %j", function (key) {
  test("Setting property for key", () => {
    var expected = "value for " + Math.random().toString(32);
    var value = expected;
    key = key as string;

    var storage = new BrowserStorage();
    storage.clear();

    expect(storage[key]).toBe(undefined);
    expect(storage.getItem(key)).toBe(null);
    expect((storage[key] = value)).toBe(value);
    expect(storage[key]).toBe(expected);
    expect(storage.getItem(key)).toBe(expected);
  });

  test("Setting property with toString for key", () => {
    var expected = "value for " + Math.random().toString(32);
    var value = {
      toString: function () {
        return expected;
      },
    };

    var storage = new BrowserStorage();
    storage.clear();

    expect(storage[key]).toBe(undefined);
    expect(storage.getItem(key as string)).toBe(null);
    expect((storage[key] = value)).toBe(value);
    expect(storage[key]).toBe(expected);
    expect(storage.getItem(key as string)).toBe(expected);
  });

  test(
    "Setting property for key " + key + " with data property on prototype",
    () => {
      class TestedStorage extends BrowserStorage {}

      var proto = "proto for " + Math.random().toString(32);

      TestedStorage.prototype[key] = proto;

      var value = "value for " + Math.random().toString(32);
      var storage = new TestedStorage();
      storage.clear();

      expect(storage[key], "[key] is proto").toBe(proto);
      expect(storage.getItem(key as string), "getItem(key) is null").toBe(null);
      expect((storage[key] = value), "setter returns the value as is").toBe(
        value,
      );
      expect(storage[key], "[key] is proto").toBe(proto);
      expect(
        Object.getOwnPropertyDescriptor(storage, key),
        `getOwnPropertyDescriptor(…, ${JSON.stringify(key)})`,
      ).toBeUndefined();
      expect(
        storage.getItem(key as string),
        "unlike property accessor, from getItem we should get the value of the assignment",
      ).toBe(value);
    },
  );

  test(`Setting property for key ${key} with data property on prototype and existing item`, () => {
    class TestedStorage extends BrowserStorage {}

    var proto = "proto for " + Math.random().toString(32);
    TestedStorage.prototype[key] = proto;

    var value = "value for " + Math.random().toString(32);
    var existing = "existing for " + Math.random().toString(32);
    var storage = new TestedStorage();
    storage.clear();

    storage.setItem(key as string, existing);

    expect(storage[key], "setter returns proto").toBe(proto);
    expect(Object.getOwnPropertyDescriptor(storage, key)).toBeUndefined();
    expect(storage.getItem(key as string), "getItem(key) = existing").toBe(
      existing,
    );
    expect((storage[key] = value), "setter returns the assigned value").toBe(
      value,
    );
    expect(storage[key], "getter key value").toBe(proto);
    expect(Object.getOwnPropertyDescriptor(storage, key)).toBeUndefined();
    expect(storage.getItem(key as string), "getItem(key) = value").toBe(value);
  });

  test(`Setting property for key ${key} with accessor property on prototype`, () => {
    class TestedStorage extends BrowserStorage {}
    var storage = new TestedStorage();
    storage.clear();

    var proto = "proto getter for " + Math.random().toString(32);

    Object.defineProperty(TestedStorage.prototype, key, {
      get: function () {
        return proto;
      },
      set: function () {
        expect.fail("Should not call [[Set]] on prototype");
      },
      configurable: true,
    });

    var value = "value for " + Math.random().toString(32);

    expect(storage[key]).toBe(proto);
    expect(storage.getItem(key as string)).toBeNull();
    expect((storage[key] = value)).toBe(value);
    // Property is hidden because no [LegacyOverrideBuiltIns].
    expect(storage[key]).toBe(proto);
    expect(Object.getOwnPropertyDescriptor(storage, key)).toBeUndefined();
    expect(storage.getItem(key as string)).toBe(value);

    delete TestedStorage.prototype[key];
    delete storage[key];
    expect(key in storage).toBe(false);
  });
});
