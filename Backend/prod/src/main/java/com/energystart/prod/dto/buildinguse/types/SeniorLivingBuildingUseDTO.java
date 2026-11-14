
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Senior Living building use.
 */
public record SeniorLivingBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Integer avgNumResidents,
        Integer maxResidentCapacity,
        Integer numOfComputers,
        Integer numCommercialFreezer,
        Integer numOfCommercialWashingMachines,
        Integer numOfResidentialLifts,
        Integer numOfResidentialUnits,
        Integer numOfResidentialWashingMachines,
        Integer numOfWorkersMainShift,
        Double percentCooled,
        Double percentHeated

) implements BuildingUseDTO {

}
