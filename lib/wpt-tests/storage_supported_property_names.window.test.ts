/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_supported_property_names.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test("Object.getOwnPropertyNames on storage Storage", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage["name"] = "user1";
  expect(Object.getOwnPropertyNames(storage)).toStrictEqual(["name"]);
});

test("Object.getOwnPropertyNames on storage storage with empty collection", () => {
  var storage = new BrowserStorage();
  storage.clear();
  expect(Object.getOwnPropertyNames(storage)).toStrictEqual([]);
});
