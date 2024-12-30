const { test, expect } = require("@playwright/test");

test.describe("Login Page Tests", () => {
  test("should render the login page correctly", async ({ page }) => {
    await page.goto("http://localhost:3000");

    const logo = page.locator('header img[alt="CASFOS Logo"]');
    await expect(logo).toBeVisible();

    const usernameField = page.locator("input#username");
    await expect(usernameField).toBeVisible();

    const passwordField = page.locator("input#password");
    await expect(passwordField).toBeVisible();
  });

  test("should display an error message with invalid credentials", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");
    await page.fill("input#username", "invalidUser");
    await page.fill("input#password", "invalidPass");
    await page.click('button:has-text("Sign in")');

    const errorMessage = page.locator("p.text-red-500");
    await expect(errorMessage).toContainText("Username not found");
  });

  test("should successfully login with valid credentials", async ({ page }) => {
    const username = "ae";
    const password = "ae";

    await page.goto("http://localhost:3000");
    await page.fill("input#username", username);
    await page.fill("input#password", password);

    await page.click('button:has-text("Sign in")');

    page.on("dialog", async (dialog) => {
      expect(dialog.message()).toBe(`Welcome, ${username}!`);
      await dialog.accept();
    });

    await expect(page).toHaveURL("http://localhost:3000/home");
  });
});
