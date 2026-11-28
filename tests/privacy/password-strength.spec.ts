import { expect, expectCleanStorage, expectNoLeak, test } from "../support/privacy";

/*
 * The password strength checker takes a password, so this test types one,
 * waits for the result, and checks that the password left the browser in no
 * request and was stored nowhere.
 */
test("password-strength runs locally and stores nothing", async ({ page, requests, baseURL }) => {
    await page.goto("/en/tools/password-strength/");
    await page.locator("[data-tool-input]").fill("Secret-Tulip-4471-zebra");
    await expect(page.locator("[data-tool-output]")).toHaveValue(/^[0-4]$/, { timeout: 15_000 });
    await page.waitForLoadState("networkidle");
    expectNoLeak(requests, new URL(baseURL as string).origin, [
        "Secret-Tulip-4471-zebra",
        "Tulip-4471",
    ]);
    await expectCleanStorage(page, ["Secret-Tulip-4471-zebra", "Tulip-4471"]);
});
