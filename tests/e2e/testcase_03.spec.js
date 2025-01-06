const { test, expect } = require("@playwright/test");
const complaintID = "677c03196b0e7bb19a0c03de";
test.setTimeout(60000); // 60 seconds timeout for each test

test.describe("CASE 03 - Workflow for JE and EO", () => {
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

  // Helper function to handle multiple dialogs
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

  // Helper function to interact with elements
  async function waitAndClick(page, selector, fillText = null) {
    try {
      await page.waitForSelector(selector, {
        state: "visible",
        timeout: 10000,
      });
      if (fillText) {
        await page.locator(selector).fill(fillText);
      } else {
        await page.click(selector);
      }
    } catch (error) {
      console.error(`Error interacting with ${selector}:`, error);
      throw error;
    }
  }

  // JE Workflow - Status Change to RESOURCE_REQUIRED
  test("JE Login and Change Status to RESOURCE_REQUIRED", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await login(page, "je", "je");
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption("#statusChange", "RESOURCE_REQUIRED");
    await waitAndClick(
      page,
      "#remark-text",
      "Resource required due to shortage."
    );
    await handleConsecutiveDialogs(page, 2);
    await waitAndClick(page, "#popup-submit");
    await waitAndClick(page, "#logout-button");
  });

  // EO Workflow - Status Change to RAISED
  test("EO Login and Change Status to RAISED", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await login(page, "eo", "eo");
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption("#statusChange", "RAISED");
    await waitAndClick(
      page,
      "#remark-text",
      "Issue raised for further escalation."
    );
    await handleConsecutiveDialogs(page, 2);
    await waitAndClick(page, "#popup-submit");
    await waitAndClick(page, "#logout-button");
  });

  // JE Workflow - Repeat Status Change to RESOURCE_REQUIRED
  test("JE Login Again and Change Status to RESOURCE_REQUIRED", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000");
    await login(page, "je", "je");
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption("#statusChange", "RESOURCE_REQUIRED");
    await waitAndClick(page, "#remark-text", "Additional resources required.");
    await handleConsecutiveDialogs(page, 2);
    await waitAndClick(page, "#popup-submit");
    await waitAndClick(page, "#logout-button");
  });

  // EO Workflow - Status Change to CLOSED
  test("EO Login and Change Status to CLOSED", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await login(page, "eo", "eo");
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption("#statusChange", "CLOSED");
    await handleConsecutiveDialogs(page, 2);
    await waitAndClick(page, "#popup-submit");
    await waitAndClick(page, "#logout-button");
  });
});
