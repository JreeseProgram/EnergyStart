import z from "zod"
import {
  EnergyMeter,
  EnergyMeterId,
} from "@/features/portfolio/models/energy-meter.models"
import { PropertyId } from "@/features/portfolio/models/property.models"
import { UserId } from "@/features/portfolio/models/user.models"

export interface EnergyMeterService {
  getEnergyMeter: (input: GetEnergyMeterInput) => Promise<EnergyMeter>
  getEnergyMeters: (input: GetEnergyMetersInput) => Promise<EnergyMeter[]>
  createEnergyMeter: (input: CreateEnergyMeterInput) => Promise<EnergyMeter>
}

export type GetEnergyMeterInput = z.infer<typeof GetEnergyMeterInput>
export const GetEnergyMeterInput = z.object({ EnergyMeterId: EnergyMeterId })

export type GetEnergyMetersInput = z.infer<typeof GetEnergyMetersInput>
export const GetEnergyMetersInput = z.object({ propertyId: PropertyId })

export type CreateEnergyMeterInput = z.infer<typeof CreateEnergyMeterInput>
export const CreateEnergyMeterInput = EnergyMeter.omit({
  id: true,
  createdAt: true,
  meterKBtu: true,
  sourceEui: true,
  siteEui: true,
  date: true,
  rawUse: true,
  unitOfMeasure: true,
}).and(z.object({ propertyId: PropertyId, userId: UserId }))
