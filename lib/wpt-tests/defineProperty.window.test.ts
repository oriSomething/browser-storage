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
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/defineProperty.window.js}
 */

//#region Imports
import { describe, expect, test } from "vitest";
import { BrowserStorage } from "../storage";
//#endregion

describe.sequential.each([9, "x"])("%j", function (key) {
  test(`Reflect.defineProperty(…): Defining data property for key ${key}`, () => {
    var desc = {
      value: "value",
    };

    const storage = new BrowserStorage();
    key = key as string;

    expect(storage[key]).toBe(undefined);
    expect(storage.getItem(key as string)).toBe(null);
    expect(Object.defineProperty(storage, key, desc)).toBe(storage);
    expect(storage[key]).toBe("value");
    expect(storage.getItem(key as string)).toBe("value");
  });

  test(`Defining data property for key ${key} twice"`, () => {
    var desc1 = {
      value: "value",
    };
    var desc2 = {
      value: "new value",
    };

    var storage = new BrowserStorage();
    key = key as string;

    expect(storage[key]).toBe(undefined);
    expect(storage.getItem(key as string)).toBe(null);
    expect(Object.defineProperty(storage, key, desc1)).toBe(storage);
    expect(storage[key]).toBe("value");
    expect(storage.getItem(key as string)).toBe("value");

    expect(Object.defineProperty(storage, key, desc2)).toBe(storage);
    expect(storage[key]).toBe("new value");
    expect(storage.getItem(key as string)).toBe("new value");
  });

  test(`Defining data property with toString for key ${key}`, () => {
    var desc = {
      value: {
        toString: function () {
          return "value";
        },
      },
    };

    var storage = new BrowserStorage();
    key = key as string;

    expect(storage[key]).toBe(undefined);
    expect(storage.getItem(key as string)).toBe(null);
    expect(Object.defineProperty(storage, key, desc)).toBe(storage);
    expect(storage[key]).toBe("value");
    expect(storage.getItem(key as string)).toBe("value");
  });
});
