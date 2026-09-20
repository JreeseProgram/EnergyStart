import { useUser } from "@/features/auth/hooks/use-user"
import type { JSX } from "react/jsx-runtime"

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return "Unable to load authentication state."
}

type AuthLoaderProps = {
  children: React.ReactNode
  renderLoading: () => JSX.Element
  renderUnauthenticated?: () => JSX.Element
  renderError?: (error: Error) => JSX.Element
}

function BaseAuthLoader({
  children,
  renderLoading,
  renderUnauthenticated,
  renderError = (error: Error) => <>{getErrorMessage(error)}</>,
}: AuthLoaderProps) {
  const { isSuccess, isFetched, status, data, error } = useUser()

  if (isSuccess) {
    if (renderUnauthenticated && !data) {
      return renderUnauthenticated()
    }
    return <>{children}</>
  }

  if (!isFetched) {
    return renderLoading()
  }

  if (status === "error") {
    return renderError(error)
  }

  return null
}

export function AuthLoader(props: AuthLoaderProps) {
  return <BaseAuthLoader {...props} />
}
