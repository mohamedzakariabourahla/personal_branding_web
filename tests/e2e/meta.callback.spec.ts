import { expect, test } from "@playwright/test";

const fakeAuthResponse = {
  user: {
    id: 100,
    email: "meta-user@example.com",
    active: true,
    emailVerified: true,
    onboardingStatus: "COMPLETED",
    roles: ["USER"],
    person: null,
  },
  tokens: {
    accessToken: "access-token",
    refreshToken: "refresh-token",
    refreshTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    refreshTokenIssuedAt: new Date().toISOString(),
    tokenType: "Bearer",
    deviceId: "playwright-device",
    deviceName: "Playwright",
  },
};

test.describe("Meta OAuth callback", () => {
  test("prompts for selection then connects successfully", async ({ page }) => {
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(fakeAuthResponse),
      });
    });

    await page.route("**/api/platforms/connections", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "[]",
      });
    });

    let completionCallCount = 0;
    await page.route("**/api/platforms/meta/oauth/complete", async (route) => {
      completionCallCount += 1;

      if (completionCallCount === 1) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            status: "SELECTION_REQUIRED",
            candidates: [
              {
                primaryId: "page-1",
                primaryName: "Alpha Realty",
                secondaryId: "ig-1",
                secondaryHandle: "alpharealty",
                secondaryName: "Alpha Realty",
              },
            ],
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "CONNECTED",
          connection: {
            id: 55,
            userId: fakeAuthResponse.user.id,
            platformName: "Instagram",
            externalAccountId: "ig-1",
            externalUsername: "alpharealty",
            externalDisplayName: "Alpha Realty",
            status: "CONNECTED",
            metadata: {},
          },
        }),
      });
    });

    await page.goto("/meta/callback?code=dummy-code&state=state-xyz");

    await expect(page.getByText("Select which Instagram account you want to connect.")).toBeVisible();

    await page.getByRole("button", { name: /Alpha Realty/i }).click();
    await page.getByRole("button", { name: /Connect selected account/i }).click();

    await expect(page).toHaveURL(/\/publishing\?connected=meta$/);
  });
});
