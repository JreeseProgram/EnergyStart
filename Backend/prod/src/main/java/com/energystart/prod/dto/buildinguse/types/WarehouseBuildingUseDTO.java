
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Warehouse building use.
 *
 * Uses the correct WarehouseReport fields rather than
 * the Vehicle Dealership fields currently in the frontend schema.
 */
public record WarehouseBuildingUseDTO(

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
