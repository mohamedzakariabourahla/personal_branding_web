import { expect, test } from "@playwright/test";
import { performLogin, waitForPostLoginNavigation } from "./utils/auth";

const apiBaseUrl = process.env.PLAYWRIGHT_API_BASE_URL ?? "http://localhost:8080/api";

type AuthResponse = {
  tokens: {
    accessToken: string;
    refreshToken: string;
    tokenType?: string;
  };
  user: {
    onboardingStatus: string;
  };
};

test.describe("Auth smoke", () => {
  test("redirects unauthenticated users away from the dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(new RegExp("/login$"));
  });

  test("signs in with seeded credentials and stores session", async ({ page }) => {
    test.skip(
      !process.env.E2E_TEST_EMAIL || !process.env.E2E_TEST_PASSWORD,
      "E2E_TEST_EMAIL and E2E_TEST_PASSWORD must be defined"
    );

    await performLogin(page, process.env.E2E_TEST_EMAIL as string, process.env.E2E_TEST_PASSWORD as string);
    await waitForPostLoginNavigation(page);

    const cookies = await page.context().cookies();
    const refreshCookie = cookies.find((cookie) => cookie.name === "pb_refresh");
    expect(refreshCookie?.value).toBeTruthy();
  });

  test("login API responds with refresh token metadata", async ({ request }) => {
    test.skip(
      !process.env.E2E_TEST_EMAIL || !process.env.E2E_TEST_PASSWORD,
      "E2E_TEST_EMAIL and E2E_TEST_PASSWORD must be defined"
    );

    const response = await request.post(`${apiBaseUrl}/auth/login`, {
      data: {
        email: process.env.E2E_TEST_EMAIL,
        password: process.env.E2E_TEST_PASSWORD,
      },
    });

    expect.soft(response.status()).toBe(200);
    const body = (await response.json()) as AuthResponse;
    expect(body.tokens.accessToken).toBeTruthy();
    expect(body.tokens.refreshToken).toBeTruthy();
  });

  test("guest resend endpoint returns retry-after header", async ({ request }) => {
    const response = await request.post(`${apiBaseUrl}/auth/email/resend-guest`, {
      data: { email: "guest@example.com" },
    });

    expect.soft(response.status()).toBe(202);
    const retryAfter = response.headers()["retry-after"];
    expect(retryAfter).toBeTruthy();
  });
});
