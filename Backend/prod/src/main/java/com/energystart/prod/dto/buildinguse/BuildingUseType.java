
package com.energystart.prod.dto.buildinguse;

/**
 * Defines the building-use categories recognized by the frontend.
 *
 * These values match the frontend BuildingUseType discriminator.
 * They are used by BuildingUse DTOs and mapped to the existing
 * EnergyReport subclasses.
 */
public enum BuildingUseType {

    BANK_BRANCH,
    CONVENIENCE_STORE,
    COURT_HOUSE,
    DATA_CENTER,
    DISTRIBUTION_CENTER,
    FINANCIAL_OFFICE,
    HOSPITAL,
    HOTEL,
    MEDICAL_OFFICE,
    MULTIFAMILY_HOUSING,
    OFFICE,
    RETAIL_STORE,
    SCHOOL,
    SENIOR_LIVING,
    SUPERMARKET,
    VEHICLE_DEALERSHIP,
    WAREHOUSE,
    WAREHOUSE_REFRIGERATED,
    WHOLESALE_CLUB,
    WORSHIP_FACILITY
}
