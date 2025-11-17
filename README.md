# Personal Branding SaaS – Web

Next.js 15 + MUI dashboard that surfaces onboarding, publishing connectors, and future analytics slices.

## Run Locally

```bash
cd personal-branding-saas-web
npm install
npm run dev            # http://localhost:3000
```

The app expects the backend at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080/api`) and uses HttpOnly refresh cookies, so run the API on the same host/port family to avoid CORS headaches.

## OAuth Connectors

1. Before testing Instagram/TikTok, follow [`../docs/meta-connector-setup.md`](../docs/meta-connector-setup.md). It explains how to configure the Meta Business app, tester roles, redirect URIs, and the linking between Pages + IG accounts that TikTok also relies on when sharing assets.
2. For YouTube, provision a Google Cloud OAuth client via [`../docs/youtube-connector-setup.md`](../docs/youtube-connector-setup.md) so the `/youtube/callback` redirect and scopes are approved.
3. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to your deployed backend (see [`../docs/environment.md`](../docs/environment.md)).
4. Launch a connector from `/publishing`. The SPA calls `/api/platforms/{provider}/oauth/start`, redirects to the provider, and returns to `/meta/callback`, `/tiktok/callback`, or `/youtube/callback`.
5. The shared `OAuthCallbackHandler` persists selection UIs in `sessionStorage`, maps `OAuthCompletionResult` responses (CONNECTED / SELECTION_REQUIRED / FAILED), and redirects back to `/publishing?connected={provider}` on success.

## Testing

- `npm run lint` – ESLint/TypeScript checks.
- `npm run test:e2e` – Playwright suite (requires the backend or mocked API routes; see specs under `tests/e2e`).

For a deeper roadmap and architectural context, see `../docs/hardening-plan.md` and `../docs/architecture.md`.
