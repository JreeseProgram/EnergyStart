
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Financial Office building use.
 */
public record FinancialOfficeBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Integer numOfComputers,
        Integer numOfWorkersMainShift,
        Double percentCooled,
        Double weeklyOperatingHours

) implements BuildingUseDTO {

}
