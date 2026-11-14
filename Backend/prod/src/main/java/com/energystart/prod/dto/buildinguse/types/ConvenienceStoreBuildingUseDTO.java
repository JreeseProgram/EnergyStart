
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Convenience Store building use.
 *
 * Contains common building-use fields and
 * Convenience Store-specific energy information.
 */
public record ConvenienceStoreBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Double areaOfWalkInFreezer,
        Double lengthOfFreezerUnit,
        Integer numOfCookingEquipment,
        Integer numOfFullTimeWorkers,
        Integer numOfHeatingUnits,
        Double percentCooled,
        Double percentHeated

) implements BuildingUseDTO {

}
