const { test, expect } = require("@playwright/test");

test.describe("Users Management", () => {
  test.beforeEach(async ({ page }) => {
    const username = "eo";
    const password = "eo";

    await page.goto("http://localhost:3000");
    await page.fill("input#username", username);
    await page.fill("input#password", password);

    await page.click('button:has-text("Sign in")');

    page.on("dialog", async (dialog) => {
      console.log(dialog.message());
      await dialog.accept();
    });

    const usersButton = page.locator('button:has-text("Users")');
    await usersButton.click();

    await expect(page.getByTestId("user-management-title")).toHaveText(
      "User Management"
    );

    await expect(page.getByTestId("create-user-button")).toBeVisible();

    const userCount = await page
      .getByTestId("user-list")
      .locator("div")
      .count();

    await expect(userCount).toBeGreaterThan(2);
  });

  test("should create a new user", async ({ page }) => {
    await page.getByTestId("create-user-button").click();

    await expect(page.getByTestId("user-modal")).toBeVisible();
    await expect(page.getByTestId("modal-title")).toHaveText("Create New User");

    await page.getByTestId("user-input-username").fill("JohnDoe");
    await page
      .getByTestId("user-input-designation")
      .selectOption("EXECUTIVE_ENGINEER");
    await page.getByTestId("user-input-email").fill("john.doe@example.com");
    await page.getByTestId("user-input-phone-number").fill("1234587890");
    await page.getByTestId("user-input-password").fill("password123");
    await page.getByTestId("user-input-confirm-password").fill("password123");

    await page.getByTestId("user-submit-button").click();

    await expect(page.getByTestId("user-list")).toContainText("JohnDoe");
  });

  test("should update an existing user", async ({ page }) => {
    await page
      .getByTestId("user-name-JohnDoe")
      .getByTestId("update-user-button")
      .click();

    await expect(page.getByTestId("user-modal")).toBeVisible();
    await page.getByTestId("user-input-username").fill("JohnUpdatedDoe");
    await page.getByTestId("user-submit-button").click();

    await expect(page.getByTestId("user-list")).toContainText("JohnUpdatedDoe");
  });

  test("should delete an existing user", async ({ page }) => {
    await page
      .getByTestId("user-name-JohnUpdatedDoe")
      .getByTestId("delete-user-button")
      .click();

    await expect(page.getByTestId("user-list")).not.toContainText(
      "JohnUpdatedDoe"
    );
  });
});