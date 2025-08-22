/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_string_conversion.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test("storage only stores strings", () => {
  var storage = new BrowserStorage();
  storage.clear();

  expect(storage.length).toBe(0);

  storage.a = null;
  expect(storage.a).toBe("null");
  storage.b = 0;
  expect(storage.b).toBe("0");
  storage.c = function () {};
  expect(storage.c).toStrictEqual(
    expect.stringMatching(/^function\(\)\s*\{\s*}$/m),
  );

  storage.setItem("d", null as any);
  expect(storage.d).toBe("null");
  storage.setItem("e", 0 as any);
  expect(storage.e).toBe("0");
  storage.setItem("f", function () {} as any);
  expect(storage.f).toStrictEqual(
    expect.stringMatching(/^function\(\)\s*\{\s*}$/m),
  );
  storage["g"] = null;
  expect(storage.g).toBe("null");
  storage["h"] = 0;
  expect(storage.h).toBe("0");
  storage["i"] = function () {};
  expect(storage.f).toStrictEqual(
    expect.stringMatching(/^function\(\)\s*\{\s*}$/m),
  );
});
