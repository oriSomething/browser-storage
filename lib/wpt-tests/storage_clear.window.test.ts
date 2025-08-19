/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_clear.window.test}
 */

import { expect, test } from "vitest";
import { BrowserStorage } from "../index";

test("Clear in", function () {
  const storage = new BrowserStorage();
  storage.clear();

  storage.setItem("name", "user1");
  expect(storage.getItem("name"), "user1").toBe("user1");
  expect(storage.name, "user1").toBe("user1");
  expect(storage.length).toBe(1);

  storage.clear();
  expect(storage.getItem("name"), "storage.getItem('name')").toBeNull();
  expect(storage.name, "storage.name").toBeUndefined();
  expect(storage.length, "storage.length").toBe(0);
});
