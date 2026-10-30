import {
  PropertyId,
  PropertyType,
} from "@/features/portfolio/models/property.models"
import { BaseEntity } from "@/models/shared.models"
import z from "zod"

export type BuildingUseType = PropertyType
export const BuildingUseType = PropertyType

export type BuildingHeight = z.infer<typeof BuildingHeight>
export const BuildingHeight = z.enum([
  "LOW_RISE",
  "MID_RISE",
  "HIGH_RISE",
] as const)

export type BuildingUseId = z.infer<typeof BuildingUseId>
export const BuildingUseId = z.uuid().brand("BuildingUseId")

const nonnegativeNumber = z
  .number("Enter a number")
  .nonnegative("Enter zero or greater")
const count = nonnegativeNumber.int("Enter a whole number")
const percentage = nonnegativeNumber.max(
  100,
  "Enter a percentage from 0 to 100"
)
const weeklyHours = nonnegativeNumber.max(168, "Enter hours from 0 to 168")

export const BuildingUseCommonFields = z.object({
  propertyId: PropertyId,
  grossFloorArea: nonnegativeNumber,
  parkingSize: nonnegativeNumber,
  yearOfConstruction: z
    .number("Enter a year")
    .int("Enter a whole year")
    .positive("Enter a valid year")
    .refine(
      (year) => year <= new Date().getFullYear(),
      "Construction year cannot be in the future"
    ),
})

export type BankBranchUse = z.infer<typeof BankBranchUse>
export const BankBranchUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.BANK_BRANCH),
  numOfWorkersMainShift: count,
  numOfComputers: count,
  percentCooled: percentage,
  weeklyOperatingHours: weeklyHours,
})

export type ConvenienceStoreUse = z.infer<typeof ConvenienceStoreUse>
export const ConvenienceStoreUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.CONVENIENCE_STORE),
  areaOfWalkInFreezer: nonnegativeNumber,
  lengthOfFreezerUnit: nonnegativeNumber,
  numOfCookingEquipment: count,
  numOfFullTimeWorkers: count,
  numOfHeatingUnits: count,
  percentCooled: percentage,
  percentHeated: percentage,
})

export type CourtHouseUse = z.infer<typeof CourtHouseUse>
export const CourtHouseUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.COURT_HOUSE),
  numOfComputers: count,
  numOfWorkersMainShift: count,
  percentCooled: percentage,
  weeklyOperatingHours: weeklyHours,
})

export type DataCenterUse = z.infer<typeof DataCenterUse>
export const DataCenterUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.DATA_CENTER),
})

export type DistrubutionCenterUse = z.infer<typeof DistrubutionCenterUse>
export const DistrubutionCenterUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.DISTRIBUTION_CENTER),
  numOfWorkersMainShift: count,
  percentColdStorage: percentage,
  percentCooled: percentage,
  percentHeated: percentage,
  weeklyOperatingHours: weeklyHours,
})

export type FinancialOfficeUse = z.infer<typeof FinancialOfficeUse>
export const FinancialOfficeUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.FINANCIAL_OFFICE),
  numOfComputers: count,
  numOfWorkersMainShift: count,
  percentCooled: percentage,
  weeklyOperatingHours: weeklyHours,
})

export type HospitalUse = z.infer<typeof HospitalUse>
export const HospitalUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.HOSPITAL),
  numOfFullTimeWorkers: count,
  numOfMRIMachines: count,
  numOfStaffedBeds: count,
})

export type HotelUse = z.infer<typeof HotelUse>
export const HotelUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.HOTEL),
  hasCookingFacilities: z.boolean(),
  numCommercialFreezer: count,
  numOfRooms: count,
  numOfWorkersMainShift: count,
  percentCooled: percentage,
  percentHeated: percentage,
})

export type MedicalOfficeUse = z.infer<typeof MedicalOfficeUse>
export const MedicalOfficeUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.MEDICAL_OFFICE),
  numOfMRIMachines: count,
  numOfSurgicalBeds: count,
  numOfWorkersMainShift: count,
  weeklyOperatingHours: weeklyHours,
})

export type MultiFamilyHousingUse = z.infer<typeof MultiFamilyHousingUse>
export const MultiFamilyHousingUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.MULTIFAMILY_HOUSING),
  BuildingHeight: BuildingHeight,
  numOfBedrooms: count,
  numOfResidentialUnits: count,
})

