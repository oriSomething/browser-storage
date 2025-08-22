/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_length.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test("storage.length (method access)", () => {
  const storage = new BrowserStorage();
  storage.clear();
  expect(storage.length, "storage.length").toBe(0);

  storage["name"] = "user1";
  storage["age"] = "20";

  expect(storage.length, "storage.length").toBe(2);
});

test("storage.length (property access)", () => {
  const storage = new BrowserStorage();
  storage.clear();
  expect(storage.length, "storage.length").toBe(0);

  storage.setItem("name", "user1");
  storage.setItem("age", "20");

  expect(storage.length, "storage.length").toBe(2);
});
