const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  retries: 1, 
  workers: 2, 
  use: {
    browserName: "chromium", 
    headless: false, 
    viewport: { width: 1280, height: 720 }, 
    actionTimeout: 10000, 
    navigationTimeout: 15000, 
    baseURL: "http://localhost:3000", 
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: {
        browserName: "chromium",
        channel: "chrome", 
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