export type OfficeUse = z.infer<typeof OfficeUse>
export const OfficeUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.OFFICE),
  numOfComputers: count,
  numOfWorkersMainShift: count,
  percentCooled: percentage,
  weeklyOperatingHours: weeklyHours,
})

export type RetailStoreUse = z.infer<typeof RetailStoreUse>
export const RetailStoreUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.RETAIL_STORE),
  doesWorkWeekend: z.boolean(),
  hasCookingFacilities: z.boolean(),
  isHighSchool: z.boolean(),
  numOfWorkersMainShift: count,
  percentCooled: percentage,
  percentHeated: percentage,
})

export type SchoolUse = z.infer<typeof SchoolUse>
export const SchoolUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.SCHOOL),
  doesWorkWeekend: z.boolean(),
  hasCookingFacilities: z.boolean(),
  isHighSchool: z.boolean(),
  numOfWorkersMainShift: count,
  percentCooled: percentage,
  percentHeated: percentage,
})

export type SeniorLivingUse = z.infer<typeof SeniorLivingUse>
export const SeniorLivingUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.SENIOR_LIVING),
  avgNumResidents: nonnegativeNumber,
  maxResidentCapacity: count,
  numOfComputers: count,
  numCommercialFreezer: count,
  numOfCommercialWashingMachines: count,
  numOfResidentialLifts: count,
  numOfResidentialUnits: count,
  numOfResidentialWashingMachines: count,
  numOfWorkersMainShift: count,
  percentCooled: percentage,
  percentHeated: percentage,
})

export type SuperMarketUse = z.infer<typeof SuperMarketUse>
export const SuperMarketUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.SUPERMARKET),
  numOfOpenClosedFreezers: count,
  numOfWorkersMainShift: count,
  percentCooled: percentage,
  percentHeated: percentage,
  weeklyOperatingHours: weeklyHours,
})

export type VehicleDealershipUse = z.infer<typeof VehicleDealershipUse>
export const VehicleDealershipUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.VEHICLE_DEALERSHIP),
  avgNumVehiclesInInventory: nonnegativeNumber,
  numOfWorkersMainShift: count,
  percentCooled: percentage,
  percentHeated: percentage,
})

export type WarehouseUse = z.infer<typeof WarehouseUse>
export const WarehouseUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.WAREHOUSE),
  avgNumVehiclesInInventory: nonnegativeNumber,
  numOfWorkersMainShift: count,
  percentCooled: percentage,
  percentHeated: percentage,
})

export type WarehouseRefrigeratedUse = z.infer<typeof WarehouseRefrigeratedUse>
export const WarehouseRefrigeratedUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.WAREHOUSE_REFRIGERATED),
  weeklyOperatingHours: weeklyHours,
  numOfWorkersMainShift: count,
  percentColdStorage: percentage,
  percentHeated: percentage,
  percentCooled: percentage,
})

export type WholesaleClubUse = z.infer<typeof WholesaleClubUse>
export const WholesaleClubUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.WHOLESALE_CLUB),
  hasExteriorEntrance: z.boolean(),
  isSingleStore: z.boolean(),
  numOfOpenClosedFreezers: count,
  numOfWalkInFreezers: count,
  numOfWorkersMainShift: count,
  percentCooled: percentage,
  percentHeated: percentage,
  weeklyOperatingHours: weeklyHours,
})

export type WorshipFacilityUse = z.infer<typeof WorshipFacilityUse>
export const WorshipFacilityUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.WORSHIP_FACILITY),
  grossFloorAreaForFoodPrep: nonnegativeNumber,
  percentCooled: percentage,
  percentHeated: percentage,
  seatingCapacity: count,
  weeklyOperatingHours: weeklyHours,
})

export const BuildingUseSpecificFields = z.discriminatedUnion(
  "buildingUseType",
  [
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
  ] as const
)

export type BuildingUseDetails = z.infer<typeof BuildingUseDetails>
export const BuildingUseDetails = BuildingUseCommonFields.and(
  BuildingUseSpecificFields
)

export const BuildingUse = BaseEntity(BuildingUseId).and(BuildingUseDetails)
export type BuildingUse = z.infer<typeof BuildingUse>
