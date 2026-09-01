import { test, expect } from "@playwright/test"
import { resetDatabase, createUser, loginUser, addPortfolio } from "./helpers"

test.beforeEach(async ({ page }) => {
  await resetDatabase()
  const email = `test-${Date.now()}@example.com`
  await createUser(email, "Test User", "testpass123")
  await loginUser(page, email, "testpass123")
})

test.describe("Add Portfolio", () => {
  test("opens the dialog with expected fields", async ({ page }) => {
    await page.getByRole("button", { name: "Add Portfolio" }).click()

    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()

    await expect(dialog.getByLabel("Portfolio name")).toBeVisible()
    await expect(dialog.getByLabel("Cash balance")).toHaveValue("100000")
    await expect(
      dialog.getByText("Enter the initial cash balance for the portfolio.")
    ).toBeVisible()
  })

  test("creates a portfolio with valid input", async ({ page }) => {
    await addPortfolio(page, "Growth Fund", "100000")

    // reflected on the dashboard
    await expect(page.getByText("Growth Fund")).toBeVisible()
  })

  test("can cancel out of the dialog without creating a portfolio", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Add Portfolio" }).click()

    const dialog = page.getByRole("dialog")
    await dialog.getByLabel("Portfolio name").fill("Should Not Save")

    await page.keyboard.press("Escape")
    await expect(dialog).not.toBeVisible()

    await expect(page.getByText("Should Not Save")).not.toBeVisible()
  })

  test("cash balance respects min/max constraints", async ({ page }) => {
    await page.getByRole("button", { name: "Add Portfolio" }).click()
    const dialog = page.getByRole("dialog")

    const cashInput = dialog.getByLabel("Cash balance")

    await cashInput.fill("500") // below min of 1000
    let isValid = await cashInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    )
    expect(isValid).toBe(false)

    await cashInput.fill("200000") // above max of 100000
    isValid = await cashInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    )
    expect(isValid).toBe(false)

    await cashInput.fill("5000") // within range
    isValid = await cashInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    )
    expect(isValid).toBe(true)
  })

  test("portfolio name is required", async ({ page }) => {
    await page.getByRole("button", { name: "Add Portfolio" }).click()
    const dialog = page.getByRole("dialog")

    await dialog.getByRole("button", { name: "Add Portfolio" }).click()

    const nameInput = dialog.getByLabel("Portfolio name")
    const isValid = await nameInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    )
    expect(isValid).toBe(false)

    // form didn't submit, dialog should still be open
    await expect(dialog).toBeVisible()
  })
})