import { expect, test } from "@playwright/test";
import { performLogin, waitForPostLoginNavigation, registerTransientUser } from "./utils/auth";

const apiBaseUrl = process.env.PLAYWRIGHT_API_BASE_URL ?? "http://localhost:8080/api";

test.describe("Onboarding flows", () => {
  test("completed users are redirected away from onboarding", async ({ page }) => {
    test.skip(
      !process.env.E2E_TEST_EMAIL || !process.env.E2E_TEST_PASSWORD,
      "E2E_TEST_EMAIL and E2E_TEST_PASSWORD must be defined"
    );

    await performLogin(page, process.env.E2E_TEST_EMAIL as string, process.env.E2E_TEST_PASSWORD as string);
    await waitForPostLoginNavigation(page);

    await page.goto("/onboarding");
    await expect(page).toHaveURL(/dashboard$/);
  });

  test("newly registered users land on onboarding", async ({ page, request }) => {
    test.skip(process.env.E2E_ALLOW_MUTATION !== "true", "Set E2E_ALLOW_MUTATION=true to run mutation tests");

    const { email, password } = await registerTransientUser(request, apiBaseUrl);

    await performLogin(page, email, password);
    await waitForPostLoginNavigation(page);

    await expect(page).toHaveURL(/onboarding$/);
    await expect(page.locator("h1, h2")).toContainText(/onboarding/i);
  });
});
