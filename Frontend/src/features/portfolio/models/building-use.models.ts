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

const BuildingUseCommonFields = z.object({
  propertyId: PropertyId,
  grossFloorArea: z.number().nonnegative(),
  parkingSize: z.number(),
  yearOfConstruction: z.number(),
})

export type BankBranchUse = z.infer<typeof BankBranchUse>
export const BankBranchUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.BANK_BRANCH),
  numOfWorkersMainShift: z.number(),
  numOfComputers: z.number(),
  percentCooled: z.number(),
  weeklyOperatingHours: z.number(),
})

export type ConvenienceStoreUse = z.infer<typeof ConvenienceStoreUse>
export const ConvenienceStoreUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.CONVENIENCE_STORE),
  areaOfWalkInFreezer: z.number(),
  lengthOfFreezerUnit: z.number(),
  numOfCookingEquipment: z.number(),
  numOfFullTimeWorkers: z.number(),
  numOfHeatingUnits: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type CourtHouseUse = z.infer<typeof CourtHouseUse>
export const CourtHouseUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.COURT_HOUSE),
  numOfComputers: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  weeklyOperatingHours: z.number(),
})

export type DataCenterUse = z.infer<typeof DataCenterUse>
export const DataCenterUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.DATA_CENTER),
})

export type DistrubutionCenterUse = z.infer<typeof DistrubutionCenterUse>
export const DistrubutionCenterUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.DISTRIBUTION_CENTER),
  numOfWorkersMainShift: z.number(),
  percentColdStorage: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
  weeklyOperatingHours: z.number(),
})

export type FinancialOfficeUse = z.infer<typeof FinancialOfficeUse>
export const FinancialOfficeUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.FINANCIAL_OFFICE),
  numOfComputers: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  weeklyOperatingHours: z.number(),
})

export type HospitalUse = z.infer<typeof HospitalUse>
export const HospitalUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.HOSPITAL),
  numOfFullTimeWorkers: z.number(),
  numOfMRIMachines: z.number(),
  numOfStaffedBeds: z.number(),
})

export type HotelUse = z.infer<typeof HotelUse>
export const HotelUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.HOTEL),
  hasCookingFacilities: z.boolean(),
  numCommercialFreezer: z.number(),
  numOfRooms: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type MedicalOfficeUse = z.infer<typeof MedicalOfficeUse>
export const MedicalOfficeUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.MEDICAL_OFFICE),
  numOfMRIMachines: z.number(),
  numOfSurgicalBeds: z.number(),
  numOfWorkersMainShift: z.number(),
  weeklyOperatingHours: z.number(),
})

export type MultiFamilyHousingUse = z.infer<typeof MultiFamilyHousingUse>
export const MultiFamilyHousingUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.MULTIFAMILY_HOUSING),
  BuildingHeight: BuildingHeight,
  numOfBedrooms: z.number(),
  numOfResidentialUnits: z.number(),
})

export type OfficeUse = z.infer<typeof OfficeUse>
export const OfficeUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.OFFICE),
  numOfComputers: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  weeklyOperatingHours: z.number(),
})

export type RetailStoreUse = z.infer<typeof RetailStoreUse>
export const RetailStoreUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.RETAIL_STORE),
  doesWorkWeekend: z.boolean(),
  hasCookingFacilities: z.boolean(),
  isHighSchool: z.boolean(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type SchoolUse = z.infer<typeof SchoolUse>
export const SchoolUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.SCHOOL),
  doesWorkWeekend: z.boolean(),
  hasCookingFacilities: z.boolean(),
  isHighSchool: z.boolean(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type SeniorLivingUse = z.infer<typeof SeniorLivingUse>
export const SeniorLivingUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.SENIOR_LIVING),
  avgNumResidents: z.number(),
  maxResidentCapacity: z.number(),
  numOfComputers: z.number(),
  numCommercialFreezer: z.number(),
  numOfCommercialWashingMachines: z.number(),
  numOfResidentialLifts: z.number(),
  numOfResidentialUnits: z.number(),
  numOfResidentialWashingMachines: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type SuperMarketUse = z.infer<typeof SuperMarketUse>
export const SuperMarketUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.SUPERMARKET),
  numOfOpenClosedFreezers: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
  weeklyOperatingHours: z.number(),
})

export type VehicleDealershipUse = z.infer<typeof VehicleDealershipUse>
export const VehicleDealershipUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.VEHICLE_DEALERSHIP),
  avgNumVehiclesInInventory: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type WarehouseUse = z.infer<typeof WarehouseUse>
export const WarehouseUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.WAREHOUSE),
  avgNumVehiclesInInventory: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type WarehouseRefrigeratedUse = z.infer<typeof WarehouseRefrigeratedUse>
export const WarehouseRefrigeratedUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.WAREHOUSE_REFRIGERATED),
  weeklyOperatingHours: z.number(),
  numOfWorkersMainShift: z.number(),
  percentColdStorage: z.number(),
  percentHeated: z.number(),
  percentCooled: z.number(),
})

export type WholesaleClubUse = z.infer<typeof WholesaleClubUse>
export const WholesaleClubUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.WHOLESALE_CLUB),
  hasExteriorEntrance: z.boolean(),
  isSingleStore: z.boolean(),
  numOfOpenClosedFreezers: z.number(),
  numOfWalkInFreezers: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
  weeklyOperatingHours: z.number(),
})

export type WorshipFacilityUse = z.infer<typeof WorshipFacilityUse>
export const WorshipFacilityUse = z.object({
  buildingUseType: z.literal(BuildingUseType.enum.WORSHIP_FACILITY),
  grossFloorAreaForFoodPrep: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
  seatingCapacity: z.number(),
  weeklyOperatingHours: z.number(),
})

const BuildingUseSpecificFields = z.discriminatedUnion("buildingUseType", [
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

export const BuildingUse = BaseEntity(BuildingUseId).and(BuildingUseDetails)
export type BuildingUse = z.infer<typeof BuildingUse>
