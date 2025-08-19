/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_getitem.window.js}
 */

//#region Imports
import { describe, expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

describe("Get value by getItem(key) and named access", () => {
  const storage = new BrowserStorage();
  storage.clear();
  storage.setItem("name", "x");
  storage.setItem("undefined", "foo");
  storage.setItem("null", "bar");
  storage.setItem("", "baz");

  test("All items should be added", () => {
    expect(storage.length).toBe(4);
  });

  test("Named access to storage should be correct", () => {
    expect(storage["unknown"], "storage['unknown']").toBe(undefined);
    expect(storage["name"], "storage['name']").toBe("x");
    expect(storage["undefined"], "storage['undefined']").toBe("foo");
    expect(storage["null"], "storage['null']").toBe("bar");
    expect(storage[undefined as any], "storage[undefined]").toBe("foo");
    expect(storage[null as any], "storage[null]").toBe("bar");
    expect(storage[""], "storage['']").toBe("baz");
  });

  test("storage.getItem should be correct", () => {
    expect(storage.getItem("unknown"), "storage.getItem('unknown')").toBe(null);
    expect(storage.getItem("name"), "storage.getItem('name')").toBe("x");
    expect(storage.getItem("undefined"), "storage.getItem('undefined')").toBe(
      "foo",
    );
    expect(storage.getItem("null"), "storage.getItem('null')").toBe("bar");
    expect(
      storage.getItem(undefined as any),
      "storage.getItem(undefined)",
    ).toBe("foo");
    expect(storage.getItem(null as any), "storage.getItem(null)").toBe("bar");
    expect(storage.getItem(""), "storage.getItem('')").toBe("baz");
  });
});
