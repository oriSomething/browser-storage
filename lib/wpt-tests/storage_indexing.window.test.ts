/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_indexing.window.js}
 */

//#region Imports
import { describe, expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

describe("Indexed getter", function () {
  var storage = new BrowserStorage();
  storage.clear();
  storage["name"] = "user1";
  storage["age"] = "42";

  test("Getting number properties on storage", function () {
    expect(storage[-1]).toBe(undefined);
    expect(storage[0]).toBe(undefined);
    expect(storage[1]).toBe(undefined);
    expect(storage[2]).toBe(undefined);
  });

  test("Getting number-valued string properties on storage", function () {
    expect(storage["-1"]).toBe(undefined);
    expect(storage["0"]).toBe(undefined);
    expect(storage["1"]).toBe(undefined);
    expect(storage["2"]).toBe(undefined);
  });

  test("Getting existing number-valued properties on storage", function () {
    storage.setItem(1 as any, "number");
    expect(storage[1]).toBe("number");
    expect(storage["1"]).toBe("number");
  });
});
