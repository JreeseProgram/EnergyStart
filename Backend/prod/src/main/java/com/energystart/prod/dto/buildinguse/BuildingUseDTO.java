
package com.energystart.prod.dto.buildinguse;

/**
 * Common API fields shared by all building-use DTOs.
 *
 * Individual building-use records will implement this interface
 * and add fields specific to their building category.
 */
public interface BuildingUseDTO {

    String id();

    String createdAt();

    String propertyId();

    BuildingUseType buildingUseType();

    Double grossFloorArea();

    Double parkingSize();

    Integer yearOfConstruction();
}
