
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Medical Office building use.
 */
public record MedicalOfficeBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Integer numOfMRIMachines,
        Integer numOfSurgicalBeds,
        Integer numOfWorkersMainShift,
        Double weeklyOperatingHours

) implements BuildingUseDTO {

}
