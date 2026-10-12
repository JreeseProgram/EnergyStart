import {
  Property,
  PropertyType,
} from "@/features/portfolio/models/property.models"
import { User } from "@/features/portfolio/models/user.models"
import { BaseEntity } from "@/models/shared.models"
import z from "zod"

export type BuildingUseType = PropertyType
export const BuildingUseType = PropertyType

export type BuildingId = z.infer<typeof BuildingId>
export const BuildingId = z.uuid().brand("BuildingId")

export type BuildingHeight = z.infer<typeof BuildingHeight>
export const BuildingHeight = z.enum([
  "LOW_RISE",
  "MID_RISE",
  "HIGH_RISE",
] as const)

export type AuditComplianceStatus = z.infer<typeof AuditComplianceStatus>
export const AuditComplianceStatus = z.enum([
  "PARTICIPATING",
  "NOT_PARTICIPATING",
  "APPROVED_FOR_EXEMPTION",
] as const)

export type BuildingUseId = z.infer<typeof BuildingUseId>
export const BuildingUseId = z.uuid().brand("BuildingUseId")

export type BuildingUse = z.infer<typeof BuildingUse>
export const BuildingUse = BaseEntity(BuildingUseId).extend({
  grossFloorArea: z.number(),
  parkingSize: z.number(),
  yearOfConstruction: z.number(),
})

export type BankBranchUse = z.infer<typeof BankBranchUse>
export const BankBranchUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.BANK_BRANCH,
  numOfWorkersMainShift: z.number(),
  numOfComputers: z.number(),
  percentCooled: z.number(),
  weeklyOperatingHours: z.number(),
})

export type ConvenienceStoreUse = z.infer<typeof ConvenienceStoreUse>
export const ConvenienceStoreUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.CONVENIENCE_STORE,
  areaOfWalkInFreezer: z.number(),
  lengthOfFreezerUnit: z.number(),
  numOfCookingEquipment: z.number(),
  numOfFullTimeWorkers: z.number(),
  numOfHeatingUnits: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type CourtHouseUse = z.infer<typeof CourtHouseUse>
export const CourtHouseUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.COURT_HOUSE,
  numOfComputers: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  weeklyOperatingHours: z.number(),
})

export type DataCenterUse = z.infer<typeof DataCenterUse>
export const DataCenterUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.DATA_CENTER,
})

export type DistrubutionCenterUse = z.infer<typeof DistrubutionCenterUse>
export const DistrubutionCenterUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.DISTRIBUTION_CENTER,
  numOfWorkersMainShift: z.number(),
  percentColdStorage: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
  weeklyOperatingHours: z.number(),
})

export type FinancialOfficeUse = z.infer<typeof FinancialOfficeUse>
export const FinancialOfficeUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.FINANCIAL_OFFICE,
  numOfComputers: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  weeklyOperatingHours: z.number(),
})

export type HospitalUse = z.infer<typeof HospitalUse>
export const HospitalUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.HOSPITAL,
  numOfFullTimeWorkers: z.number(),
  numOfMRIMachines: z.number(),
  numOfStaffedBeds: z.number(),
})

export type HotelUse = z.infer<typeof HotelUse>
export const HotelUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.HOTEL,
  hasCookingFacilities: z.boolean(),
  numCommercialFreezer: z.number(),
  numOfRooms: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type MedicalOfficeUse = z.infer<typeof MedicalOfficeUse>
export const MedicalOfficeUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.MEDICAL_OFFICE,
  numOfMRIMachines: z.number(),
  numOfSurgicalBeds: z.number(),
  numOfWorkersMainShift: z.number(),
  weeklyOperatingHours: z.number(),
})

export type MultiFamilyHousingUse = z.infer<typeof MultiFamilyHousingUse>
export const MultiFamilyHousingUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.MULTIFAMILY_HOUSING,
  BuildingHeight: BuildingHeight,
  numOfBedrooms: z.number(),
  numOfResidentialUnits: z.number(),
})

export type OfficeUse = z.infer<typeof OfficeUse>
export const OfficeUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.OFFICE,
  numOfComputers: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  weeklyOperatingHours: z.number(),
})

export type RetailStoreUse = z.infer<typeof RetailStoreUse>
export const RetailStoreUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.RETAIL_STORE,
  doesWorkWeekend: z.boolean(),
  hasCookingFacilities: z.boolean(),
  isHighSchool: z.boolean(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type SchoolUse = z.infer<typeof SchoolUse>
export const SchoolUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.SCHOOL,
  doesWorkWeekend: z.boolean(),
  hasCookingFacilities: z.boolean(),
  isHighSchool: z.boolean(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type SeniorLivingUse = z.infer<typeof SeniorLivingUse>
export const SeniorLivingUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.SENIOR_LIVING,
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
export const SuperMarketUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.SUPERMARKET,
  numOfOpenClosedFreezers: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
  weeklyOperatingHours: z.number(),
})

export type VehicleDealershipUse = z.infer<typeof VehicleDealershipUse>
export const VehicleDealershipUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.VEHICLE_DEALERSHIP,
  avgNumVehiclesInInventory: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type WarehouseUse = z.infer<typeof WarehouseUse>
export const WarehouseUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.WAREHOUSE,
  avgNumVehiclesInInventory: z.number(),
  numOfWorkersMainShift: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
})

export type WarehouseRefrigeratedUse = z.infer<typeof WarehouseRefrigeratedUse>
export const WarehouseRefrigeratedUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.WAREHOUSE_REFRIGERATED,
  weeklyOperatingHours: z.number(),
  numOfWorkersMainShift: z.number(),
  percentColdStorage: z.number(),
  percentHeated: z.number(),
  percentCooled: z.number(),
})

export type WholesaleClubUse = z.infer<typeof WholesaleClubUse>
export const WholesaleClubUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.WHOLESALE_CLUB,
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
export const WorshipFacilityUse = BuildingUse.extend({
  buildingUseType: BuildingUseType.enum.WORSHIP_FACILITY,
  grossFloorAreaForFoodPrep: z.number(),
  percentCooled: z.number(),
  percentHeated: z.number(),
  seatingCapacity: z.number(),
  weeklyOperatingHours: z.number(),
})

export type Building = z.infer<typeof Building>
export const Building = BaseEntity(BuildingId).extend({
  energyUse: z.number().optional(),
  grossFloorArea: z.number(),
  humanReadableBuildingId: z.string(),
  name: z.string(),
  notes: z.string().optional(),
  owner: User,
  parentProperty: Property,
  siteEui: z.number().optional(),
  sourceEui: z.number().optional(),
  annualGHG: z.number().optional(),
  energyStarScore: z.number().optional(),
  auditComplianceStatus:
    AuditComplianceStatus.optional().default("NOT_PARTICIPATING"),
  reportingYear: z.string(),
  buildingUses: z.array(BuildingUse).optional(),
})
