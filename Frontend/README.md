# Energy Start frontend

Energy Start helps building managers track building portfolios and energy use.
This frontend is a React single-page application organized around features.

## Quick start

Use **Node.js 22.12+** and **pnpm**. From the repository root:

```bash
cd Frontend
pnpm install --frozen-lockfile
```

### Environment variables

From `Frontend/`, copy the example file for your first setup:

```bash
cp .env.example .env.local
```

If `.env.local` already exists, edit it instead of copying over it.
Log into the [WorkOS dashboard](https://dashboard.workos.com/), select the team's
development environment, and open the frontend application under **Applications**.
Copy its **Client ID** into `VITE_APP_WORKOS_CLIENT_ID` in `.env.local`.
See [WorkOS application settings](https://workos.com/docs/authkit/applications) for
client IDs and redirect URI configuration.

```dotenv
VITE_APP_WORKOS_CLIENT_ID=client_replace_with_team_client_id
VITE_APP_REDIRECT_URI=http://localhost:5173/app
VITE_APP_API_URL=http://localhost:8080/api
```

Confirm the redirect URI is allowed for that WorkOS application. Ask a Landry for
dashboard access if needed, although he should place in Discord for everyone. These values are exposed to the browser; use a client ID,
never an API key. [Environment configuration](src/config/env.ts) validates these
settings; all three values are required and have no defaults.

### Start the development server

```bash
pnpm dev
```

The default address is `http://localhost:5173`. Keep the local URL consistent with
the configured authentication redirect. Restart Vite after changing `.env.local`.

## Run with the authenticated backend

Use **Java 21** and a running MongoDB instance (local or a development database).
From the repository root, start the backend in a separate terminal:

```bash
cd Backend/prod
export MONGODB_URI='mongodb://localhost:27017/energystart'
export WORKOS_CLIENT_ID='client_replace_with_team_client_id'
export FRONTEND_ORIGIN='http://localhost:5173'
./mvnw spring-boot:run
```

On Windows PowerShell, set variables with `$env:NAME = 'value'` and run
`.\mvnw.cmd spring-boot:run`. Supply these variables in the backend process environment;
Spring does not automatically load the frontend's `.env.local`.

`WORKOS_CLIENT_ID` must match `VITE_APP_WORKOS_CLIENT_ID`. The backend defaults to
issuer `https://api.workos.com/user_management/<WORKOS_CLIENT_ID>`; set
`WORKOS_ISSUER` only if the team's WorkOS environment uses a different issuer.
For `/api/auth/me/profile`, also supply `WORKOS_API_KEY` in the backend environment.
That secret is not needed for `/api/auth/me` and must never appear in a `VITE_`
variable or a committed file.

Start the frontend with `pnpm dev` from `Frontend/`. Its API URL must be
`VITE_APP_API_URL=http://localhost:8080/api`. Keep port 5173 available; if using
another port, update the frontend redirect URI, WorkOS allowed redirect URI,
and backend `FRONTEND_ORIGIN` together. The origin must include scheme, host,
and port, without a trailing slash.

Use the normal backend profile for authentication checks. The `local-test`
profile bypasses authentication and cannot verify this integration. The service
bundle currently combines WorkOS auth with mock portfolio services: changing the
API URL does not switch portfolio data to the backend. Select implementations in
`src/hooks/use-services.ts`; `useTestServices()` supplies a fully mocked bundle.
There is no runtime mock/real environment switch.

### Authentication smoke check

With both apps running, sign in through the frontend. Because portfolio services
are still mocked, use this temporary browser DevTools check on the frontend page
to exercise the shared API client without adding a production diagnostic route:

```js
const { api } = await import('/src/lib/api-client.ts')
await api.get('/auth/me') // Returns { userId: ... } for the signed-in WorkOS user.
```

Do not print or copy access tokens. Confirm the returned user ID matches the
signed-in account. Check rejection independently from that same frontend page:

```js
await fetch('http://localhost:8080/api/auth/me').then(r => r.status) // 401
await fetch('http://localhost:8080/api/auth/me', {
  headers: { Authorization: 'Bearer invalid-test-token' },
}).then(r => r.status) // 401; its OPTIONS preflight should succeed.
```

In the Network panel, confirm the preflight allows the frontend origin and
Authorization header. A `401` from the shared client shows a persistent,
dismissible session-expired message with a **Sign in** action; it does not
redirect or replay the failed request. A temporary token-fetch failure asks the
user to retry without claiming the session has expired. A `403` shows a permission
message; network and server failures show retry guidance. Cancelled requests
produce no toast.

### Troubleshooting

- **Missing API_URL:** use `VITE_APP_API_URL`, not `VITE_API_URL`, and restart Vite.
- **CORS/network error:** confirm the backend is running and `FRONTEND_ORIGIN`
  exactly matches the frontend URL, including `localhost` versus `127.0.0.1`.
- **401 while signed in:** check matching WorkOS client IDs, issuer configuration,
  token expiration, and backend access to WorkOS signing keys. Use **Sign in**
  to authenticate again. Do not enable `local-test` to hide the failure.
- **404:** check that the API base URL includes `/api` exactly once.
- **Profile lookup fails:** configure the backend-only `WORKOS_API_KEY`; verify
  basic authentication separately with `/api/auth/me`.
- **Portfolio still shows sample data:** expected until each portfolio service
  is explicitly replaced in the service bundle.

## Technologies and libraries

| Technology                         | Purpose here                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| React + TypeScript                 | UI components, hooks, and static types.                                                          |
| Vite                               | Local development server and production bundling.                                                |
| React Router                       | Page routing, lazy-loaded routes, and protected app routes.                                      |
| TanStack Query                     | Async queries, mutations, and caching.                                                           |
| WorkOS AuthKit                     | Hosted sign-in/sign-up and authentication state.                                                 |
| Zod                                | Runtime validation and TypeScript types for models and configuration.                            |
| shadcn/ui + Base UI + Tailwind CSS | Shared UI components, interaction primitives, and styling.                                       |
| Supporting UI libraries            | Recharts for charts, TanStack Table for tables, dnd-kit for drag-and-drop, and Lucide for icons. |
| ESLint + Prettier                  | Code checks and consistent formatting.                                                           |

See [package.json](package.json) for the full dependency list and scripts.

## Architecture

```text
src/
├── main.tsx       # Browser entry point and theme provider
├── app/           # App providers, router, and route pages
├── features/      # Domain code: auth and portfolio
├── components/    # Shared UI, layouts, and navigation (ui/ holds primitives)
├── config/        # Environment settings and route path constants
├── context/       # Shared service wiring through React context
├── models/        # Shared Zod schemas and types
├── hooks/         # Shared React hooks
└── lib/           # Third-party integration helpers and configuration
```

[App providers](src/app/provider.tsx) set up WorkOS, TanStack Query, services,
authentication loading, and error handling. The [router](src/app/router.tsx)
defines public pages and protected `/app` pages.

Within a feature, `models/` defines data, `services/` defines service contracts,
`infrastructure/` implements external integrations, and `testing/` holds test doubles.
Feature-specific hooks, components, contexts, and utilities stay with that feature.

### Strict feature boundaries

**A feature must not import files from another feature folder, including types.**
Each feature owns its domain and may depend on its own code and shared modules.
This keeps domains separate and prevents features from becoming coupled as the app grows.

When multiple features need the same domain-neutral code, place it in a shared
folder such as `src/models/`, `src/components/`, or `src/hooks/`. Coordinate features
through routes and app-level composition instead of importing one feature into another.
Do not use shared re-exports to bypass this boundary.

## How services work

Services define what the application needs to do through TypeScript interfaces.
These contracts belong to the application layer and live in each feature's
`services/` folder. They describe operations, inputs, and return values using
application models. Implementations handle the API, SDK, or storage details.

The application depends on the contract, so an implementation can be replaced
without changing the hooks or pages that use it:

```text
Pages / hooks → service interface → selected implementation
                                   ├── External API or SDK
                                   └── In-memory test double
```

[ServicesProvider](src/context/services.context.tsx) supplies the bundle returned by
`useServices()` through React context. That hook selects WorkOS authentication and
the current mock portfolio implementations. `useTestServices()` constructs a fully
mock bundle without requiring WorkOS. Both hooks share internal portfolio setup,
including the in-memory store and service dependencies. Feature hooks read services
from context and call their interface methods.

To add or swap a service:

1. Define its interface in `features/<feature>/services/`, including inputs and return types.
2. Implement that contract in `infrastructure/` for a live integration or `testing/`
   for a test double. Both must follow the same behavior as well as the same types.
3. Register the interface in the `Services` type and wire its implementations into
   the service bundle hooks. Hooks and pages continue using the same contract.

This pattern supports new integrations and lets tests use predictable in-memory
data. Swapping an implementation is a wiring change in the bundle hooks; any supporting
SDK setup belongs in the app providers.

### Validating service boundaries with Zod

Zod schemas define our internal domain data and provide runtime validation.
We derive TypeScript types from those schemas with `z.infer<typeof Schema>`, so
the types used by service interfaces stay aligned with the validation rules.
Domain schemas live in `models/`; operation-specific input schemas live alongside
their service contracts.

At a service boundary, validate inputs against their schemas. Map external data
into the application's domain shape, then validate it before returning it to callers:

```text
External data → implementation maps fields → domain schema validates → app uses typed data
```

Use `.parse()` to return validated data or throw on invalid data, or `.safeParse()`
when the implementation needs to handle a validation failure explicitly. TypeScript
interfaces alone do not validate data at runtime; implementations must call the schemas.

Apply the same contracts and validation rules to live services and test doubles.
This keeps frontend data consistent as we test or migrate between technologies and
infrastructure: implementations adapt to the provider, while hooks and pages keep
working with the same internal domain types.

## Working on the frontend

- Add domain behavior under `src/features/<feature>/`; compose pages in `src/app/routes/`.
- Keep feature boundaries strict: no imports from other feature folders, even for types.
- Keep shared UI in `src/components/` and reuse the existing `src/components/ui/` primitives.
- Put external integration code behind feature service contracts and wire it through context.
- Use `@/` imports for `src/`, such as `import { Button } from "@/components/ui/button"`.
- Keep route paths in `src/config/paths.ts` and styling tokens in `src/index.css`.
- Use pnpm for dependency changes and commit `package.json` with `pnpm-lock.yaml`.

Run these commands from `Frontend/`:

| Command        | Purpose                                                             |
| -------------- | ------------------------------------------------------------------- |
| `pnpm dev`     | Start the development server.                                       |
| `pnpm lint`    | Run ESLint.                                                         |
| `pnpm build`   | Check TypeScript projects with `tsc -b`, then generate `dist/`.     |
| `pnpm preview` | Serve the most recent production build locally.                     |
| `pnpm format`  | Rewrite TypeScript files using Prettier; review the resulting diff. |

Before opening a PR, run lint and build, manually check the affected flow, and include
brief verification notes (plus screenshots for UI changes). Report existing blockers
separately from issues introduced by your change.

The `pnpm typecheck` script uses `tsc --noEmit` at the solution-level config and does not replace the
project checks performed by `pnpm build`.

### Mock property sharing

The app uses WorkOS sign-in with in-memory portfolio services. Starter properties
belong to the signed-in user. Sharing grants view/edit access; only the owner can
add or remove shared users. The owner cannot be removed or added as a shared user.

Registered mock recipients are `maya@example.com`, `alex@example.com`, and
`sam@example.com`. Lake Eola Offices starts shared with Maya; other starter
properties have no assignments. Names, emails, and assignment dates are mock data.
Sharing matches emails case-insensitively and never sends invitations.

Mock changes survive navigation but reset on refresh or account change. Separate
browsers do not synchronize. A new query client and portfolio store
are mounted for each authenticated identity, keeping account caches separate.
