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

    private String streetAddress;
    private String city;
    private String state;
    private Integer zipcode;

    private String notes;


    // No-argument constructor
    public Property() {
    }


    // Constructor
    public Property(
            String id,
            Integer humanReadablePropertyId,
            String streetAddress,
            String city,
            String state,
            Integer zipcode,
            String notes) {

        this.id = id;
        this.humanReadablePropertyId = humanReadablePropertyId;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
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


    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Integer getZipcode() {
        return zipcode;
    }

    public void setZipcode(Integer zipcode) {
        this.zipcode = zipcode;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}