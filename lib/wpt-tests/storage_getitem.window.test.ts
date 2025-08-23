/*!
 * # The 3-Clause BSD License
 *
 * Copyright © web-platform-tests contributors
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Based on WPT with modifications
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_getitem.window.js}
 */

//#region Imports
import { describe, expect, test } from "vitest";
import { BrowserStorage } from "../storage";
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
