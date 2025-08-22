/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_set_value_enumerate.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

const store_list = [
  ["key0", "value0"],
  ["key1", "value1"],
  ["key2", "value2"],
];

test("enumerate a storage object with the key and get the values", () => {
  const storage = new BrowserStorage();
  storage.clear();

  store_list.forEach((item) => {
    storage.setItem(item[0], item[1]);
  });

  for (let i = 0; i < store_list.length; i++) {
    const value = storage.getItem("key" + i);
    expect(value).toBe("value" + i);
  }
});
