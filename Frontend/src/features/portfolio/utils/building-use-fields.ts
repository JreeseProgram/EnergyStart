import z from "zod"
import type { FieldPath } from "react-hook-form"
import {
  BuildingUseCommonFields,
  BuildingUseDetails,
  BuildingUseSpecificFields,
  type BuildingUseType,
} from "@/features/portfolio/models/building-use.models"
import type { BuildingUseField } from "@/features/portfolio/components/building-use-field"

const labels: Record<string, string> = {
  grossFloorArea: "Gross floor area (ft²)",
  parkingSize: "Parking area (ft²)",
  yearOfConstruction: "Year of construction",
  numOfWorkersMainShift: "Workers on the main shift",
  numOfComputers: "Computers",
  percentCooled: "Area cooled (%)",
  percentHeated: "Area heated (%)",
  percentColdStorage: "Cold storage (%)",
  weeklyOperatingHours: "Weekly operating hours",
  areaOfWalkInFreezer: "Walk-in freezer area (ft²)",
  lengthOfFreezerUnit: "Freezer unit length",
  numOfCookingEquipment: "Cooking equipment units",
  numOfFullTimeWorkers: "Full-time workers",
  numOfHeatingUnits: "Heating units",
  numOfMRIMachines: "MRI machines",
  numOfStaffedBeds: "Staffed beds",
  hasCookingFacilities: "Cooking facilities",
  numCommercialFreezer: "Commercial freezers",
  numOfRooms: "Rooms",
  numOfSurgicalBeds: "Surgical beds",
  BuildingHeight: "Building height",
  numOfBedrooms: "Bedrooms",
  numOfResidentialUnits: "Residential units",
  doesWorkWeekend: "Operates on weekends",
  isHighSchool: "High school",
  avgNumResidents: "Average residents",
  maxResidentCapacity: "Maximum resident capacity",
  numOfCommercialWashingMachines: "Commercial washing machines",
  numOfResidentialLifts: "Residential lifts",
  numOfResidentialWashingMachines: "Residential washing machines",
  numOfOpenClosedFreezers: "Open and closed freezers",
  avgNumVehiclesInInventory: "Average vehicles in inventory",
  hasExteriorEntrance: "Exterior entrance",
  isSingleStore: "Single store",
  numOfWalkInFreezers: "Walk-in freezers",
  grossFloorAreaForFoodPrep: "Food preparation area (ft²)",
  seatingCapacity: "Seating capacity",
}

function getFieldInput(
  schema: z.ZodType
): Pick<BuildingUseField, "kind" | "options"> {
  if (schema instanceof z.ZodBoolean) {
    return { kind: "boolean", options: undefined }
  }

  if (schema instanceof z.ZodEnum) {
    return {
      kind: "enum",
      options: schema.options.map((value) => ({
        value: String(value),
        label: String(value).toLowerCase().replaceAll("_", " "),
      })),
    }
  }

  return { kind: "number", options: undefined }
}

function getFieldLimits(
  name: string
): Pick<BuildingUseField, "min" | "max" | "step"> {
  switch (name) {
    case "yearOfConstruction":
      return { min: 1, max: new Date().getFullYear(), step: 1 }

    case "weeklyOperatingHours":
      return { min: 0, max: 168, step: "any" }

    case "maxResidentCapacity":
    case "seatingCapacity":
      return { min: 0, max: undefined, step: 1 }

    default:
      return {
        min: 0,
        max: name.startsWith("percent") ? 100 : undefined,
        step: name.startsWith("num") ? 1 : "any",
      }
  }
}

export function getBuildingUseFields(
  type?: BuildingUseType
): BuildingUseField[] {
  const specificSchema = BuildingUseSpecificFields.options.find(
    (schema) => schema.shape.buildingUseType.value === type
  )
  const shape = { ...BuildingUseCommonFields.shape, ...specificSchema?.shape }

  return Object.entries(shape)
    .filter(([name]) => name !== "propertyId" && name !== "buildingUseType")
    .map(([name, schema]) => ({
      name: name as FieldPath<BuildingUseDetails>,
      label: labels[name] ?? name,
      ...getFieldInput(schema),
      ...getFieldLimits(name),
    }))
}
