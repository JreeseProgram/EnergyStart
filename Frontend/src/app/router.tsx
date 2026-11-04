import { QueryClient, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"

import { paths } from "@/config/paths"

import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from "@/app/routes/app/root"
import { ProtectedRoute } from "@/features/auth/components/protected-route"
import PropertyRoute from "@/app/routes/app/property/root"
import {
  ProtectedPropertyRoute,
  ProtectedPropertyRouteSkeleton,
} from "@/features/portfolio/components/protected-property-route"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  }
}

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import("@/app/routes/landing").then(convert(queryClient)),
    },
    {
      path: paths.app.root.path,
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: paths.app.profile.path,
          lazy: () => import("@/app/routes/app/profile").then(convert(queryClient)),
        },
        {
          path: paths.app.dashboard.path,
          lazy: () =>
            import("@/app/routes/app/dashboard").then(convert(queryClient)),
        },
        {
          path: paths.app.properties.path,
          lazy: () =>
            import("@/app/routes/app/properties").then(convert(queryClient)),
        },
        {
          path: paths.app.property.root.path,
          element: (
            <ProtectedPropertyRoute
              fallback={<ProtectedPropertyRouteSkeleton />}
            >
              <PropertyRoute />
            </ProtectedPropertyRoute>
          ),
          children: [
            {
              path: paths.app.property.overview.path,
              lazy: () =>
                import("@/app/routes/app/property/overview").then(
                  convert(queryClient)
                ),
            },
            {
              path: paths.app.property.buildingUses.path,
              lazy: () =>
                import("@/app/routes/app/property/building-uses").then(
                  convert(queryClient)
                ),
            },
            {
              path: paths.app.property.energyMeters.path,
              lazy: () =>
                import("@/app/routes/app/property/energy-meters").then(
                  convert(queryClient)
                ),
            },
            {
              path: paths.app.property.reports.path,
              lazy: () =>
                import("@/app/routes/app/property/reports").then(
                  convert(queryClient)
                ),
            },
            {
              path: paths.app.property.sharing.path,
              lazy: () =>
                import("@/app/routes/app/property/sharing").then(
                  convert(queryClient)
                ),
            },
            {
              path: paths.app.property.settings.path,
              lazy: () =>
                import("@/app/routes/app/property/settings").then(
                  convert(queryClient)
                ),
            },
          ],
        },
      ],
    },
    {
      path: "*",
      lazy: () => import("@/app/routes/not-found").then(convert(queryClient)),
    },
  ])

export const AppRouter = () => {
  const queryClient = useQueryClient()

  const router = useMemo(() => createAppRouter(queryClient), [queryClient])

  return <RouterProvider router={router} />
}
