import { paths } from "@/config/paths"
import { AuthenticatedUser } from "@/features/auth/models/auth.models"
import type { AuthService } from "@/features/auth/services/auth.service"

const SESSION_KEY = "energy-start:test-auth:authenticated"

export const testUser = AuthenticatedUser.parse({
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
  email: "luke-skywalker@jmail.com",
  firstName: "Luke",
  lastName: "Skywalker",
})

export function useAuthService(): AuthService {
  const login = async () => {
    // Preserve the mock session across the redirect, like the real auth flow.
    sessionStorage.setItem(SESSION_KEY, "true")
    window.location.assign(paths.app.dashboard.getHref())
  }

  return {
    getCurrentUser: async () =>
      sessionStorage.getItem(SESSION_KEY) === "true" ? testUser : null,
    login,
    logout: async () => {
      sessionStorage.removeItem(SESSION_KEY)
    },
    register: login,
  } satisfies AuthService
}
