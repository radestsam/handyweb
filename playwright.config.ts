import { defineConfig, devices } from "@playwright/test";

// Not 4321: that is the port of `make dev`, and the tests must run on the build.
const PORT = 4322;

// The Playwright browser CDN refuses downloads from Iran. On such a machine, set
// PW_CHROMIUM_PATH to a local Chromium-based browser (Chrome, Brave, Edge). Only
// the Chromium projects then run. CI downloads every browser and runs them all.
const localChromium = process.env.PW_CHROMIUM_PATH;
// Brave blocks most local() fonts on web pages (fingerprinting protection).
// The flag turns that off, so the fallback font test sees what Chrome sees.
// Other Chromium browsers ignore it.
const chromiumUse = localChromium
    ? {
          launchOptions: {
              executablePath: localChromium,
              args: ["--disable-features=BraveFarbling"],
          },
      }
    : {};

const allProjects = [
    { name: "chromium", use: { ...devices["Desktop Chrome"], ...chromiumUse } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile", use: { ...devices["Pixel 7"], ...chromiumUse } },
];
const chromiumProjects = new Set(["chromium", "mobile"]);

// The tests run against the production build, served by `astro preview`, so
// they see the same static files that the hosts serve.
export default defineConfig({
    testDir: "tests",
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: "retain-on-failure",
    },
    projects: localChromium ? allProjects.filter((p) => chromiumProjects.has(p.name)) : allProjects,
    webServer: {
        command: `yarn build && yarn workspace @handyweb/web run preview --port ${PORT} --ignore-lock`,
        url: `http://localhost:${PORT}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
    },
});
