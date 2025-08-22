/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_removeitem.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test("storage.removeItem()", () => {
  const storage = new BrowserStorage();
  storage.clear();

  storage.setItem("name", "user1");
  expect(storage.getItem("name")).toBe("user1");

  storage.removeItem("name");
  storage.removeItem("unknown");
  expect(storage.getItem("name"), "storage.getItem('name')").toBe(null);
});

test("delete storage[]", () => {
  const storage = new BrowserStorage();
  storage.clear();

  storage.setItem("name", "user1");
  expect(storage.getItem("name")).toBe("user1");
  delete storage["name"];
  delete storage["unknown"];
  expect(storage.getItem("name"), "storage.getItem('name')").toBe(null);
});

test("storage.removeItem(null)", () => {
  const storage = new BrowserStorage();
  storage.clear();

  storage.setItem("null", "test");
  expect("null" in storage).toBe(true);
  storage.removeItem(null as any);
  expect("null" in storage).toBe(false);
});

test("storage.removeItem(undefined)", () => {
  const storage = new BrowserStorage();
  storage.clear();

  storage.setItem("undefined", "test");
  expect("undefined" in storage).toBe(true);
  storage.removeItem(undefined as any);
  expect("undefined" in storage).toBe(false);
});
