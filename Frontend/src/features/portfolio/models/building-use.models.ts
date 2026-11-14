import {
  PropertyId,
  PropertyType,
} from "@/features/portfolio/models/property.models"
import z from "zod"

export type BuildingUseType = z.infer<typeof BuildingUseType>
export const BuildingUseType = z.enum([
  ...PropertyType.options.filter((type) => type !== "SENIOR_LIVING"),
  "SENIOR_LIVING_COMMUNITY",
])

export type LowRiseUnits = z.infer<typeof LowRiseUnits>
export const LowRiseUnits = z.number().int()

export type MidRiseUnits = z.infer<typeof MidRiseUnits>
export const MidRiseUnits = z.number().int()

export type HighRiseUnits = z.infer<typeof HighRiseUnits>
export const HighRiseUnits = z.number().int()

export type BuildingUseId = z.infer<typeof BuildingUseId>
export const BuildingUseId = z.string().min(1).brand("BuildingUseId")

// Response schemas mirror EnergyReport and its report_types subclasses.
const integer = z.number().int()

export const BuildingUseCommonFields = z.object({
  relatedPropertyID: PropertyId,
  grossFloorArea: integer,
  parkingSize: integer,
  yearOfConstruction: integer,
})

export type BankBranchUse = z.infer<typeof BankBranchUse>
export const BankBranchUse = z.object({
  reportType: z.literal(BuildingUseType.enum.BANK_BRANCH),
  numOfWorkersMainShift: integer,
  numOfComputers: integer,
  percentCooled: z.number(),
  weeklyOperatingHours: integer,
})

