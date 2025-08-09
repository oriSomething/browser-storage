/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/defineProperty.window.js}
 */

//#region Imports
import { describe, expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

describe.sequential.each([9, "x"])("%j", function (key) {
  test(`Reflect.defineProperty(…): Defining data property for key ${key}`, () => {
    var desc = {
      value: "value",
    };

    const storage = new BrowserStorage();
    key = key as string;

    expect(storage[key]).toBe(undefined);
    expect(storage.getItem(key as string)).toBe(null);
    expect(Object.defineProperty(storage, key, desc)).toBe(storage);
    expect(storage[key]).toBe("value");
    expect(storage.getItem(key as string)).toBe("value");
  });

  test(`Defining data property for key ${key} twice"`, () => {
    var desc1 = {
      value: "value",
    };
    var desc2 = {
      value: "new value",
    };

    var storage = new BrowserStorage();
    key = key as string;

    expect(storage[key]).toBe(undefined);
    expect(storage.getItem(key as string)).toBe(null);
    expect(Object.defineProperty(storage, key, desc1)).toBe(storage);
    expect(storage[key]).toBe("value");
    expect(storage.getItem(key as string)).toBe("value");

    expect(Object.defineProperty(storage, key, desc2)).toBe(storage);
    expect(storage[key]).toBe("new value");
    expect(storage.getItem(key as string)).toBe("new value");
  });

  test(`Defining data property with toString for key ${key}`, () => {
    var desc = {
      value: {
        toString: function () {
          return "value";
        },
      },
    };

    var storage = new BrowserStorage();
    key = key as string;

    expect(storage[key]).toBe(undefined);
    expect(storage.getItem(key as string)).toBe(null);
    expect(Object.defineProperty(storage, key, desc)).toBe(storage);
    expect(storage[key]).toBe("value");
    expect(storage.getItem(key as string)).toBe("value");
  });
});
