
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Distribution Center building use.
 *
 * Contains common building-use information and
 * Distribution Center-specific energy information.
 */
public record DistributionCenterBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Integer numOfWorkersMainShift,
        Double percentColdStorage,
        Double percentCooled,
        Double percentHeated,
        Double weeklyOperatingHours

) implements BuildingUseDTO {

}
