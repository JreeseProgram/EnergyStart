import z, { ZodUUID } from "zod"

export type BaseEntity = z.infer<typeof BaseEntity>
export const BaseEntity = <T extends ZodUUID>(id: T) =>
  z.object({
    id,
    createdAt: z.iso.datetime().optional().default(new Date().toISOString()),
  })
