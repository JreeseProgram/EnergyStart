import { env } from "@/config/env"
import { registerAccessTokenGetter } from "@/lib/api-client"
import { Spinner } from "@/components/ui/spinner"
import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react"
import { useEffect, useState, type ReactNode } from "react"

function ApiAuthentication({ children }: { children: ReactNode }) {
  const { getAccessToken, signIn, isLoading } = useAuth()
  const [registration, setRegistration] = useState<{
    getAccessToken: typeof getAccessToken
    signIn: typeof signIn
  } | null>(null)

  useEffect(() => {
    if (isLoading) return

    const unregister = registerAccessTokenGetter({ getAccessToken, signIn })
    // Synchronize rendering with registration in the external API client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRegistration({ getAccessToken, signIn })
    return unregister
  }, [getAccessToken, signIn, isLoading])

  if (
    isLoading ||
    registration?.getAccessToken !== getAccessToken ||
    registration?.signIn !== signIn
  ) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return children
}

export default function WorkOsProvider({ children }: { children: ReactNode }) {
  return (
    <AuthKitProvider
      clientId={env.WORKOS_CLIENT_ID}
      redirectUri={env.REDIRECT_URI}
    >
      <ApiAuthentication>{children}</ApiAuthentication>
    </AuthKitProvider>
  )
}
