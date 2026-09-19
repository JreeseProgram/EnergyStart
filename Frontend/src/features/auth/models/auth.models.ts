import z from "zod"

export type JWT = z.infer<typeof JWT>
export const JWT = z.jwt()
