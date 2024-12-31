const { test, expect } = require('@playwright/test');

const complaintID = '67735a6f9b40ab2a8fd27ae8'; // Replace with your complaint ID
const imagePath = 'D:/images/DSC_0494.JPG'; // Ensure this file path exists

// Set a global timeout for all tests
test.setTimeout(60000); // 60 seconds timeout for each test

test.describe('CASE 03 - Resource Required', () => {

  // Helper function for logging in
  async function login(page, username, password) {
    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('button:has-text("Sign in")');
    page.once('dialog', async (dialog) => {
      await dialog.accept(); // Accept dialog after login
    });
    const yourActivityButton = await page.getByRole('button', { name: 'Your Activity' });
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
          page.off('dialog', dialogListener); // Stop listening after required dialogs
        }
      }
    };
    page.on('dialog', dialogListener);
  }

  async function waitAndClick(page, selector) {
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout: 10000 });
      await page.locator(selector).waitFor({ state: 'visible' });
  
      // Check if the selector is 'remark-text' and set the value if it is
      if (selector === '#remark-text') {
        await page.locator(selector).fill('I am Not Satisfied');
      } else {
        await page.click(selector);
      }
    } catch (error) {
      console.error(`Error clicking or interacting with ${selector}:`, error);
      await page.screenshot({ path: `debug-${selector.replace('#', '')}.png` });
      throw error;
    }
  }

  // JE Workflow
  test('JE Login and Resource Required', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const logo = page.locator('header img[alt="CASFOS Logo"]');
    await expect(logo).toBeVisible();

    await login(page, 'Test_JE', 'password');

    // JE steps
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption('#statusChange', 'RESOURCE_REQUIRED');
    await waitAndClick(page, '#remark-text');
    await handleConsecutiveDialogs(page, 2); // Handle two consecutive dialogs
    await waitAndClick(page, '#popup-submit');

    await waitAndClick(page, '#logout-button');
  });

  // Admin Workflow (Murugavel)
  test('Admin Login and Raised', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const logo = page.locator('header img[alt="CASFOS Logo"]');
    await expect(logo).toBeVisible();
    await login(page, 'murugavel', '123456789secure');
    // Admin steps
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption('#statusChange', 'RAISED');
    await waitAndClick(page, '#remark-text');
    await handleConsecutiveDialogs(page, 2); // Handle two consecutive dialogs
    await waitAndClick(page, '#popup-submit');
    await waitAndClick(page, '#logout-button');
  });


  // JE Workflow
  test('JE Login and Again Resource Required', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const logo = page.locator('header img[alt="CASFOS Logo"]');
    await expect(logo).toBeVisible();

    await login(page, 'Test_JE', 'password');

    // JE steps
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption('#statusChange', 'RESOURCE_REQUIRED');
    await waitAndClick(page, '#remark-text');
    await handleConsecutiveDialogs(page, 2); // Handle two consecutive dialogs
    await waitAndClick(page, '#popup-submit');

    await waitAndClick(page, '#logout-button');
  });

  // Admin Workflow (Murugavel)
  test('Admin Login and Closed', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const logo = page.locator('header img[alt="CASFOS Logo"]');
    await expect(logo).toBeVisible();
    await login(page, 'murugavel', '123456789secure');
    // Admin steps
    await waitAndClick(page, `#update-button-${complaintID}`);
    await page.selectOption('#statusChange', 'CLOSED');
    await handleConsecutiveDialogs(page, 2); // Handle two consecutive dialogs
    await waitAndClick(page, '#popup-submit');
    await waitAndClick(page, '#logout-button');
  });


});
