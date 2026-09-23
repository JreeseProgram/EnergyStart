/**
 *Class Name: Building
 * Purpose: To provide a template for the database that will hold the Building.
 * when the Mongo DB is added this class will autoconfigure what needs to be added to the
 * mongo DB database.
 *
 * Notes / Questions (rolling):
 * (Notes) Building Metrics are stored separately from the Building so that multiple metrics can be stored for one building.
 */

package com.energystart.prod.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Building {

    @Id
    private String id;

    private String property_id; // Foreign key of the property table.
    private String building_id;
    private String building_size;
    private String primaryUseType;

}
