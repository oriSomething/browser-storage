//#region Imports
import { test, expect } from "vitest";
import {
  subscribeClear,
  subscribePropertyChange,
  BrowserStorage,
  getStoragePrivateStorageMap,
  setWithEmitStorage,
  removeWithEmitStorage,
} from "./index";
import { withPage } from "../test-utils/with-page";

/**
 * Used for tests with puppeteer
 */
declare var browserStorage: typeof import("./index");
//#endregion

//#region Integration
test("getItem -> setItem -> getItem", () => {
  const s = new BrowserStorage();
  const key = Math.random().toString(32);
  const value = Math.random().toString(32);

  expect(s.getItem(key), "returns null when key doesn't exist").toBe(null);
  expect(s[key], "property is undefined when key doesn't exist").toBe(
    undefined,
  );

  s.setItem(key, value);

  expect(s.getItem(key), "returns expected value").toBe(value);
  expect(s[key], "property is expected value").toBe(value);
});
//#endregion

//#region Unit - Storage API
test("getItem()", () => {
  const s = new BrowserStorage();
  getStoragePrivateStorageMap(s)
    //
    .set("a", "value - a")
    .set("b", "value - b");

  expect(s.getItem("a")).toBe("value - a");
  expect(s.getItem("b")).toBe("value - b");
  expect(s.getItem("c"), "`null` for none exist item").toBe(null);
});

test("Reflect.get(…)", () => {
  const s = new BrowserStorage();
  getStoragePrivateStorageMap(s)
    //
    .set("a", "value - a")
    .set("b", "value - b");

  expect(s["a"]).toBe("value - a");
  expect(s["b"]).toBe("value - b");
  expect(s["c"], "`undefined` for none exist item").toBeUndefined();
});

test("setItem()", () => {
  const s = new BrowserStorage();
  const key = Math.random().toString(32);
  const value = Math.random().toString(32);

  s.setItem(key, value);
  expect(getStoragePrivateStorageMap(s).get(key)).toBe(value);
});

test("setItem(): convert non-string to string as browser does", () => {
  function assert(before: any, after: string) {
    const s = new BrowserStorage();
    const key = Math.random().toString(32);
    s.setItem(key, before);
    expect(getStoragePrivateStorageMap(s).get(key)).toBe(after);
  }

  expect.assertions(7);
  assert({}, "[object Object]");
  assert({ x: 1 }, "[object Object]");
  assert(new (class X {})(), "[object Object]");
  assert(1, "1");
  assert(777n, "777");
  assert(null, "null");
  assert(undefined, "undefined");
});

test("setItem(): convert Date to string as browser does", () => {
  const s = new BrowserStorage();
  const key = Math.random().toString(32);
  s.setItem(key, new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)) as any);
  expect(getStoragePrivateStorageMap(s).get(key)).toMatch(/^Sat Jan 01 2000 /);
});

test("Reflect.set(…): non prototype", () => {
  function assert(before: any, after: string) {
    const s = new BrowserStorage();
    const key = Math.random().toString(32);
    s[key] = before;
    expect(getStoragePrivateStorageMap(s).get(key)).toBe(after);
  }

  expect.assertions(4);
  assert("a", "a");
  assert("abc", "abc");
  assert(null, "null");
  assert(undefined, "undefined");
});

test("Reflect.set(…): prototype", () => {
  const s = new BrowserStorage();
  const value = () => {};
  s.setItem = value;
  expect(s.setItem).toBe(BrowserStorage.prototype.setItem);
});

test("length", () => {
  const s = new BrowserStorage();

  expect(s.length).toBe(0);
  s.setItem("a", "1");
  expect(s.length).toBe(1);
  s.setItem("a", "2");
  expect(s.length).toBe(1);
  s.setItem("b", "2");
  expect(s.length).toBe(2);
  s.removeItem("a");
  expect(s.length).toBe(1);
});

test("key()", () => {
  const s = new BrowserStorage();
  const inner = getStoragePrivateStorageMap(s);

  const keys = ["a", "b", "c"];

  for (let key of keys) inner.set(key, "zzz");

  for (let [index, key] of keys.entries()) {
    expect(s.key(index)).toBe(key);
  }

  expect(s.key(777), "returns null for out of bounds key").toBeNull();
});

test("Reflect.ownKeys(…)", () => {
  const s = new BrowserStorage();

  expect(Reflect.ownKeys(s)).toStrictEqual([]);

  s.setItem("a", "aaa");
  expect(Reflect.ownKeys(s)).toStrictEqual(["a"]);

  s.zzz = "bbb";
  expect(Reflect.ownKeys(s)).toStrictEqual(["a", "zzz"]);

  s.setItem = () => {};
  expect(Reflect.ownKeys(s)).toStrictEqual(["a", "zzz"]);
});

