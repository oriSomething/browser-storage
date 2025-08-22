/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_key_empty_string.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test(".key with empty string", function () {
  var storage = new BrowserStorage();
  storage.clear();

  storage.setItem("", "empty string");
  debugger;
  expect(storage.getItem("")).toBe("empty string");
});
