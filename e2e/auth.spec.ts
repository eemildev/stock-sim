import { test, expect } from "@playwright/test"
import { resetDatabase, createUser, loginUser } from "./helpers"


test.beforeEach(async () => {
  await resetDatabase()
})

test.describe("Authentication", () => {

  test("user can register", async ({ page }) => {
    const email = `test-${Date.now()}@example.com`

    await page.goto("/sign-up")

    await page.getByLabel("Name", { exact: true }).fill("Test User")
    await page.getByLabel("Email", { exact: true }).fill(email)
    await page.getByLabel("Password", { exact: true }).fill("testpass123")
    await page
      .getByLabel("Confirm Password", { exact: true })
      .fill("testpass123")

    await page.getByRole("button", { name: "Create Account" }).click()

    console.log(await page.context().cookies());

    // Should redirect to dashboard page
    await expect(page).toHaveURL("/dashboard")
  })

  test("registration fails with short password", async ({ page }) => {
    const email = `test-${Date.now()}@example.com`

    await page.goto("/sign-up")

    await page.getByLabel("Name", { exact: true }).fill("Test User")
    await page.getByLabel("Email", { exact: true }).fill(email)
    await page.getByLabel("Password", { exact: true }).fill("1234567")
    await page
      .getByLabel("Confirm Password", { exact: true })
      .fill("1234567")

    await page.getByRole("button", { name: "Create Account" }).click()

    // Shouldn't redirect
    await expect(page).toHaveURL("/sign-up")
    await expect(page.getByText("Password must be at least 8 characters long")).toBeVisible()
  })

  test("registration fails with mismatched passwords", async ({ page }) => {
    const email = `test-${Date.now()}@example.com`

    await page.goto("/sign-up")

    await page.getByLabel("Name", { exact: true }).fill("Test User")
    await page.getByLabel("Email", { exact: true }).fill(email)
    await page.getByLabel("Password", { exact: true }).fill("12345678")
    await page
      .getByLabel("Confirm Password", { exact: true })
      .fill("12345670")

    await page.getByRole("button", { name: "Create Account" }).click()

    // Shouldn't redirect
    await expect(page).toHaveURL("/sign-up")
    await expect(page.getByText("Passwords do not match")).toBeVisible()
  })

  test("user can login", async ({ page }) => {
    const email = `test-${Date.now()}@example.com`

    await createUser(email, "Test User", "testpass123")
    await loginUser(page, email, "testpass123")

    // Should redirect to dashboard page
    await expect(page).toHaveURL("/dashboard")
  })

  test("user can't login with wrong credentials", async ({ page }) => {
    const email = `test-${Date.now()}@example.com`

    await createUser(email, "Test User", "testpass123")
    await loginUser(page, email, "testpass333")

    await expect(page.getByText("Invalid email or password")).toBeVisible()
  })

  test("user can logout", async ({ page }) => {
    const email = `test-${Date.now()}@example.com`

    await createUser(email, "Test User", "testpass123")
    await loginUser(page, email, "testpass123")
    await page.getByRole("button", { name: "User" }).click()
    await page.getByRole("button", { name: "Logout" }).click()

    // should redirect to sign-in page
    await expect(page).toHaveURL("/sign-in")
  })
})
