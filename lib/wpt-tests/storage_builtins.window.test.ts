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
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_builtins.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../storage";
//#endregion

test("Builtins in", function () {
  class TestedStorage extends BrowserStorage {}
  var storage = new TestedStorage();
  storage.clear();
  expect(storage.length, "storage.length").toBe(0);

  var builtins = ["key", "getItem", "setItem", "removeItem", "clear"];
  var origBuiltins = builtins.map(function (b) {
    return TestedStorage.prototype[b];
  });
  expect(
    builtins.map(function (b) {
      return storage[b];
    }),
    "a",
  ).toStrictEqual(origBuiltins);
  builtins.forEach(function (b) {
    storage[b] = b;
  });
  expect(
    builtins.map(function (b) {
      return storage[b];
    }, "b"),
  ).toStrictEqual(origBuiltins);
  expect(
    builtins.map(function (b) {
      return storage.getItem(b);
    }, "c"),
  ).toStrictEqual(builtins);

  expect(storage.length, "storage.length").toBe(builtins.length);
});
