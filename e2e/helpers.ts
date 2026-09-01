import { Page } from "@playwright/test";
import { expect } from "@playwright/test";

const baseUrl = "http://localhost:3000";

export const resetDatabase = async () => {
  const response = await fetch(`${baseUrl}/api/testing/reset`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to reset database: ${response.status} ${response.statusText} - ${errorText}`,
    )
  }
}

export const createUser = async (email: string, name: string, password: string) => {
  const response = await fetch(`${baseUrl}/api/testing/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password }),
  });
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to create user: ${response.status} ${response.statusText} - ${errorText}`,
    )
  }
};

export const loginUser = async (page: Page, email: string, password: string) => {
  await page.goto("/sign-in");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Login", exact: true }).click();
};

export const addPortfolio = async (page: Page, name: string, cashBalance: string) => {
  await page.getByRole("button", { name: "Add Portfolio" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Portfolio name").fill(name);
  await dialog.getByLabel("Cash balance").fill(cashBalance);
  await dialog.getByRole("button", { name: "Add Portfolio" }).click();
  await expect(page.getByText("Portfolio added")).toBeVisible();
  await expect(dialog).not.toBeVisible();
}

