
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a School building use.
 */
public record SchoolBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Boolean doesWorkWeekend,
        Boolean hasCookingFacilities,
        Boolean isHighSchool,
        Integer numOfWorkersMainShift,
        Double percentCooled,
        Double percentHeated

) implements BuildingUseDTO {

}
