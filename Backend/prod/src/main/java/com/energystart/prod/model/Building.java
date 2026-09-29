package com.energystart.prod.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Building {

    @Id
    private String id;

    private String property_id;
    private String building_id;
    private String building_size;
    private String primaryUseType;
    private Double grossFloorArea;

    // Needed when Spring reads a building from a JSON request.
    public Building() {
    }

    // Keep this constructor because the existing team code uses it.
    public Building(String id, String property_id, String building_id,
                    String building_size, String primaryUseType) {
        this.id = id;
        this.property_id = property_id;
        this.building_id = building_id;
        this.building_size = building_size;
        this.primaryUseType = primaryUseType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProperty_id() {
        return property_id;
    }

    public void setProperty_id(String property_id) {
        this.property_id = property_id;
    }

    public String getBuilding_id() {
        return building_id;
    }

    public void setBuilding_id(String building_id) {
        this.building_id = building_id;
    }

    public String getBuilding_size() {
        return building_size;
    }

    public void setBuilding_size(String building_size) {
        this.building_size = building_size;
    }

    public String getPrimaryUseType() {
        return primaryUseType;
    }

    public void setPrimaryUseType(String primaryUseType) {
        this.primaryUseType = primaryUseType;
    }
    public Double getGrossFloorArea() { return grossFloorArea; }
    public void setGrossFloorArea(Double grossFloorArea) { this.grossFloorArea = grossFloorArea; }
}
