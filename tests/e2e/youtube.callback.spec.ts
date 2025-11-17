import { expect, test } from "@playwright/test";

const fakeSession = {
  user: {
    id: 100,
    email: "yt-user@example.com",
    active: true,
    emailVerified: true,
    onboardingStatus: "COMPLETED",
    roles: ["USER"],
    person: null,
  },
  tokens: {
    accessToken: "access-token",
    refreshToken: "refresh-token",
    refreshTokenExpiresAt: new Date(Date.now() + 60_000).toISOString(),
    refreshTokenIssuedAt: new Date().toISOString(),
    tokenType: "Bearer",
  },
};

test.describe("YouTube OAuth callback", () => {
  test("redirects to publishing after successful completion", async ({ page }) => {
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(fakeSession),
      });
    });

    await page.route("**/api/platforms/connections", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "[]",
      });
    });

    await page.route("**/api/platforms/youtube/oauth/complete", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "CONNECTED",
          connection: {
            id: 501,
            userId: fakeSession.user.id,
            platformName: "YouTube",
            externalAccountId: "channel-123",
            externalUsername: "@brandchannel",
            externalDisplayName: "Brand Channel",
            status: "CONNECTED",
            metadata: {},
          },
        }),
      });
    });

    await page.goto("/youtube/callback?code=fake-code&state=abc123");

    await expect(page).toHaveURL(/\/publishing\?connected=youtube$/);
  });
});
