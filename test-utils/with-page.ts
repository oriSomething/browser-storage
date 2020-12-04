//#region Imports
import fs from "fs";
import path from "path";
import { launch, Page } from "puppeteer";
import type { ExecutionContext, ImplementationResult } from "ava";
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

/**
 * @todo Make sure microbundler run before test
 */
export default async function withPage<Context = unknown>(
  t: ExecutionContext<Context>,
  run: (t: ExecutionContext<Context>, page: Page) => ImplementationResult
): Promise<void> {
  const browser = await launch();
  const page = await browser.newPage();

  await page.setContent(EMPTY_HTML, {
    waitUntil: "load",
  });

  await page.addScriptTag({
    content: fs
      .readFileSync(path.resolve(__dirname, "../dist/index.umd.js"))
      .toString(),
  });

  try {
    await run(t, page);
  } finally {
    await page.close();
    await browser.close();
  }
}
