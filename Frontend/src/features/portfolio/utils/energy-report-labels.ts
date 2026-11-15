export function reportMonthLabel(month: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(month + "-01T00:00:00.000Z"))
}
export function reportTitle(report: { startMonth: string; endMonth: string }) {
  return `${reportMonthLabel(report.startMonth)} to ${reportMonthLabel(report.endMonth)}`
}
export function reportEuiLabel(value: number) {
  return (
    value.toLocaleString("en-US", { maximumFractionDigits: 1 }) + " kBtu/ft²"
  )
}
export function reportDateLabel(value: string) {
  // LocalDateTime has no timezone. Format its calendar date without shifting it.
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value.slice(0, 10) + "T00:00:00Z"))
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
