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
```

Confirm the redirect URI is allowed for that WorkOS application. Ask a Landry for
dashboard access if needed, although he should place in Discord for everyone. These values are exposed to the browser; use a client ID,
never an API key. [Environment configuration](src/config/env.ts) validates these
settings and supplies defaults, which the values above override.

### Start the development server

```bash
pnpm dev
```

The default address is `http://localhost:5173`. Keep the local URL consistent with
the configured authentication redirect. Restart Vite after changing `.env.local`.

## Technologies and libraries

| Technology                         | Purpose here                                                                                                               |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| React + TypeScript                 | UI components, hooks, and static types.                                                                                    |
| Vite                               | Local development server and production bundling.                                                                          |
| React Router                       | Page routing, lazy-loaded routes, and protected app routes.                                                                |
| TanStack Query                     | Async queries, mutations, and caching.                                                                                     |
| WorkOS AuthKit                     | Hosted sign-in/sign-up and authentication state.                                                                           |
| Zod                                | Runtime validation and TypeScript types for models and configuration.                                                      |
| shadcn/ui + Base UI + Tailwind CSS | Shared UI components, interaction primitives, and styling.                                                                 |
| Supporting UI libraries            | Recharts for charts, TanStack Table for tables, dnd-kit for drag-and-drop, Lucide for icons, and Sonner for notifications. |
| ESLint + Prettier                  | Code checks and consistent formatting.                                                                                     |

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

[ServicesProvider](src/context/services.context.tsx) is where implementations are
selected and supplied through React context. Feature hooks read services from that
context and call their interface methods.

To add or swap a service:

1. Define its interface in `features/<feature>/services/`, including inputs and return types.
2. Implement that contract in `infrastructure/` for a live integration or `testing/`
   for a test double. Both must follow the same behavior as well as the same types.
3. Register the interface in the `Services` type and select its implementation in
   `ServicesProvider`. Hooks and pages continue using the same contract.

This pattern supports new integrations and lets tests use predictable in-memory
data. Swapping an implementation is a wiring change in the provider; any supporting
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
