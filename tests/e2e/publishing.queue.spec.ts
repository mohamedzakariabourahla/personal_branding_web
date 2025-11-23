import { expect, test } from "@playwright/test";

const apiBaseUrl = process.env.PLAYWRIGHT_API_BASE_URL ?? "http://localhost:8080/api";

test.describe("Publishing queue (schedule/retry/cancel)", () => {
  test("schedule -> retry -> cancel post flow", async ({ request }) => {
    test.skip(
      !process.env.E2E_TEST_EMAIL ||
        !process.env.E2E_TEST_PASSWORD ||
        !process.env.E2E_PUBLISH_CONNECTION_ID ||
        !process.env.E2E_PUBLISH_PLATFORM_ID ||
        !process.env.E2E_MEDIA_URL,
      "Requires E2E_TEST_EMAIL, E2E_TEST_PASSWORD, E2E_PUBLISH_CONNECTION_ID, E2E_PUBLISH_PLATFORM_ID, E2E_MEDIA_URL"
    );

    const loginRes = await request.post(`${apiBaseUrl}/auth/login`, {
      data: {
        email: process.env.E2E_TEST_EMAIL,
        password: process.env.E2E_TEST_PASSWORD,
      },
    });
    expect.soft(loginRes.status()).toBe(200);
    const body = await loginRes.json();
    const accessToken = body?.tokens?.accessToken as string;
    expect(accessToken).toBeTruthy();

    const headers = { Authorization: `Bearer ${accessToken}` };
    const scheduleRes = await request.post(`${apiBaseUrl}/publishing/jobs`, {
      headers,
      data: {
        platformId: Number(process.env.E2E_PUBLISH_PLATFORM_ID),
        connectionId: Number(process.env.E2E_PUBLISH_CONNECTION_ID),
        mediaAssetIds: [process.env.E2E_MEDIA_URL],
        caption: "Playwright scheduled post",
        scheduledAt: null,
      },
    });
    expect.soft(scheduleRes.status()).toBe(201);
    const job = await scheduleRes.json();
    const jobId = job?.id as number;
    expect(jobId).toBeTruthy();

    const retryRes = await request.post(`${apiBaseUrl}/publishing/jobs/${jobId}/retry`, { headers });
    expect.soft(retryRes.status()).toBe(202);

    const cancelRes = await request.delete(`${apiBaseUrl}/publishing/jobs/${jobId}`, { headers });
    expect.soft(cancelRes.status()).toBe(204);
  });
});
