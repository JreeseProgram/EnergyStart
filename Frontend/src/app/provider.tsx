import { useAuth } from "@workos-inc/authkit-react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import * as React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { HelmetProvider } from "react-helmet-async"
import { Spinner } from "@/components/ui/spinner"
import { queryConfig } from "@/lib/react-query"
import { AuthLoader } from "@/features/auth/context/auth.context"
import { MainErrorFallback } from "@/components/errors/main"
import WorkOsProvider from "@/lib/work-os"
import { Toaster } from "@/components/ui/toast"
import { ServicesProvider } from "@/context/services.context"

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => (
  <WorkOsProvider>
    <SessionProvider>{children}</SessionProvider>
  </WorkOsProvider>
)

function SessionProvider({ children }: AppProviderProps) {
  const { user, isLoading } = useAuth()
  if (isLoading)
    return (
      <div role="status" className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  return (
    <SessionContent key={user?.id ?? "signed-out"}>{children}</SessionContent>
  )
}

function SessionContent({ children }: AppProviderProps) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  )

  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {import.meta.env.DEV && <ReactQueryDevtools />}
            <ServicesProvider>
              <AuthLoader
                renderLoading={() => (
                  <div className="flex h-screen w-screen items-center justify-center">
                    <Spinner />
                  </div>
                )}
              >
                {children}
                <Toaster />
              </AuthLoader>
            </ServicesProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  )
}
