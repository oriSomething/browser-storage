//#region Imports
import path from "node:path";
import { firefox } from "playwright";
import { rolldown } from "rolldown";
//#endregion

const EMPTY_HTML = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body></body>
  </html>`;

export async function withPage() {
  const browser = await firefox.launch({
    headless: true,
  });

  const page = await browser.newPage();

  await page.setContent(EMPTY_HTML, {
    waitUntil: "load",
  });

  const build = await rolldown({
    input: path.resolve(import.meta.dirname, "..", "lib", "index.ts"),
  });

  const { output } = await build.generate({
    format: "umd",
    name: "browserStorage",
    externalLiveBindings: false,
  });

  await page.addScriptTag({
    content: output[0].code,
  });

  return Object.assign(page, {
    [Symbol.asyncDispose]: async () => {
      await page.close();
      await browser.close();
    },
  });
}
