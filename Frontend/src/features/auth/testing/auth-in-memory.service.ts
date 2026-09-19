import { JWT } from "@/features/auth/models/auth.models"
import {
  AuthenticatedUser,
  User,
  UserId,
} from "@/features/auth/models/user.models"

import {
  LoginInput,
  RegisterInput,
  type AuthService,
} from "@/features/auth/services/auth.service"

export class AuthInMemoryService implements AuthService {
  private static readonly STORAGE_KEY = "auth.currentUser"

  private currentUser: User | null = null

  constructor() {
    this.currentUser = this.loadCurrentUser()
  }

  async login(input: LoginInput) {
    const parsedInput = LoginInput.parse(input)
    const user = User.parse({
      id: this.createUserId(),
      firstName: "Luke",
      lastName: "Skywalker",
      email: parsedInput.email,
      role: "ADMIN",
    })
    this.setCurrentUser(user)
    const jwt = JWT.parse(this.createMockJwt({}))
    return AuthenticatedUser.parse({
      jwt,
      user,
    })
  }

  async logout() {
    this.setCurrentUser(null)
  }

  async register(input: RegisterInput) {
    const parsedInput = RegisterInput.parse(input)
    const user = User.parse({
      id: this.createUserId(),
      email: parsedInput.email,
      firstName: parsedInput.firstName,
      lastName: parsedInput.lastName,
      role: "ADMIN",
    })
    this.setCurrentUser(user)
    const jwt = JWT.parse(this.createMockJwt({}))
    return AuthenticatedUser.parse({
      jwt,
      user,
    })
  }

  async getCurrentUser() {
    return this.currentUser
  }

  private setCurrentUser(user: User | null) {
    this.currentUser = user

    if (user) {
      localStorage.setItem(
        AuthInMemoryService.STORAGE_KEY,
        JSON.stringify(user)
      )
    } else {
      localStorage.removeItem(AuthInMemoryService.STORAGE_KEY)
    }
  }

  private loadCurrentUser() {
    const rawUser = localStorage.getItem(AuthInMemoryService.STORAGE_KEY)

    if (!rawUser) {
      return null
    }

    try {
      return User.parse(JSON.parse(rawUser))
    } catch {
      localStorage.removeItem(AuthInMemoryService.STORAGE_KEY)
      return null
    }
  }

  private createMockJwt(payload: Record<string, unknown>) {
    const header = {
      alg: "none",
      typ: "JWT",
    }

    return `${this.base64UrlEncode(header)}.${this.base64UrlEncode(payload)}.mock-signature`
  }

  private createUserId() {
    return UserId.parse(crypto.randomUUID())
  }

  private base64UrlEncode(value: unknown) {
    return btoa(JSON.stringify(value))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
  }
}
