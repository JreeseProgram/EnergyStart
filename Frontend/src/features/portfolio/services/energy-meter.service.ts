import z from "zod"
import {
  EnergyMeterId,
  EnergyMeterType,
  UnitOfMeasure,
  EnergyReadingFields,
} from "@/features/portfolio/models/energy-meter.models"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import { PropertyId } from "@/features/portfolio/models/property.models"

export const GetEnergyMetersInput = z.object({ propertyId: PropertyId })
export type GetEnergyMetersInput = z.infer<typeof GetEnergyMetersInput>
export const GetEnergyMeterInput = GetEnergyMetersInput.extend({
  energyMeterId: EnergyMeterId,
})
export type GetEnergyMeterInput = z.infer<typeof GetEnergyMeterInput>
export const CreateEnergyMeterInput = z.object({
  propertyId: PropertyId,
  meterId: z.string().trim().min(1, "Enter a meter name").max(100),
  meterType: EnergyMeterType,
  unitOfMeasure: UnitOfMeasure,
  inUse: z.boolean(),
  isDelivered: z.boolean(),
})
export type CreateEnergyMeterInput = z.infer<typeof CreateEnergyMeterInput>
export const UpdateEnergyMeterInput = CreateEnergyMeterInput.extend({
  energyMeterId: EnergyMeterId,
})
export type UpdateEnergyMeterInput = z.infer<typeof UpdateEnergyMeterInput>
export const CreateEnergyReadingInput = EnergyReadingFields.safeExtend({
  propertyId: PropertyId,
  energyMeterId: EnergyMeterId,
})
export type CreateEnergyReadingInput = z.infer<typeof CreateEnergyReadingInput>

export interface EnergyMeterService {
  getEnergyMeter: (input: GetEnergyMeterInput) => Promise<EnergyMeter>
  getEnergyMeters: (input: GetEnergyMetersInput) => Promise<EnergyMeter[]>
  createEnergyMeter: (input: CreateEnergyMeterInput) => Promise<EnergyMeter>
  updateEnergyMeter: (input: UpdateEnergyMeterInput) => Promise<EnergyMeter>
  createEnergyReading: (input: CreateEnergyReadingInput) => Promise<EnergyMeter>
}
