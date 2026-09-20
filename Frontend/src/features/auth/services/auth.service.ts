import type { AuthenticatedUser } from "@/features/auth/models/auth.models"

export interface AuthService {
  logout: () => Promise<void>
  login: () => Promise<void>
  register: () => Promise<void>
  getCurrentUser: () => Promise<AuthenticatedUser | null>
  isLoading?: boolean
}
