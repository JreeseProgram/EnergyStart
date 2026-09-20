import { BaseEntity } from "@/models/shared.models"
import z from "zod"

export type AuthenticatedUserId = z.infer<typeof AuthenticatedUserId>
export const AuthenticatedUserId = z
  .union([z.uuid(), z.string()])
  .brand("AuthenticatedUserId")

export type AuthenticatedUser = z.infer<typeof AuthenticatedUser>
export const AuthenticatedUser = BaseEntity(z.uuid()).extend({
  id: AuthenticatedUserId,
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
})
