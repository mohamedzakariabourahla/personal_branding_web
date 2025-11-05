import { APIRequestContext, Page, expect } from "@playwright/test";

export async function performLogin(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}

export async function waitForPostLoginNavigation(page: Page) {
  await page.waitForURL(
    (url) => url.pathname.includes("/dashboard") || url.pathname.includes("/onboarding"),
    { timeout: 15_000 }
  );
}

export async function registerTransientUser(
  request: APIRequestContext,
  apiBaseUrl: string,
  overrides?: { email?: string; password?: string }
) {
  const uniqueSuffix = Date.now();
  const email = overrides?.email ?? `e2e+${uniqueSuffix}@example.com`;
  const password = overrides?.password ?? process.env.E2E_MUTATION_PASSWORD ?? "Str0ngPass!123";

  const response = await request.post(`${apiBaseUrl}/auth/register`, {
    data: { email, password },
  });

  expect.soft(response.status()).toBe(201);
  return { email, password, response };
}
