
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Court House building use.
 *
 * Includes the common building-use fields
 * and the fields specific to court houses.
 */
public record CourtHouseBuildingUseDTO(

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
