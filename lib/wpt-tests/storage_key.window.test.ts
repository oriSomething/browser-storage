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
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_key.window.js}
 */

//#region Imports
import { describe, expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

describe(".key", function () {
  var storage = new BrowserStorage();
  storage.clear();

  storage.setItem("name", "user1");
  storage.setItem("age", "20");
  storage.setItem("a", "1");
  storage.setItem("b", "2");

  var keys = ["name", "age", "a", "b"];

  function doTest(index: number) {
    test(`.key(${index}) should return the right thing.`, function () {
      var key = storage.key(index);
      expect(key).not.toBeNull();
      expect(keys.indexOf(key!) >= 0, `Unexpected key ${key} found.`).toBe(
        true,
      );
    });
  }

  for (var i = 0; i < keys.length; ++i) {
    doTest(i);
    doTest(i + 0x100000000);
  }

  test(".key() should return null for out-of-range arguments.", function () {
    expect(storage.key(-1), "storage.key(-1)").toBeNull();
    expect(storage.key(4), "storage.key(4)").toBeNull();
  });

  test(".key with value changes", function () {
    var get_keys = function (s: Storage) {
      var keys = [];
      for (var i = 0; i < s.length; ++i) {
        keys.push(s.key(i));
      }
      return keys;
    };
    var storage = new BrowserStorage();
    storage.clear();

    storage.setItem("name", "user1");
    storage.setItem("age", "20");
    storage.setItem("a", "1");
    storage.setItem("b", "2");

    var expected_keys = get_keys(storage);
    storage.setItem("name", "user2");
    expect(get_keys(storage)).toStrictEqual(expected_keys);
  });
});
