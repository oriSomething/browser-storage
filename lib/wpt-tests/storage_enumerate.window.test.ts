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
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_enumerate.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test("enumerate a Storage object and get only the keys as a result and the built-in properties of the Storage object should be ignored", function () {
  class TestedStorage extends BrowserStorage {}

  var storage = new TestedStorage();
  storage.clear();

  TestedStorage.prototype.prototypeTestKey = "prototypeTestValue";
  storage.foo = "bar";
  storage.fu = "baz";
  storage.batman = "bin suparman";
  storage.bar = "foo";
  storage.alpha = "beta";
  storage.zeta = "gamma";

  const enumeratedArray = Object.keys(storage);
  enumeratedArray.sort(); // Storage order is implementation-defined.

  const expectArray = ["alpha", "bar", "batman", "foo", "fu", "zeta"];
  expect(enumeratedArray).toEqual(expectArray);

  // 'prototypeTestKey' is not an actual storage key, it is just a
  // property set on Storage's prototype object.
  expect(storage.length).toBe(6);
  expect(storage.getItem("prototypeTestKey")).toBeNull();
  expect(storage.prototypeTestKey).toBe("prototypeTestValue");
});

test("test enumeration of numeric and non-numeric keys", function () {
  var storage = new BrowserStorage();
  storage.clear();

  storage.setItem("foo", "bar");
  storage.baz = "quux";
  storage.setItem(0 as any, "alpha");
  storage[42] = "beta";

  for (let prop in storage) {
    if (!storage.hasOwnProperty(prop)) continue;
    const desc = Object.getOwnPropertyDescriptor(storage, prop);
    expect(desc!.configurable).toBe(true);
    expect(desc!.enumerable).toBe(true);
    expect(desc!.writable).toBe(true);
  }

  const keys = Object.keys(storage);
  keys.sort(); // Storage order is implementation-defined.
  expect(keys).toStrictEqual(["0", "42", "baz", "foo"]);

  const values = Object.values(storage);
  values.sort(); // Storage order is implementation-defined.
  expect(values).toStrictEqual(["alpha", "bar", "beta", "quux"]);
});
