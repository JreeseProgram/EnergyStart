import { paths } from "@/config/paths"
import type { AuthService } from "@/features/auth/services/auth.service"
import {
  SESSION_KEY,
  testUser,
} from "@/features/auth/testing/fixtures/auth.fixtures"

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
