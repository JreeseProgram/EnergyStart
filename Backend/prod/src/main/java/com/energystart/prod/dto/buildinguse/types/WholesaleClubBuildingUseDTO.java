
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Wholesale Club building use.
 */
public record WholesaleClubBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Boolean hasExteriorEntrance,
        Boolean isSingleStore,
        Integer numOfFreezers,
        Integer numOfWorkersMainShift,
        Double percentCooled,
        Double percentHeated,
        Double weeklyOperatingHours

) implements BuildingUseDTO {

}
