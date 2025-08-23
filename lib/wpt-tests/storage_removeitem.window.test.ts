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
 * @see {@link https://github.com/web-platform-tests/wpt/blob/master/webstorage/storage_removeitem.window.js}
 */

//#region Imports
import { expect, test } from "vitest";
import { BrowserStorage } from "../index";
//#endregion

test("storage.removeItem()", () => {
  const storage = new BrowserStorage();
  storage.clear();

  storage.setItem("name", "user1");
  expect(storage.getItem("name")).toBe("user1");

  storage.removeItem("name");
  storage.removeItem("unknown");
  expect(storage.getItem("name"), "storage.getItem('name')").toBe(null);
});

test("delete storage[]", () => {
  const storage = new BrowserStorage();
  storage.clear();

  storage.setItem("name", "user1");
  expect(storage.getItem("name")).toBe("user1");
  delete storage["name"];
  delete storage["unknown"];
  expect(storage.getItem("name"), "storage.getItem('name')").toBe(null);
});

test("storage.removeItem(null)", () => {
  const storage = new BrowserStorage();
  storage.clear();

  storage.setItem("null", "test");
  expect("null" in storage).toBe(true);
  storage.removeItem(null as any);
  expect("null" in storage).toBe(false);
});

test("storage.removeItem(undefined)", () => {
  const storage = new BrowserStorage();
  storage.clear();

  storage.setItem("undefined", "test");
  expect("undefined" in storage).toBe(true);
  storage.removeItem(undefined as any);
  expect("undefined" in storage).toBe(false);
});
