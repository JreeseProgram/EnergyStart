import type {
  EnergyReport,
  EnergyReportType,
} from "@/features/portfolio/models/energy-report.models"

export const REPORT_TYPES = [
  { value: "SITE_EUI" as const, label: "Site EUI" },
  { value: "SOURCE_EUI" as const, label: "Source EUI" },
  { value: "ENERGY_STAR_SCORE" as const, label: "Energy Star Score" },
]
export function reportTypeLabel(type: EnergyReportType) {
  return REPORT_TYPES.find((item) => item.value === type)!.label
}
export function reportMonthLabel(month: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(month + "-01T00:00:00.000Z"))
}
export function reportResultLabel(report: EnergyReport) {
  const value = report.result.toLocaleString("en-US", {
    maximumFractionDigits: 1,
  })
  return report.reportType === "ENERGY_STAR_SCORE"
    ? "Score " + value
    : value + " kBtu/ft²"
}
export function reportMonths(start: string, end: string) {
  const [sy, sm] = start.split("-").map(Number)
  const [ey, em] = end.split("-").map(Number)
  const length = (ey - sy) * 12 + em - sm + 1
  if (!Number.isInteger(length) || length < 1 || length > 24)
    throw new Error("Choose a valid period of up to 24 months.")
  return Array.from({ length }, (_, index) =>
    new Date(Date.UTC(sy, sm - 1 + index, 1)).toISOString().slice(0, 10)
  )
}
export function defaultReportPeriod() {
  const now = new Date()
  return {
    startMonth: new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 12, 1)
    )
      .toISOString()
      .slice(0, 7),
    endMonth: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
      .toISOString()
      .slice(0, 7),
  }
}
