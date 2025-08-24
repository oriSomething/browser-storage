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
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/symbol-props.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../storage";
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

  const looseModeFunction = new Function(
    "storage",
    "key",
    "return (delete storage[key]);",
  );

  expect(looseModeFunction(storage, key)).toBe(false);
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
