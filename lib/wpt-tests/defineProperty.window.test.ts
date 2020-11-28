/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/defineProperty.window.js}
 */

//#region Imports
import test from "ava";
import { BrowserStorage } from "../index";
//#endregion

[9, "x"].forEach(function (key) {
  test(`Reflect.defineProperty(…): Defining data property for key ${key}`, (t) => {
    var desc = {
      value: "value",
    };

    const storage = new BrowserStorage();
    key = key as string;

    t.is(storage[key], undefined);
    t.is(storage.getItem(key), null);
    t.is(Object.defineProperty(storage, key, desc), storage);
    t.is(storage[key], "value");
    t.is(storage.getItem(key), "value");
  });

  test(`Defining data property for key ${key} twice"`, (t) => {
    var desc1 = {
      value: "value",
    };
    var desc2 = {
      value: "new value",
    };

    var storage = new BrowserStorage();
    key = key as string;

    t.is(storage[key], undefined);
    t.is(storage.getItem(key), null);
    t.is(Object.defineProperty(storage, key, desc1), storage);
    t.is(storage[key], "value");
    t.is(storage.getItem(key), "value");

    t.is(Object.defineProperty(storage, key, desc2), storage);
    t.is(storage[key], "new value");
    t.is(storage.getItem(key), "new value");
  });

  test(`Defining data property with toString for key ${key}`, (t) => {
    var desc = {
      value: {
        toString: function () {
          return "value";
        },
      },
    };

    var storage = new BrowserStorage();
    key = key as string;

    t.is(storage[key], undefined);
    t.is(storage.getItem(key), null);
    t.is(Object.defineProperty(storage, key, desc), storage);
    t.is(storage[key], "value");
    t.is(storage.getItem(key), "value");
  });
});
