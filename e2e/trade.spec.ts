import { test, expect } from "@playwright/test";
import { resetDatabase, createUser, loginUser, addPortfolio } from "./helpers";
import { Page } from "@playwright/test";

async function openFirstStock(page: Page) {
  await page.goto("/dashboard/stocks");
  const firstStockLink = page.locator("a[href*='/dashboard/stocks/']").first();
  await expect(firstStockLink).toBeVisible();
  await firstStockLink.click();
  await expect(page.getByRole("button", { name: "Buy Stock" })).toBeVisible();
}

async function choosePortfolio(page: Page, portfolioName: string) {
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: new RegExp(portfolioName, "i") }).click();
}

test.beforeEach(async () => {
  await resetDatabase();
});

test.describe("Trading", () => {
  test("user can buy and sell a stock from a portfolio", async ({ page }) => {
    const email = `test-${Date.now()}@example.com`;
    await createUser(email, "Test User", "testpass123");
    await loginUser(page, email, "testpass123");

    await addPortfolio(page, "Growth Fund", "100000");
    await openFirstStock(page);

    await page.getByRole("button", { name: "Buy Stock" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await choosePortfolio(page, "Growth Fund");
    await page.getByLabel("Quantity").fill("2");
    await page.getByRole("button", { name: "Buy" }).click();

    await expect(page.getByText("Stock purchased successfully")).toBeVisible();

    const stockPath = page.url();
    await page.getByRole("button", { name: "Sell Stock" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await choosePortfolio(page, "Growth Fund");
    await page.getByLabel("Quantity").fill("1");
    await page.getByRole("button", { name: "Sell" }).click();

    await expect(page.getByText("Stock sold successfully")).toBeVisible();
    await expect(page).toHaveURL(stockPath);
  });
});
