
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Bank Branch building use.
 *
 * Contains common building-use fields and
 * fields specific to bank branches.
 */
public record BankBranchBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Integer numOfWorkersMainShift,
        Integer numOfComputers,
        Double percentCooled,
        Double weeklyOperatingHours

) implements BuildingUseDTO {

}
