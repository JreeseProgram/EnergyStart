
package com.energystart.prod.dto.buildinguse;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import com.energystart.prod.dto.buildinguse.types.*;

/**
 * Common API fields shared by all building-use DTOs.
 *
 * Jackson uses buildingUseType to select the correct DTO record.
 */
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.EXISTING_PROPERTY,
        property = "buildingUseType",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(
                value = BankBranchBuildingUseDTO.class,
                name = "BANK_BRANCH"
        ),
        @JsonSubTypes.Type(
                value = ConvenienceStoreBuildingUseDTO.class,
                name = "CONVENIENCE_STORE"
        ),
        @JsonSubTypes.Type(
                value = CourtHouseBuildingUseDTO.class,
                name = "COURT_HOUSE"
        ),
        @JsonSubTypes.Type(
                value = DataCenterBuildingUseDTO.class,
                name = "DATA_CENTER"
        ),
        @JsonSubTypes.Type(
                value = DistributionCenterBuildingUseDTO.class,
                name = "DISTRIBUTION_CENTER"
        ),
        @JsonSubTypes.Type(
                value = FinancialOfficeBuildingUseDTO.class,
                name = "FINANCIAL_OFFICE"
        ),
        @JsonSubTypes.Type(
                value = HospitalBuildingUseDTO.class,
                name = "HOSPITAL"
        ),
        @JsonSubTypes.Type(
                value = HotelBuildingUseDTO.class,
                name = "HOTEL"
        ),
        @JsonSubTypes.Type(
                value = MedicalOfficeBuildingUseDTO.class,
                name = "MEDICAL_OFFICE"
        ),
        @JsonSubTypes.Type(
                value = MultifamilyHousingBuildingUseDTO.class,
                name = "MULTIFAMILY_HOUSING"
        ),
        @JsonSubTypes.Type(
                value = OfficeBuildingUseDTO.class,
                name = "OFFICE"
        ),
        @JsonSubTypes.Type(
                value = RetailStoreBuildingUseDTO.class,
                name = "RETAIL_STORE"
        ),
        @JsonSubTypes.Type(
                value = SchoolBuildingUseDTO.class,
                name = "SCHOOL"
        ),
        @JsonSubTypes.Type(
                value = SeniorLivingBuildingUseDTO.class,
                name = "SENIOR_LIVING"
        ),
        @JsonSubTypes.Type(
                value = SupermarketBuildingUseDTO.class,
                name = "SUPERMARKET"
        ),
        @JsonSubTypes.Type(
                value = VehicleDealershipBuildingUseDTO.class,
                name = "VEHICLE_DEALERSHIP"
        ),
        @JsonSubTypes.Type(
                value = WarehouseBuildingUseDTO.class,
                name = "WAREHOUSE"
        ),
        @JsonSubTypes.Type(
                value = WarehouseRefrigeratedBuildingUseDTO.class,
                name = "WAREHOUSE_REFRIGERATED"
        ),
        @JsonSubTypes.Type(
                value = WholesaleClubBuildingUseDTO.class,
                name = "WHOLESALE_CLUB"
        ),
        @JsonSubTypes.Type(
                value = WorshipFacilityBuildingUseDTO.class,
                name = "WORSHIP_FACILITY"
        )
})
public interface BuildingUseDTO {

    String id();

    String createdAt();

    String propertyId();

    BuildingUseType buildingUseType();

    Double grossFloorArea();

    Double parkingSize();

    Integer yearOfConstruction();
}
