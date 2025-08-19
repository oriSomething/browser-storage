/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_functions_not_overwritten.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test("should be not rendered unusable by setting a key with the same name as a storage function such that the function is hidden", () => {
  // Get the storage object based on the name passed to the describe.each block
  const storage = new BrowserStorage();
  // Clear the storage before each test
  storage.clear();

  runTest();
  function doWedgeThySelf() {
    storage.setItem("clear", "almost");
    storage.setItem("key", "too");
    storage.setItem("getItem", "funny");
    storage.setItem("removeItem", "to");
    storage.setItem("length", "be");
    storage.setItem("setItem", "true");
  }

  function runTest() {
    doWedgeThySelf();

    expect(storage.getItem("clear")).toBe("almost");
    expect(storage.getItem("key")).toBe("too");
    expect(storage.getItem("getItem")).toBe("funny");
    expect(storage.getItem("removeItem")).toBe("to");
    expect(storage.getItem("length")).toBe("be");
    expect(storage.getItem("setItem")).toBe("true");

    // Test to see if an exception is thrown for any of the built in
    // functions.
    storage.setItem("test", "123");
    storage.key(0);
    storage.getItem("test");
    storage.removeItem("test");
    storage.clear();
    expect(storage.length).toBe(0);
  }
});
