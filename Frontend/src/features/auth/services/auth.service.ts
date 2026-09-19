import type {
  AuthenticatedUser,
  User,
} from "@/features/auth/models/user.models"
import z from "zod"

export interface AuthService {
  logout: () => Promise<void>
  login: (input: LoginInput) => Promise<AuthenticatedUser>
  register: (input: RegisterInput) => Promise<AuthenticatedUser>
  getCurrentUser: () => Promise<User | null>
}

export type LoginInput = z.infer<typeof LoginInput>
export const LoginInput = z.object({
  email: z.email("Invalid Email").min(1, "Required"),
  password: z.string().min(5, "Required"),
})

export type RegisterInput = z.infer<typeof RegisterInput>
export const RegisterInput = z.object({
  email: z.string().min(1, "Required"),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  password: z.string().min(5, "Required"),
})
