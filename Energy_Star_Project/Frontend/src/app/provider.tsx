import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import * as React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { HelmetProvider } from "react-helmet-async"
import { Spinner } from "@/components/ui/spinner"
import { queryConfig } from "@/lib/react-query"
import { AuthLoader } from "@/context/auth.context"
import { MainErrorFallback } from "@/components/errors/main"
import { ServicesProvider } from "@/context/services.context"
import { AuthInMemoryService } from "@/testing/services/auth-in-memory.service"

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  )
  const [services] = React.useState(() => ({
    authService: new AuthInMemoryService(),
  }))

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
          <ServicesProvider services={services}>
            <QueryClientProvider client={queryClient}>
              {import.meta.env.DEV && <ReactQueryDevtools />}
              <AuthLoader
                renderLoading={() => (
                  <div className="flex h-screen w-screen items-center justify-center">
                    <Spinner />
                  </div>
                )}
              >
                {children}
              </AuthLoader>
            </QueryClientProvider>
          </ServicesProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  )
}
