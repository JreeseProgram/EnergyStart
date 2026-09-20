import { AuthenticatedUser } from "@/features/auth/models/auth.models"
import type { AuthService } from "@/features/auth/services/auth.service"
import { useAuth } from "@workos-inc/authkit-react"

export function useAuthService(): AuthService {
  const { user, signIn, signUp, signOut, isLoading } = useAuth()

  return {
    getCurrentUser: async () =>
      user
        ? AuthenticatedUser.parse({
            id: user?.id,
            bio: "",
            createdAt: user?.createdAt,
            email: user?.email,
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
          })
        : null,
    login: async () => signIn(),
    logout: async () => signOut(),
    register: async () => signUp(),
    isLoading,
  } satisfies AuthService
}
