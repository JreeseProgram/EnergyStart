import z from "zod"
import { PropertyId } from "@/features/portfolio/models/property.models"
import { PortfolioMonthlyPerformance } from "@/features/portfolio/models/portfolio-performance.models"

export const EnergyReportId = z.uuid().brand("EnergyReportId")
export type EnergyReportId = z.infer<typeof EnergyReportId>
export const EnergyReportType = z.enum(
  ["SITE_EUI", "SOURCE_EUI", "ENERGY_STAR_SCORE"],
  "Select a report type"
)
export type EnergyReportType = z.infer<typeof EnergyReportType>
const month = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Select a valid month")

export const EnergyReportFields = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Enter a report name")
      .max(100, "Use 100 characters or fewer"),
    reportType: EnergyReportType,
    startMonth: month,
    endMonth: month,
  })
  .refine((input) => input.startMonth <= input.endMonth, {
    message: "End month must be on or after start month",
    path: ["endMonth"],
  })
  .refine((input) => input.endMonth < new Date().toISOString().slice(0, 7), {
    message: "Choose completed months before the current month",
    path: ["endMonth"],
  })
  .refine(
    (input) => {
      const [sy, sm] = input.startMonth.split("-").map(Number)
      const [ey, em] = input.endMonth.split("-").map(Number)
      return (ey - sy) * 12 + em - sm < 24
    },
    { message: "Choose a period of 24 months or fewer", path: ["endMonth"] }
  )
export type EnergyReportFields = z.infer<typeof EnergyReportFields>

export const EnergyReport = z
  .object({
    id: EnergyReportId,
    propertyId: PropertyId,
    name: z.string(),
    reportType: EnergyReportType,
    startMonth: month,
    endMonth: month,
    generatedAt: z.iso.datetime(),
    simulated: z.literal(true),
    result: z.number().nonnegative(),
    propertySnapshot: z.object({
      name: z.string(),
      streetAddress: z.string(),
      city: z.string(),
      state: z.string(),
      zip: z.string(),
    }),
    snapshot: z.object({
      version: z.literal("portfolio-prototype-v1"),
      asOf: z.iso.date(),
      floorAreaSqFt: z.number().positive(),
      monthlyPerformance: z.array(PortfolioMonthlyPerformance).min(1),
    }),
  })
  .refine(
    (report) =>
      report.reportType !== "ENERGY_STAR_SCORE" || report.result <= 100,
    {
      message: "Score cannot exceed 100",
      path: ["result"],
    }
  )
export type EnergyReport = z.infer<typeof EnergyReport>
