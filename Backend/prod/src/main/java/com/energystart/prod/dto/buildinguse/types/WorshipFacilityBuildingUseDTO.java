
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Worship Facility building use.
 */
public record WorshipFacilityBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Double grossFloorAreaForFoodPrep,
        Double percentCooled,
        Double percentHeated,
        Integer seatingCapacity,
        Double weeklyOperatingHours

) implements BuildingUseDTO {

}
