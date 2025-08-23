/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/symbol-props.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test("storage: plain set + get (loose)", () => {
  var key = Symbol();

  var storage = new BrowserStorage();
  storage.clear();

  storage[key as any] = "test";
  expect(storage[key as any]).toBe("test");
});

test("storage: plain set + get (strict)", () => {
  "use strict";
  var key = Symbol();

  var storage = new BrowserStorage();
  storage.clear();

  storage[key as any] = "test";
  expect(storage[key as any]).toBe("test");
});

test("storage: defineProperty + get", () => {
  var key = Symbol();

  var storage = new BrowserStorage();
  storage.clear();

  Object.defineProperty(storage, key, { value: "test" });
  expect(storage[key as any]).toBe("test");
});

test("storage: defineProperty not configurable", () => {
  var key = Symbol();

  var storage = new BrowserStorage();
  storage.clear();

  Object.defineProperty(storage, key, { value: "test", configurable: false });
  expect(storage[key as any]).toBe("test");
  var desc = Object.getOwnPropertyDescriptor(storage, key)!;
  expect(desc.configurable, "configurable").toBe(false);

  expect(delete storage[key as any]).toBe(false);
  expect(storage[key as any]).toBe("test");
});

test("storage: get with symbol on prototype", () => {
  var key = Symbol();
  class TestStorage extends BrowserStorage {}
  TestStorage.prototype[key as any] = "test";

  var storage = new TestStorage();
  storage.clear();

  expect(storage[key as any]).toBe("test");
  var desc = Object.getOwnPropertyDescriptor(storage, key);
  expect(desc).toBe(undefined);
});

test("storage: delete existing property", () => {
  var key = Symbol();

  var storage = new BrowserStorage();
  storage.clear();

  storage[key as any] = "test";
  expect(delete storage[key as any]).toBe(true);
  expect(storage[key as any]).toBe(undefined);
});

test("storage: delete non-existent property", () => {
  var key = Symbol();

  var storage = new BrowserStorage();
  storage.clear();

  expect(delete storage[key as any]).toBe(true);
  expect(storage[key as any]).toBe(undefined);
});
