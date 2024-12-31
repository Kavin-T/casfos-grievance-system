const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e", // Directory containing your test files
  retries: 1, // Number of retries for failed tests
  workers: 2, // Number of parallel test workers
  use: {
    browserName: "chromium", // Default browser for testing ('chromium', 'firefox', 'webkit')
    headless: false, // Run tests in a visible browser (useful for debugging)
    viewport: { width: 1280, height: 720 }, // Default viewport size
    actionTimeout: 10000, // Timeout for Playwright actions (e.g., clicks, waits)
    navigationTimeout: 15000, // Timeout for page navigation
    baseURL: "http://localhost:3000", // Base URL for tests
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: {
        browserName: "chromium",
        channel: "chrome", // Use the Chrome browser
      },
    },
    {
      name: "Desktop Firefox",
      use: {
        browserName: "firefox",
      },
    },
  ],
});
