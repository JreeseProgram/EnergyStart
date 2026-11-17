
package com.energystart.prod.dto.buildinguse.types;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.dto.buildinguse.BuildingUseType;

/**
 * DTO representing a Multifamily Housing building use.
 *
 * The rise-unit fields are optional in the frontend,
 * so they use Double to preserve missing values.
 */
public record MultifamilyHousingBuildingUseDTO(

        String id,
        String createdAt,
        String propertyId,
        BuildingUseType buildingUseType,

        Double grossFloorArea,
        Double parkingSize,
        Integer yearOfConstruction,

        Double lowRiseUnits,
        Double midRiseUnits,
        Double highRiseUnits,
        Integer numOfBedrooms,
        Integer numOfResidentialUnits

) implements BuildingUseDTO {

}
