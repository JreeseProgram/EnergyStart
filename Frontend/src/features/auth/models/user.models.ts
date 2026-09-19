import { JWT } from "@/features/auth/models/auth.models"
import { BaseEntity } from "@/models/shared.models"
import z from "zod"

export type UserId = z.infer<typeof UserId>
export const UserId = z.uuid().brand("UserId")

export type User = z.infer<typeof User>
export const User = BaseEntity(UserId).extend({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  bio: z.string().default(""),
})

export type AuthenticatedUser = z.infer<typeof AuthenticatedUser>
export const AuthenticatedUser = z.object({
  jwt: JWT,
  user: User,
})