test("Object.keys(…)", () => {
  const s = new BrowserStorage();
  s.setItem("a", "aaa");
  s.zzz = "bbb";

  expect(Object.keys(s)).toStrictEqual(["a", "zzz"]);
});

test("clear()", () => {
  const s = new BrowserStorage();
  const inner = getStoragePrivateStorageMap(s);

  inner.set("a", "1");
  inner.set("b", "2");
  inner.set("c", "3");

  expect(inner.size).toBe(3);
  inner.clear();
  expect(inner.size).toBe(0);
});

test("removeItem()", () => {
  const s = new BrowserStorage();
  const inner = getStoragePrivateStorageMap(s);

  expect(inner.has("FFF")).toBe(false);
  inner.set("FFF", "GGG");
  expect(inner.has("FFF")).toBe(true);
  s.removeItem("FFF");
  expect(inner.has("FFF")).toBe(false);
});

test("Reflect.deleteProperty(…)", () => {
  const s = new BrowserStorage();
  const inner = getStoragePrivateStorageMap(s);

  expect(inner.has("FFF")).toBe(false);
  inner.set("FFF", "GGG");
  expect(inner.has("FFF")).toBe(true);

  expect(delete s.FFF).toBe(true);
  expect(delete s.FFF).toBe(true);
  expect(delete s.ZZZ).toBe(true);
});

test("JSON.stringify()", () => {
  const s = new BrowserStorage();
  getStoragePrivateStorageMap(s)
    //
    .set("a", "1")
    .set("b", "2")
    .set("c", "3");

  expect(JSON.stringify(s)).toBe(`{"a":"1","b":"2","c":"3"}`);
});
//#endregion

//#region Unit - Hooks
test("subscribePropertyChange(): setItem", () => {
  expect.assertions(4);

  const s = new BrowserStorage();

  let counter = 0;

  const off = subscribePropertyChange(s, (key, value) => {
    expect(key).toBe("zzz");
    expect(value).toBe(String(counter));
  });

  s.setItem("zzz", String(++counter));
  s.setItem("zzz", String(++counter));
  off();

  s.setItem("zzz", String(++counter));
});

test("subscribePropertyChange(): removeItem", () => {
  expect.assertions(2);

  const s = new BrowserStorage();

  s.setItem("zzz", "1");

  const off = subscribePropertyChange(s, (key, value) => {
    expect(key).toBe("zzz");
    expect(value).toBe(null);
  });

  s.removeItem("zzz");
  off();
  s.removeItem("zzz");
});

test("subscribeClear()", async () => {
  expect.assertions(0);

  const s = new BrowserStorage();

  const { promise, resolve } = Promise.withResolvers<void>();

  const off = subscribeClear(s, () => {
    resolve();
  });

  s.clear();
  off();
  s.clear();

  await promise;
});
//#endregion

//#region E2E tests
test("Emulating storage event for setItem", async function () {
  await using page = await withPage();

  const result = await page.evaluate(() => {
    const s = new browserStorage.BrowserStorage();

    var returnValue: any;

    window.addEventListener("storage", (event) => {
      returnValue = {
        type: "storage",
        is_storageArea: event.storageArea === s,
        key: event.key,
        newValue: event.newValue,
        oldValue: event.oldValue,
      };
    });

    browserStorage.setWithEmitStorage(s, "abc", "zzz");

    return returnValue;
  });

  expect(result).toStrictEqual({
    type: "storage",
    is_storageArea: true,
    key: "abc",
    oldValue: null,
    newValue: "zzz",
  });
});

test("Emulating storage event for removeItem", async function () {
  await using page = await withPage();

  const result = await page.evaluate(() => {
    const s = new browserStorage.BrowserStorage();

    var returnValue: any;

    window.addEventListener("storage", (event) => {
      returnValue = {
        type: "storage",
        is_storageArea: event.storageArea === s,
        key: event.key,
        newValue: event.newValue,
        oldValue: event.oldValue,
      };
    });

    s.setItem("abc", "zzz");
    browserStorage.removeWithEmitStorage(s, "abc");

    return returnValue;
  });

  expect(result).toStrictEqual({
    type: "storage",
    is_storageArea: true,
    key: "abc",
    oldValue: "zzz",
    newValue: null,
  });
});

test.todo("Emulating storage event, won't happens if value didn't change");

test("Emulating is noop in non-Browser context context", () => {
  expect.assertions(0);

  const s = new BrowserStorage();

  setWithEmitStorage(s, "abc", "zzz");
  removeWithEmitStorage(s, "abc");
});
// //#endregion
