//#region Imports
import { launch, Page } from "puppeteer";
import type { ExecutionContext, ImplementationResult } from "ava";
//#endregion

export default async function withPage<Context = unknown>(
  t: ExecutionContext<Context>,
  run: (t: ExecutionContext<Context>, page: Page) => ImplementationResult
): Promise<void> {
  const browser = await launch();
  const page = await browser.newPage();
  try {
    await run(t, page);
  } finally {
    await page.close();
    await browser.close();
  }
}
