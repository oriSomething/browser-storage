//#region Imports
import test from "ava";
import { BrowserStorage, getStoragePrivateStorageMap } from ".";
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

//#region Unit
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

/**
 * @todo When supported
 */
test.todo("Reflect.defineProperty(…)");
//#endregion
