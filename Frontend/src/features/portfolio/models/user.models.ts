import { BaseEntity } from "@/models/shared.models"
import z from "zod"

export type UserId = z.infer<typeof UserId>
export const UserId = z.union([z.uuid(), z.string()]).brand("UserId")

export type User = z.infer<typeof User>
export const User = BaseEntity(z.uuid()).extend({
  id: UserId,
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
})
