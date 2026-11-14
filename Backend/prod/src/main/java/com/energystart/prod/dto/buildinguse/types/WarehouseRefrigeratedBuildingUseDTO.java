
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Refrigerated Warehouse building use.
 */
public record WarehouseRefrigeratedBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Double weeklyOperatingHours,
        Integer numOfWorkersMainShift,
        Double percentColdStorage,
        Double percentHeated,
        Double percentCooled

) implements BuildingUseDTO {

}
