# Energy Start

This application is aimed to replace Energy Star Portfolio Manager
to give a better experience for Building managers for cities.

## Run frontend and backend with Docker

Install Docker Desktop and start it. From the repository root, create a local
environment file:

```bash
cp .env.example .env
```

Edit `.env` and supply the **same development WorkOS client ID** used by the
frontend, a backend-only WorkOS API key, and your team's MongoDB Atlas URI.
Get these values from your team's development configuration; never commit `.env`
or put the API key in a `VITE_APP_` variable. Atlas must allow your computer's
network connection. The database is hosted in Atlas; Compose does not create
or reset it. Use development/test data rather than a production database.

In the WorkOS application settings, allow the redirect URL
`http://localhost:5173/app`. Then start both services:

```bash
docker compose up --build
```

Open the frontend at <http://localhost:5173> and the backend API at
<http://localhost:8080/api>. The first build downloads Java and JavaScript
dependencies and may take several minutes. After source changes, rerun
`docker compose up --build` to rebuild the images. Stop with Ctrl+C, or run
`docker compose down` from another terminal. View logs with
`docker compose logs -f backend frontend`.

The backend runs its normal authentication profile. Sign in through the
frontend and test an endpoint with a WorkOS bearer token in Postman. For
example, `GET http://localhost:8080/api/auth/me` returns the authenticated
user's ID. A request without a token should return 401. For property access,
test with two accounts: the owner can read their property; a different user
without access should receive 403. `GET /api/auth/me/profile` additionally
needs the configured `WORKOS_API_KEY` to retrieve profile data from WorkOS.
Do not share screenshots containing tokens, API keys, or database credentials.

The frontend's portfolio screens currently use mock services; running both
containers does not automatically wire those screens to the backend. The
frontend's shared API client can be checked from the browser console while
signed in using the smoke test in [Frontend/README.md](Frontend/README.md).

If login or requests fail, check that both sides use the same WorkOS client ID,
the redirect URL is allowed, Atlas accepts the connection, and ports 5173 and
8080 are free. `WORKOS_ISSUER` is optional unless your team's issuer differs
from the backend default. Do not enable the `local-test` profile for WorkOS
authentication checks.

