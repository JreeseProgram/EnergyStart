/**
 * Class Name: Property
 * Purpose: To provide a template for the database that will hold
 *          Property documents.
 *
 * During the prototype phase, properties will temporarily be
 * stored in a List inside PropertyService.
 *
 * When MongoDB is added, this class will represent a MongoDB document.
 */

package com.energystart.prod.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "properties")
public class Property {

    @Id
    private String id;

    private Integer humanReadablePropertyId;

    private String address;
    
    private String zipcode;

    private String notes;


    // No-argument constructor
    public Property() {
    }


    // Constructor
    public Property(
            String id,
            Integer humanReadablePropertyId,
            String address,
            String notes) {

        this.id = id;
        this.humanReadablePropertyId = humanReadablePropertyId;
        this.address = address;
        this.notes = notes;
    }


    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public Integer getHumanReadablePropertyId() {
        return humanReadablePropertyId;
    }

    public void setHumanReadablePropertyId(Integer humanReadablePropertyId) {
        this.humanReadablePropertyId = humanReadablePropertyId;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }
}