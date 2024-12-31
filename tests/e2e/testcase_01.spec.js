const { test, expect } = require("@playwright/test");
const complaintID = "6773a544123e50423da628f7";
const imagePath = "C:UserskavinDownloadsIMG_4399.jpg";
test.setTimeout(60000); // 60 seconds timeout for each test
test.describe("CASE 01 - Complaint Handling Workflow", () => {
  // Helper function for logging in
  async function login(page, username, password) {
    await page.fill("#username", username);
    await page.fill("#password", password);
    await page.click('button:has-text("Sign in")');
    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
    const yourActivityButton = await page.getByRole("button", {
      name: "Your Activity",
    });
    await expect(yourActivityButton).toBeVisible();
    await yourActivityButton.click();
  }
  // Helper function to handle consecutive dialogs
  async function handleConsecutiveDialogs(page, numDialogs) {
    let dialogCount = 0;
    const dialogListener = async (dialog) => {
      if (dialogCount < numDialogs) {
        await dialog.accept();
        dialogCount++;
        if (dialogCount === numDialogs) {
          page.off("dialog", dialogListener);
        }
      }
    };
    page.on("dialog", dialogListener);
  }
  // Helper function to wait for and click a button
  async function waitAndClick(page, selector) {
    try {
      await page.waitForSelector(selector, {
        state: "visible",
        timeout: 10000,
      });
      await page.locator(selector).waitFor({ state: "visible" });
      await page.click(selector);
    } catch (error) {
      console.error(`Error clicking button ${selector}:`, error);
      await page.screenshot({ path: `debug-${selector.replace("#", "")}.png` });
      throw error;
    }
  }
  // JE Workflow
  test("JE Login and Workflow", async ({ page }) => {
    await page.goto("http://localhost:3000");
    const logo = page.locator('header img[alt="CASFOS Logo"]');
    await expect(logo).toBeVisible();
    await login(page, "je", "je");
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption("#statusChange", "JE_ACKNOWLEDGED");
    await handleConsecutiveDialogs(page, 2);
    await waitAndClick(page, "#popup-submit");
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption("#statusChange", "JE_WORKDONE");
    await page.setInputFiles("#imgAfter", imagePath);
    await handleConsecutiveDialogs(page, 2);
    await waitAndClick(page, "#popup-submit");
    await waitAndClick(page, "#logout-button");
  });
  // AE Workflow
  test("AE Login and Workflow", async ({ page }) => {
    await page.goto("http://localhost:3000");
    const logo = page.locator('header img[alt="CASFOS Logo"]');
    await expect(logo).toBeVisible();
    await login(page, "ae", "ae");
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption("#statusChange", "AE_ACKNOWLEDGED");
    await handleConsecutiveDialogs(page, 2);
    await waitAndClick(page, "#popup-submit");
    await waitAndClick(page, "#logout-button");
  });
  // EE Workflow
  test("EE Login and Workflow", async ({ page }) => {
    await page.goto("http://localhost:3000");
    const logo = page.locator('header img[alt="CASFOS Logo"]');
    await expect(logo).toBeVisible();
    await login(page, "ee", "ee");
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption("#statusChange", "EE_ACKNOWLEDGED");
    await page.fill("#price-input", "2500");
    await handleConsecutiveDialogs(page, 2);
    await waitAndClick(page, "#popup-submit");
    await waitAndClick(page, "#logout-button");
  });
  // Admin Workflow
  test("Admin Login and Workflow", async ({ page }) => {
    await page.goto("http://localhost:3000");
    const logo = page.locator('header img[alt="CASFOS Logo"]');
    await expect(logo).toBeVisible();
    await login(page, "eo", "eo");
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption("#statusChange", "RESOLVED");
    await handleConsecutiveDialogs(page, 2);
    await waitAndClick(page, "#popup-submit");
  });
});
