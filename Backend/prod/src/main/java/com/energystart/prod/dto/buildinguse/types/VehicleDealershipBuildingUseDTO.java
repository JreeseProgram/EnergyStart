
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Vehicle Dealership building use.
 */
public record VehicleDealershipBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Integer avgNumVehiclesInInventory,
        Integer numOfWorkersMainShift,
        Double percentCooled,
        Double percentHeated

) implements BuildingUseDTO {

}
