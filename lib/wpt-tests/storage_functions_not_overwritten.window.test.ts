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
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_functions_not_overwritten.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test("should be not rendered unusable by setting a key with the same name as a storage function such that the function is hidden", () => {
  // Get the storage object based on the name passed to the describe.each block
  const storage = new BrowserStorage();
  // Clear the storage before each test
  storage.clear();

  runTest();
  function doWedgeThySelf() {
    storage.setItem("clear", "almost");
    storage.setItem("key", "too");
    storage.setItem("getItem", "funny");
    storage.setItem("removeItem", "to");
    storage.setItem("length", "be");
    storage.setItem("setItem", "true");
  }

  function runTest() {
    doWedgeThySelf();

    expect(storage.getItem("clear")).toBe("almost");
    expect(storage.getItem("key")).toBe("too");
    expect(storage.getItem("getItem")).toBe("funny");
    expect(storage.getItem("removeItem")).toBe("to");
    expect(storage.getItem("length")).toBe("be");
    expect(storage.getItem("setItem")).toBe("true");

    // Test to see if an exception is thrown for any of the built in
    // functions.
    storage.setItem("test", "123");
    storage.key(0);
    storage.getItem("test");
    storage.removeItem("test");
    storage.clear();
    expect(storage.length).toBe(0);
  }
});