export type ConvenienceStoreUse = z.infer<typeof ConvenienceStoreUse>
export const ConvenienceStoreUse = z.object({
  reportType: z.literal(BuildingUseType.enum.CONVENIENCE_STORE),
  areaOfWalkInFreezer: z.number(),
  lengthOfFreezerUnit: z.number(),
  numOfCookingEquipment: integer,
  numOfFullTimeWorkers: integer,
  numOfHeatingUnits: integer,
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type CourtHouseUse = z.infer<typeof CourtHouseUse>
export const CourtHouseUse = z.object({
  reportType: z.literal(BuildingUseType.enum.COURT_HOUSE),
  numOfComputers: integer,
  numOfWorkersMainShift: integer,
  percentCooled: z.number(),
  weeklyOperatingHours: integer,
})

export type DataCenterUse = z.infer<typeof DataCenterUse>
export const DataCenterUse = z.object({
  reportType: z.literal(BuildingUseType.enum.DATA_CENTER),
  annualITEnergy: z.number(),
})

export type DistrubutionCenterUse = z.infer<typeof DistrubutionCenterUse>
export const DistrubutionCenterUse = z.object({
  reportType: z.literal(BuildingUseType.enum.DISTRIBUTION_CENTER),
  numOfWorkersMainShift: integer,
  percentColdStorage: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
  weeklyOperatingHours: integer,
})

export type FinancialOfficeUse = z.infer<typeof FinancialOfficeUse>
export const FinancialOfficeUse = z.object({
  reportType: z.literal(BuildingUseType.enum.FINANCIAL_OFFICE),
  numOfComputers: integer,
  numOfWorkersMainShift: integer,
  percentCooled: z.number(),
  weeklyOperatingHours: integer,
})

export type HospitalUse = z.infer<typeof HospitalUse>
export const HospitalUse = z.object({
  reportType: z.literal(BuildingUseType.enum.HOSPITAL),
  numOfFullTimeWorkers: integer,
  numOfMRIMachines: integer,
  numOfStaffedBeds: integer,
})

export type HotelUse = z.infer<typeof HotelUse>
export const HotelUse = z.object({
  reportType: z.literal(BuildingUseType.enum.HOTEL),
  hasCookingFacilities: z.boolean(),
  numCommercialFreezer: integer,
  numOfRooms: integer,
  numOfWorkersMainShift: integer,
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type MedicalOfficeUse = z.infer<typeof MedicalOfficeUse>
export const MedicalOfficeUse = z.object({
  reportType: z.literal(BuildingUseType.enum.MEDICAL_OFFICE),
  numOfMRIMachines: integer,
  numOfSurgicalBeds: integer,
  numOfWorkersMainShift: integer,
  weeklyOperatingHours: integer,
})

export type MultiFamilyHousingUse = z.infer<typeof MultiFamilyHousingUse>
export const MultiFamilyHousingUse = z.object({
  reportType: z.literal(BuildingUseType.enum.MULTIFAMILY_HOUSING),
  lowRiseUnits: LowRiseUnits,
  midRiseUnits: MidRiseUnits,
  highRiseUnits: HighRiseUnits,
  numOfBedrooms: integer,
  numOfResidentialUnits: integer,
})

export type OfficeUse = z.infer<typeof OfficeUse>
export const OfficeUse = z.object({
  reportType: z.literal(BuildingUseType.enum.OFFICE),
  numOfComputers: integer,
  numOfWorkersMainShift: integer,
  percentCooled: z.number(),
  weeklyOperatingHours: integer,
})

export type RetailStoreUse = z.infer<typeof RetailStoreUse>
export const RetailStoreUse = z.object({
  reportType: z.literal(BuildingUseType.enum.RETAIL_STORE),
  hasExteriorEntrance: z.boolean(),
  singleStore: z.boolean(),
  numOfFreezers: integer,
  numOfWorkersMainShift: integer,
  percentCooled: z.number(),
  percentHeated: z.number(),
  weeklyOperatingHours: integer,
})

export type SchoolUse = z.infer<typeof SchoolUse>
export const SchoolUse = z.object({
  reportType: z.literal(BuildingUseType.enum.SCHOOL),
  doesWorkWeekend: z.boolean(),
  hasCookingFacilities: z.boolean(),
  highSchool: z.boolean(),
  numOfWorkersMainShift: integer,
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type SeniorLivingUse = z.infer<typeof SeniorLivingUse>
export const SeniorLivingUse = z.object({
  reportType: z.literal(BuildingUseType.enum.SENIOR_LIVING_COMMUNITY),
  avgNumResidents: integer,
  maxResidentCapacity: integer,
  numOfComputers: integer,
  numCommercialFreezer: integer,
  numOfCommercialWashingMachines: integer,
  numOfResidentialLifts: integer,
  numOfResidentialUnits: integer,
  numOfResidentialWashingMachines: integer,
  numOfWorkersMainShift: integer,
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type SuperMarketUse = z.infer<typeof SuperMarketUse>
export const SuperMarketUse = z.object({
  reportType: z.literal(BuildingUseType.enum.SUPERMARKET),
  numOfFreezers: integer,
  numOfWorkersMainShift: integer,
  percentCooled: z.number(),
  percentHeated: z.number(),
  weeklyOperatingHours: integer,
})

export type VehicleDealershipUse = z.infer<typeof VehicleDealershipUse>
export const VehicleDealershipUse = z.object({
  reportType: z.literal(BuildingUseType.enum.VEHICLE_DEALERSHIP),
  avgNumVehiclesInInventory: integer,
  numOfWorkersMainShift: integer,
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type WarehouseUse = z.infer<typeof WarehouseUse>
export const WarehouseUse = z.object({
  reportType: z.literal(BuildingUseType.enum.WAREHOUSE),
  numOfWorkersMainShift: integer,
  percentColdStorage: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
  weeklyOperatingHours: integer,
})

export type WarehouseRefrigeratedUse = z.infer<typeof WarehouseRefrigeratedUse>
export const WarehouseRefrigeratedUse = z.object({
  reportType: z.literal(BuildingUseType.enum.WAREHOUSE_REFRIGERATED),
  weeklyOperatingHours: integer,
  numOfWorkersMainShift: integer,
  percentColdStorage: z.number(),
  percentHeated: z.number(),
  percentCooled: z.number(),
})

export type WholesaleClubUse = z.infer<typeof WholesaleClubUse>
export const WholesaleClubUse = z.object({
  reportType: z.literal(BuildingUseType.enum.WHOLESALE_CLUB),
  hasExteriorEntrance: z.boolean(),
  singleStore: z.boolean(),
  numOfFreezers: integer,
  numOfWorkersMainShift: integer,
  percentCooled: z.number(),
  percentHeated: z.number(),
  weeklyOperatingHours: integer,
})

export type WorshipFacilityUse = z.infer<typeof WorshipFacilityUse>
export const WorshipFacilityUse = z.object({
  reportType: z.literal(BuildingUseType.enum.WORSHIP_FACILITY),
  grossFloorAreaForFoodPrep: integer,
  percentCooled: z.number(),
  percentHeated: z.number(),
  seatingCapacity: integer,
  weeklyOperatingHours: integer,
})

export const BuildingUseSpecificFields = z.discriminatedUnion("reportType", [
  BankBranchUse,
  ConvenienceStoreUse,
  CourtHouseUse,
  DataCenterUse,
  DistrubutionCenterUse,
  FinancialOfficeUse,
  HospitalUse,
  HotelUse,
  MedicalOfficeUse,
  MultiFamilyHousingUse,
  OfficeUse,
  RetailStoreUse,
  SchoolUse,
  SeniorLivingUse,
  SuperMarketUse,
  VehicleDealershipUse,
  WarehouseUse,
  WarehouseRefrigeratedUse,
  WholesaleClubUse,
  WorshipFacilityUse,
] as const)

export type BuildingUseDetails = z.infer<typeof BuildingUseDetails>
export const BuildingUseDetails = BuildingUseCommonFields.and(
  BuildingUseSpecificFields
)

export const BuildingUse = z
  .object({ ID: BuildingUseId })
  .and(BuildingUseDetails)
export type BuildingUse = z.infer<typeof BuildingUse>

// Form constraints must not reject existing backend records when reading them.
export const BuildingUseFormDetails = BuildingUseDetails.superRefine(
  (details, context) => {
    for (const [name, value] of Object.entries(details)) {
      if (typeof value !== "number") {
        continue
      }

      let message: string | undefined

      if (name === "yearOfConstruction") {
        if (value < 1800) message = "Enter a year from 1800 onward"
        else if (value > new Date().getFullYear()) {
          message = "Construction year cannot be in the future"
        }
      } else if (name === "grossFloorArea" && value <= 0) {
        message = "Enter a floor area greater than zero"
      } else if (value < 0) {
        message = "Enter zero or greater"
      } else if (name.startsWith("percent") && value > 100) {
        message = "Enter a percentage from 0 to 100"
      } else if (name === "weeklyOperatingHours" && value > 168) {
        message = "Enter hours from 0 to 168"
      }

      if (message) {
        context.addIssue({ code: "custom", path: [name], message })
      }
    }
  }
)
