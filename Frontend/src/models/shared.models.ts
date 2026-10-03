import z, { ZodUUID } from "zod"

export const BaseEntity = <T extends ZodUUID>(id: T) =>
  z.object({
    id,
    createdAt: z.iso.datetime().optional().default(new Date().toISOString()),
  })
