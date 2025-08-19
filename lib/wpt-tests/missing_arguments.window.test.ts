/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/missing_arguments.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test.each<(storage: Storage) => unknown>([
  // @ts-expect-error Missing argument for test
  (storage) => storage.key(),
  // @ts-expect-error Missing argument for test
  (storage) => storage.getItem(),
  // @ts-expect-error Missing argument for test
  (storage) => storage.setItem(),
  // @ts-expect-error Missing argument for test
  (storage) => storage.setItem("a"),
  // @ts-expect-error Missing argument for test
  (storage) => storage.removeItem(),
])("Should throw TypeError for %s", function (fn) {
  expect(() => fn(new BrowserStorage())).toThrowError();
});
