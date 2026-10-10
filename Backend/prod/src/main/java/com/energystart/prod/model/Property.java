package com.energystart.prod.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

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

    // WorkOS user IDs allowed to access this property.
    private List<String> authorizedUserIds = new ArrayList<>();

    public Property() {
    }

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

    public List<String> getAuthorizedUserIds() {
        // Return a copy to protect the stored permissions.
        return authorizedUserIds == null
                ? new ArrayList<>()
                : new ArrayList<>(authorizedUserIds);
    }

    public void setAuthorizedUserIds(List<String> authorizedUserIds) {
        this.authorizedUserIds = authorizedUserIds == null
                ? new ArrayList<>()
                : new ArrayList<>(authorizedUserIds);
    }
}
