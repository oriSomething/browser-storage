/**
 * Based on WPT with modifications
 * Some tests are omitted since they don't pass browser neither
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/set.window.js}
 */

//#region Imports
import test from "ava";
import { BrowserStorage } from "../index";
//#endregion

let cleanups: Array<() => void> = [];

test.afterEach.always((__t) => {
  let cb;
  while ((cb = cleanups.pop())) cb();
});

[9, "x"].forEach(function (key) {
  test("Setting property for key " + key, (t) => {
    var expected = "value for " + Math.random().toString(32);
    var value = expected;
    key = key as string;

    var storage = new BrowserStorage();
    storage.clear();

    t.is(storage[key], undefined);
    t.is(storage.getItem(key), null);
    t.is((storage[key] = value), value);
    t.is(storage[key], expected);
    t.is(storage.getItem(key), expected);
  });

  test("Setting property with toString for key " + key, (t) => {
    var expected = "value for " + Math.random().toString(32);
    key = key as string;
    var value = {
      toString: function () {
        return expected;
      },
    };

    var storage = new BrowserStorage();
    storage.clear();

    t.is(storage[key], undefined);
    t.is(storage.getItem(key), null);
    t.is((storage[key] = value), value);
    t.is(storage[key], expected);
    t.is(storage.getItem(key), expected);
  });

  test.serial(
    "Setting property for key " + key + " with data property on prototype",
    (t) => {
      key = key as string;
      var proto = "proto for " + Math.random().toString(32);

      BrowserStorage.prototype[key] = proto;
      cleanups.push(() => {
        delete BrowserStorage.prototype[key];
      });

      var value = "value for " + Math.random().toString(32);

      var storage = new BrowserStorage();
      storage.clear();

      t.is(storage[key], proto);
      t.is(storage.getItem(key), null);
      t.is((storage[key] = value), value);
      // Hidden because no [LegacyOverrideBuiltIns].
      // These 3 tests don't pass in Chrome
      // t.is(storage[key], proto);
      // t.is(Object.getOwnPropertyDescriptor(storage, key), undefined);
      // t.is(storage.getItem(key), value);
    }
  );

  test.serial(
    `Setting property for key ${key} with data property on prototype and existing item`,
    (t) => {
      key = key as string;
      var proto = "proto for " + Math.random().toString(32);
      BrowserStorage.prototype[key] = proto;
      cleanups.push(() => {
        delete BrowserStorage.prototype[key];
      });

      var value = "value for " + Math.random().toString(32);
      var existing = "existing for " + Math.random().toString(32);
      var storage = new BrowserStorage();
      storage.clear();

      storage.setItem(key, existing);
      // Hidden because no [LegacyOverrideBuiltIns].
      t.is(storage[key], proto);
      // t.is(Object.getOwnPropertyDescriptor(storage, key), undefined);
      // t.is(storage.getItem(key), existing);
      t.is((storage[key] = value), value);
      // t.is(storage[key], proto);
      // t.is(Object.getOwnPropertyDescriptor(storage, key), undefined);
      // t.is(storage.getItem(key), value);
    }
  );

  test.serial.only(
    `Setting property for key ${key} with accessor property on prototype`,
    (t) => {
      let isInTesting = true;
      key = key as string;
      var storage = new BrowserStorage();
      storage.clear();
      var proto = "proto getter for " + Math.random().toString(32);
      Object.defineProperty(BrowserStorage.prototype, key, {
        get: function () {
          return proto;
        },
        set: (__) => {
          if (isInTesting) {
            t.fail("Should not call [[Set]] on prototype");
          }
        },
        configurable: true,
      });

      cleanups.push(() => {
        delete BrowserStorage.prototype[key];
        delete storage[key];
        t.false(key in storage);
      });

      t.is(storage[key], proto);
      t.is(storage.getItem(key), null);
      // Fail in Chrome
      // var value = "value for " + Math.random().toString(32);
      // t.is((storage[key] = value), value);
      // // Property is hidden because no [LegacyOverrideBuiltIns].
      // t.is(storage[key], proto);
      // t.is(Object.getOwnPropertyDescriptor(storage, key), undefined);
      // t.is(storage.getItem(key), value);

      isInTesting = false;
    }
  );
});
