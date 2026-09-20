import { AuthenticatedUser } from "@/features/auth/models/auth.models"
import type { AuthService } from "@/features/auth/services/auth.service"
import { useState } from "react"

export function useAuthService(): AuthService {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)

  const testUser = AuthenticatedUser.parse({
    id: "user-123",
    createdAt: new Date().toISOString(),
    email: "test@test.com",
    firstName: "test",
    lastName: "test",
  })

  return {
    getCurrentUser: async () => user,
    login: async () => setUser(testUser),
    logout: async () => setUser(null),
    register: async () => setUser(testUser),
  } satisfies AuthService
}
