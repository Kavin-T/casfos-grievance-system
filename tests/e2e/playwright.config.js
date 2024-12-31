const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e', // Directory containing your test files
  timeout: 30000, // Maximum time for a test to run (in milliseconds)
  retries: 1, // Number of retries for failed tests
  workers: 2, // Number of parallel test workers
  reporter: 'html', // Generate an HTML report for test results
  use: {
    browserName: 'chromium', // Default browser for testing ('chromium', 'firefox', 'webkit')
    headless: false, // Run tests in a visible browser (useful for debugging)
    viewport: { width: 1280, height: 720 }, // Default viewport size
    actionTimeout: 10000, // Timeout for Playwright actions (e.g., clicks, waits)
    navigationTimeout: 15000, // Timeout for page navigation
    baseURL: 'http://localhost:3000', // Base URL for tests
    screenshot: 'only-on-failure', // Capture screenshots on test failure
    video: 'retain-on-failure', // Record video on test failure
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome', // Use the Chrome browser
      },
    },
    {
      name: 'Desktop Firefox',
      use: {
        browserName: 'firefox',
      },
    },
  ],
});
