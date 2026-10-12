import z from "zod"

export type EnergyReportId = z.infer<typeof EnergyReportId>
export const EnergyReportId = z.uuid().brand("EnergyReportId")
