/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_builtins.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test("Builtins in", function () {
  class TestedStorage extends BrowserStorage {}
  var storage = new TestedStorage();
  storage.clear();
  expect(storage.length, "storage.length").toBe(0);

  var builtins = ["key", "getItem", "setItem", "removeItem", "clear"];
  var origBuiltins = builtins.map(function (b) {
    return TestedStorage.prototype[b];
  });
  expect(
    builtins.map(function (b) {
      return storage[b];
    }),
    "a",
  ).toStrictEqual(origBuiltins);
  builtins.forEach(function (b) {
    storage[b] = b;
  });
  expect(
    builtins.map(function (b) {
      return storage[b];
    }, "b"),
  ).toStrictEqual(origBuiltins);
  expect(
    builtins.map(function (b) {
      return storage.getItem(b);
    }, "c"),
  ).toStrictEqual(builtins);

  expect(storage.length, "storage.length").toBe(builtins.length);
});
