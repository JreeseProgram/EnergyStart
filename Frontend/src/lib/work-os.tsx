import { env } from "@/config/env"
import { AuthKitProvider } from "@workos-inc/authkit-react"
import type { ReactNode } from "react"

export default function WorkOsProvider({ children }: { children: ReactNode }) {
  return (
    <AuthKitProvider
      clientId={env.WORKOS_CLIENT_ID}
      redirectUri={env.REDIRECT_URI}
    >
      {children}
    </AuthKitProvider>
  )
}
