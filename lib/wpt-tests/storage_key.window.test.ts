/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_key.window.js}
 */

//#region Imports
import { describe, expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

describe(".key", function () {
  var storage = new BrowserStorage();
  storage.clear();

  storage.setItem("name", "user1");
  storage.setItem("age", "20");
  storage.setItem("a", "1");
  storage.setItem("b", "2");

  var keys = ["name", "age", "a", "b"];

  function doTest(index: number) {
    test(`.key(${index}) should return the right thing.`, function () {
      var key = storage.key(index);
      expect(key).not.toBeNull();
      expect(keys.indexOf(key!) >= 0, `Unexpected key ${key} found.`).toBe(
        true,
      );
    });
  }

  for (var i = 0; i < keys.length; ++i) {
    doTest(i);
    doTest(i + 0x100000000);
  }

  test(".key() should return null for out-of-range arguments.", function () {
    expect(storage.key(-1), "storage.key(-1)").toBeNull();
    expect(storage.key(4), "storage.key(4)").toBeNull();
  });

  test(".key with value changes", function () {
    var get_keys = function (s: Storage) {
      var keys = [];
      for (var i = 0; i < s.length; ++i) {
        keys.push(s.key(i));
      }
      return keys;
    };
    var storage = new BrowserStorage();
    storage.clear();

    storage.setItem("name", "user1");
    storage.setItem("age", "20");
    storage.setItem("a", "1");
    storage.setItem("b", "2");

    var expected_keys = get_keys(storage);
    storage.setItem("name", "user2");
    expect(get_keys(storage)).toStrictEqual(expected_keys);
  });
});
