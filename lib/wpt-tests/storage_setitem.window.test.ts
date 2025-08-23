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
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_setitem.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

var test_error = { name: "test" };
var interesting_strs = [
  "\uD7FF",
  "\uD800",
  "\uDBFF",
  "\uDC00",
  "\uDFFF",
  "\uE000",
  "\uFFFD",
  "\uFFFE",
  "\uFFFF",
  "\uD83C\uDF4D",
  "\uD83Ca",
  "a\uDF4D",
  "\uDBFF\uDFFF",
];

for (var i = 0; i <= 0xff; i++) {
  interesting_strs.push(String.fromCharCode(i));
}

test("storage.setItem()", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage.setItem("name", "user1");
  expect(storage.length, "localStorage.setItem").toBe(1);
});

test("storage[]", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage["name"] = "user1";
  expect("name" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("name")).toBe("user1");
  expect(storage["name"]).toBe("user1");
});

test("storage[] update", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage["name"] = "user1";
  storage["name"] = "user2";
  expect("name" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("name")).toBe("user2");
  expect(storage["name"]).toBe("user2");
});

test("storage.setItem(_, null)", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage.setItem("age", null as any);
  expect("age" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("age")).toBe("null");
  expect(storage["age"]).toBe("null");
});

test("storage[] = null", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage["age"] = null;
  expect("age" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("age")).toBe("null");
  expect(storage["age"]).toBe("null");
});

test("storage.setItem(_, undefined)", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage.setItem("age", undefined as any);
  expect("age" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("age")).toBe("undefined");
  expect(storage["age"]).toBe("undefined");
});

test("storage[] = undefined", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage["age"] = undefined;
  expect("age" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("age")).toBe("undefined");
  expect(storage["age"]).toBe("undefined");
});

test("storage.setItem({ throws })", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage.setItem("age", "10");
  expect(function () {
    storage.setItem("age", {
      toString: function () {
        throw test_error;
      },
    } as any);
  }).toThrowError(expect.objectContaining(test_error));
  expect("age" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("age")).toBe("10");
  expect(storage["age"]).toBe("10");
});

test("storage[] = { throws }", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage.setItem("age", "10");
  expect(function () {
    storage["age"] = {
      toString: function () {
        throw test_error;
      },
    };
  }).toThrowError(expect.objectContaining(test_error));
  expect("age" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("age")).toBe("10");
  expect(storage["age"]).toBe("10");
});

test("storage.setItem(undefined, _)", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage.setItem(undefined as any, "test");
  expect("undefined" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("undefined")).toBe("test");
  expect(storage["undefined"]).toBe("test");
});

test("storage[undefined]", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage[undefined as any] = "test2";
  expect("undefined" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("undefined")).toBe("test2");
  expect(storage["undefined"]).toBe("test2");
});

test("storage.setItem(null, _)", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage.setItem(null as any, "test");
  expect("null" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("null")).toBe("test");
  expect(storage["null"]).toBe("test");
});

test("storage[null]", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage[null as any] = "test2";
  expect("null" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("null")).toBe("test2");
  expect(storage["null"]).toBe("test2");
});

test("storage key containing null", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage["foo\0bar"] = "user1";
  expect("foo\0bar" in storage).toBe(true);
  expect("foo\0" in storage).toBe(false);
  expect("foo\0baz" in storage).toBe(false);
  expect("foo" in storage).toBe(false);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("foo\0bar")).toBe("user1");
  expect(storage.getItem("foo\0")).toBe(null);
  expect(storage.getItem("foo\0baz")).toBe(null);
  expect(storage.getItem("foo")).toBe(null);
  expect(storage["foo\0bar"]).toBe("user1");
  expect(storage["foo\0"]).toBe(undefined);
  expect(storage["foo\0baz"]).toBe(undefined);
  expect(storage["foo"]).toBe(undefined);
});

test("storage value containing null", () => {
  var storage = new BrowserStorage();
  storage.clear();

  storage["name"] = "foo\0bar";
  expect("name" in storage).toBe(true);
  expect(storage.length, "storage.length").toBe(1);
  expect(storage.getItem("name")).toBe("foo\0bar");
  expect(storage["name"]).toBe("foo\0bar");
});

for (i = 0; i < interesting_strs.length; i++) {
  var str = interesting_strs[i];
  test("storage[" + str + "]", () => {
    var storage = new BrowserStorage();
    storage.clear();

    storage[str] = "user1";
    expect(str in storage).toBe(true);
    expect(storage.length, "storage.length").toBe(1);
    expect(storage.getItem(str)).toBe("user1");
    expect(storage[str]).toBe("user1");
  });

  test("storage[] = " + str, () => {
    var storage = new BrowserStorage();
    storage.clear();

    storage["name"] = str;
    expect(storage.length, "storage.length").toBe(1);
    expect(storage.getItem("name")).toBe(str);
    expect(storage["name"]).toBe(str);
  });
}
