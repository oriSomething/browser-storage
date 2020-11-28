//#region Imports
import test from "ava";
import {
  subscribeClear,
  subscribePropertyChange,
  BrowserStorage,
  getStoragePrivateStorageMap,
  setWithEmitStorage,
  removeWithEmitStorage,
} from "./index";
import withPage from "../test-utils/with-page";

/**
 * Used for tests with puppeteer
 */
declare var browserStorage: typeof import("./index");
//#endregion

//#region Integration
test("getItem -> setItem -> getItem", (t) => {
  const s = new BrowserStorage();
  const key = Math.random().toString(32);
  const value = Math.random().toString(32);

  t.is(s.getItem(key), null, "returns null when key doesn't exist");
  t.is(s[key], undefined, "property is undefined when key doesn't exist");

  s.setItem(key, value);

  t.is(s.getItem(key), value, "returns expected value");
  t.is(s[key], value, "property is expected value");
});
//#endregion

//#region Unit - Storage API
test("getItem()", (t) => {
  const s = new BrowserStorage();
  getStoragePrivateStorageMap(s)
    //
    .set("a", "value - a")
    .set("b", "value - b");

  t.is(s.getItem("a"), "value - a");
  t.is(s.getItem("b"), "value - b");
  t.is(s.getItem("c"), null, "`null` for none exist item");
});

test("Reflect.get(…)", (t) => {
  const s = new BrowserStorage();
  getStoragePrivateStorageMap(s)
    //
    .set("a", "value - a")
    .set("b", "value - b");

  t.is(s["a"], "value - a");
  t.is(s["b"], "value - b");
  t.is(s["c"], undefined, "`undefined` for none exist item");
});

test("setItem()", (t) => {
  const s = new BrowserStorage();
  const key = Math.random().toString(32);
  const value = Math.random().toString(32);

  s.setItem(key, value);
  t.is(getStoragePrivateStorageMap(s).get(key), value);
});

test("setItem(): convert non-string to string as browser does", (t) => {
  function test(before: any, after: string) {
    const s = new BrowserStorage();
    const key = Math.random().toString(32);
    s.setItem(key, before);
    t.is(getStoragePrivateStorageMap(s).get(key), after);
  }

  test({}, "[object Object]");
  test({ x: 1 }, "[object Object]");
  test(new (class X {})(), "[object Object]");
  test(1, "1");
  test(777n, "777");
  test(null, "null");
  test(undefined, "undefined");
});

test("setItem(): convert Date to string as browser does", (t) => {
  const s = new BrowserStorage();
  const key = Math.random().toString(32);
  s.setItem(key, new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0)) as any);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  t.regex(getStoragePrivateStorageMap(s).get(key)!, /^Sat Jan 01 2000 /);
});

test("Reflect.set(…): non prototype", (t) => {
  function test(before: any, after: string) {
    const s = new BrowserStorage();
    const key = Math.random().toString(32);
    s[key] = before;
    t.is(getStoragePrivateStorageMap(s).get(key), after);
  }

  test("a", "a");
  test("abc", "abc");
  test(null, "null");
  test(undefined, "undefined");
});

test("Reflect.set(…): prototype", (t) => {
  const s = new BrowserStorage();
  const value = () => {};
  s.setItem = value;

  t.false(getStoragePrivateStorageMap(s).has("setItem"));
  t.is(s.setItem, value);
});

test("length", (t) => {
  const s = new BrowserStorage();

  t.is(s.length, 0);
  s.setItem("a", "1");
  t.is(s.length, 1);
  s.setItem("a", "2");
  t.is(s.length, 1);
  s.setItem("b", "2");
  t.is(s.length, 2);
  s.removeItem("a");
  t.is(s.length, 1);
});

test("key()", (t) => {
  const s = new BrowserStorage();
  const inner = getStoragePrivateStorageMap(s);

  const keys = ["a", "b", "c"];

  for (let key of keys) inner.set(key, "zzz");

  for (let [index, key] of keys.entries()) {
    t.is(s.key(index), key);
  }

  t.is(s.key(777), null, "returns null for out of bounds key");
});

