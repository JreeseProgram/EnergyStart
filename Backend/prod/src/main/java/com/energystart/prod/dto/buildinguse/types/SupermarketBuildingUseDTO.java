
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Supermarket building use.
 */
public record SupermarketBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Integer numOfOpenClosedFreezers,
        Integer numOfWorkersMainShift,
        Double percentCooled,
        Double percentHeated,
        Double weeklyOperatingHours

) implements BuildingUseDTO {

}
