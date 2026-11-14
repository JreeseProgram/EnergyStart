
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Hotel building use.
 *
 * Contains common building-use fields and
 * Hotel-specific energy information.
 */
public record HotelBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Boolean hasCookingFacilities,
        Integer numCommercialFreezer,
        Integer numOfRooms,
        Integer numOfWorkersMainShift,
        Double percentCooled,
        Double percentHeated

) implements BuildingUseDTO {

}
