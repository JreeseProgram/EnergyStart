/**
 * Class Name: Building
 * Purpose: To provide a template for the database that will hold Buildings.
 *
 * During the prototype phase, buildings will temporarily be stored
 * in a List inside BuildingService.
 *
 * When MongoDB is added, this class will represent a MongoDB document.
 */

package com.energystart.prod.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "buildings")
public class Building {

    @Id
    private String id;

    private String humanReadableBuildingId;

    // Connects this building to a Property
    private String propertyId;

    private Integer grossFloorArea;

    private String notes;


    // No-argument constructor
    public Building() {
    }


    // Constructor
    public Building(
            String id,
            String humanReadableBuildingId,
            String propertyId,
            Integer grossFloorArea,
            String notes) {

        this.id = id;
        this.humanReadableBuildingId = humanReadableBuildingId;
        this.propertyId = propertyId;
        this.grossFloorArea = grossFloorArea;
        this.notes = notes;
    }


    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getHumanReadableBuildingId() {
        return humanReadableBuildingId;
    }

    public void setHumanReadableBuildingId(String humanReadableBuildingId) {
        this.humanReadableBuildingId = humanReadableBuildingId;
    }


    public String getPropertyId() {
        return propertyId;
    }

    public void setPropertyId(String propertyId) {
        this.propertyId = propertyId;
    }


    public Integer getGrossFloorArea() {
        return grossFloorArea;
    }

    public void setGrossFloorArea(Integer grossFloorArea) {
        this.grossFloorArea = grossFloorArea;
    }


    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}