import z from "zod"
import {
  EnergyMeterId,
  EnergyMeterType,
  UnitOfMeasure,
  EnergyReadingFields,
} from "@/features/portfolio/models/energy-meter.models"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import { PropertyId } from "@/features/portfolio/models/property.models"

export interface EnergyMeterService {
  deleteEnergyMeter: (input: DeleteEnergyMeterInput) => Promise<void>
  deleteEnergyReading: (input: DeleteEnergyReadingInput) => Promise<void>
  getEnergyMeter: (input: GetEnergyMeterInput) => Promise<EnergyMeter>
  getEnergyMeters: (input: GetEnergyMetersInput) => Promise<EnergyMeter[]>
  createEnergyMeter: (input: CreateEnergyMeterInput) => Promise<EnergyMeter>
  updateEnergyMeter: (input: UpdateEnergyMeterInput) => Promise<EnergyMeter>
  createEnergyReading: (input: CreateEnergyReadingInput) => Promise<EnergyMeter>
}

export type GetEnergyMetersInput = z.infer<typeof GetEnergyMetersInput>
export const GetEnergyMetersInput = z.object({ propertyId: PropertyId })

export type GetEnergyMeterInput = z.infer<typeof GetEnergyMeterInput>
export const GetEnergyMeterInput = GetEnergyMetersInput.extend({
  energyMeterId: EnergyMeterId,
})

export type CreateEnergyMeterInput = z.infer<typeof CreateEnergyMeterInput>
export const CreateEnergyMeterInput = z.object({
  propertyId: PropertyId,
  meterName: z.string().trim().min(1, "Enter a meter name").max(100),
  meterType: EnergyMeterType,
  unitOfMeasure: UnitOfMeasure,
  inUse: z.boolean(),
  isDelivered: z.boolean(),
})

export type UpdateEnergyMeterInput = z.infer<typeof UpdateEnergyMeterInput>
export const UpdateEnergyMeterInput = CreateEnergyMeterInput.extend({
  energyMeterId: EnergyMeterId,
})

export type CreateEnergyReadingInput = z.infer<typeof CreateEnergyReadingInput>
export const CreateEnergyReadingInput = EnergyReadingFields.safeExtend({
  propertyId: PropertyId,
  energyMeterId: EnergyMeterId,
})

export type DeleteEnergyMeterInput = z.infer<typeof DeleteEnergyMeterInput>
export const DeleteEnergyMeterInput = GetEnergyMeterInput

export type DeleteEnergyReadingInput = z.infer<typeof DeleteEnergyReadingInput>
export const DeleteEnergyReadingInput = GetEnergyMeterInput.extend({
  readingId: z.string().min(1),
})

// The POST succeeded; an invalid response must not invite another write.
export class EnergyMeterCreateRefreshError extends Error {
  readonly propertyId: PropertyId

  constructor(propertyId: PropertyId, cause: unknown) {
    super(
      "The energy meter may have been created, but its details could not be validated. Close this form and reload the meter list; do not create it again.",
      { cause }
    )
    this.name = "EnergyMeterCreateRefreshError"
    this.propertyId = propertyId
  }
}

// The PUT succeeded; an invalid response must not invite another write.
export class EnergyMeterUpdateRefreshError extends Error {
  readonly propertyId: PropertyId

  constructor(propertyId: PropertyId, cause: unknown) {
    super(
      "The energy meter may have been updated, but its details could not be validated. Close this form and reload the meter list; do not save it again.",
      { cause }
    )
    this.name = "EnergyMeterUpdateRefreshError"
    this.propertyId = propertyId
  }
}

// The POST succeeded; validation or refresh failure must not invite another write.
export class EnergyReadingCreateRefreshError extends Error {
  readonly propertyId: PropertyId
  readonly energyMeterId: EnergyMeterId

  constructor(
    propertyId: PropertyId,
    energyMeterId: EnergyMeterId,
    cause: unknown
  ) {
    super(
      "The energy reading may have been created, but the saved details could not be validated or refreshed. Close this form and reload the meter; do not submit the reading again.",
      { cause }
    )
    this.name = "EnergyReadingCreateRefreshError"
    this.propertyId = propertyId
    this.energyMeterId = energyMeterId
  }
}
