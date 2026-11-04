import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import {
  EnergyMeterType,
  UnitOfMeasure,
} from "@/features/portfolio/models/energy-meter.models"

function readable(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
export const METER_TYPES = EnergyMeterType.options.map((value) => ({
  value,
  label: readable(value),
}))
export const METER_UNITS = UnitOfMeasure.options.map((value) => ({
  value,
  label: value.replaceAll("_", " "),
}))
export function meterTypeLabel(value: EnergyMeter["meterType"]) {
  return METER_TYPES.find((item) => item.value === value)?.label ?? value
}
export function latestReading(meter: EnergyMeter) {
  return [...meter.readings].sort((a, b) =>
    b.endDate.localeCompare(a.endDate)
  )[0]
}
export function meterDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value.length === 10 ? value + "T00:00:00.000Z" : value))
}
