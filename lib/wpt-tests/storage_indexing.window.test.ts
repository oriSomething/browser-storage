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
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_indexing.window.js}
 */

//#region Imports
import { describe, expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

describe("Indexed getter", function () {
  var storage = new BrowserStorage();
  storage.clear();
  storage["name"] = "user1";
  storage["age"] = "42";

  test("Getting number properties on storage", function () {
    expect(storage[-1]).toBe(undefined);
    expect(storage[0]).toBe(undefined);
    expect(storage[1]).toBe(undefined);
    expect(storage[2]).toBe(undefined);
  });

  test("Getting number-valued string properties on storage", function () {
    expect(storage["-1"]).toBe(undefined);
    expect(storage["0"]).toBe(undefined);
    expect(storage["1"]).toBe(undefined);
    expect(storage["2"]).toBe(undefined);
  });

  test("Getting existing number-valued properties on storage", function () {
    storage.setItem(1 as any, "number");
    expect(storage[1]).toBe("number");
    expect(storage["1"]).toBe("number");
  });
});
