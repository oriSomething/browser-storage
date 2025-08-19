/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_in.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test("The in operator in storage: property access", function () {
  var storage = new BrowserStorage();
  storage.clear();

  expect("name" in storage).toBe(false);
  storage["name"] = "user1";
  expect("name" in storage).toBe(true);
});

test("The in operator in storage method access", function () {
  var storage = new BrowserStorage();
  storage.clear();

  expect("name" in storage).toBe(false);
  storage.setItem("name", "user1");
  expect("name" in storage).toBe(true);
  expect(storage.name).toBe("user1");
  storage.removeItem("name");
  expect("name" in storage).toBe(false);
});
