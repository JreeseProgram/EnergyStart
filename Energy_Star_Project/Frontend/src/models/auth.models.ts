import z from "zod"

export type Roles = z.infer<typeof Roles>
export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const
export const Roles = z.enum(ROLES)

export type JWT = z.infer<typeof JWT>
export const JWT = z.jwt()