test("Reflect.ownKeys(…)", (t) => {
  const s = new BrowserStorage();

  t.deepEqual(Reflect.ownKeys(s), []);

  s.setItem("a", "aaa");
  t.deepEqual(Reflect.ownKeys(s), ["a"]);

  s.zzz = "bbb";
  t.deepEqual(Reflect.ownKeys(s), ["a", "zzz"]);

  s.setItem = () => {};
  t.deepEqual(Reflect.ownKeys(s), ["setItem", "a", "zzz"]);
});

test("Object.keys(…)", (t) => {
  const s = new BrowserStorage();
  s.setItem("a", "aaa");
  s.zzz = "bbb";

  t.deepEqual(Object.keys(s), ["a", "zzz"]);
});

test("clear()", (t) => {
  const s = new BrowserStorage();
  const inner = getStoragePrivateStorageMap(s);

  inner.set("a", "1");
  inner.set("b", "2");
  inner.set("c", "3");

  t.is(inner.size, 3);
  inner.clear();
  t.is(inner.size, 0);
});

test("removeItem()", (t) => {
  const s = new BrowserStorage();
  const inner = getStoragePrivateStorageMap(s);

  t.false(inner.has("FFF"));
  inner.set("FFF", "GGG");
  t.true(inner.has("FFF"));
  s.removeItem("FFF");
  t.false(inner.has("FFF"));
});

test("Reflect.deleteProperty(…)", (t) => {
  const s = new BrowserStorage();
  const inner = getStoragePrivateStorageMap(s);

  t.false(inner.has("FFF"));
  inner.set("FFF", "GGG");
  t.true(inner.has("FFF"));

  t.is(delete s.FFF, true);
  t.is(delete s.FFF, true);
  t.is(delete s.ZZZ, true);
});

test("JSON.stringify()", (t) => {
  const s = new BrowserStorage();
  getStoragePrivateStorageMap(s)
    //
    .set("a", "1")
    .set("b", "2")
    .set("c", "3");

  t.is(JSON.stringify(s), `{"a":"1","b":"2","c":"3"}`);
});
//#endregion

//#region Unit - Hooks
test("subscribePropertyChange(): setItem", (t) => {
  t.plan(4);

  const s = new BrowserStorage();

  let counter = 0;

  const off = subscribePropertyChange(s, (key, value) => {
    t.is(key, "zzz");
    t.is(value, String(counter));
  });

  s.setItem("zzz", String(++counter));
  s.setItem("zzz", String(++counter));
  off();

  s.setItem("zzz", String(++counter));
});

test("subscribePropertyChange(): removeItem", (t) => {
  t.plan(2);

  const s = new BrowserStorage();

  s.setItem("zzz", "1");

  const off = subscribePropertyChange(s, (key, value) => {
    t.is(key, "zzz");
    t.is(value, null);
  });

  s.removeItem("zzz");
  off();
  s.removeItem("zzz");
});

test("subscribeClear()", (t) => {
  t.plan(1);

  const s = new BrowserStorage();

  const off = subscribeClear(s, () => {
    t.pass();
  });

  s.clear();
  off();
  s.clear();
});
//#endregion

//#region E2E tests
test("Emulating storage event for setItem", withPage, async (t, page) => {
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

  t.deepEqual(result, {
    type: "storage",
    is_storageArea: true,
    key: "abc",
    oldValue: null,
    newValue: "zzz",
  });
});

test("Emulating storage event for removeItem", withPage, async (t, page) => {
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

  t.deepEqual(result, {
    type: "storage",
    is_storageArea: true,
    key: "abc",
    oldValue: "zzz",
    newValue: null,
  });
});

test.todo("Emulating storage event, won't happens if value didn't change");

test("Emulating is noop in non-Browser context context", (t) => {
  const s = new BrowserStorage();

  setWithEmitStorage(s, "abc", "zzz");
  removeWithEmitStorage(s, "abc");

  t.pass();
});
//#endregion
