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
    private String address;
    private String zipcode;
    private String notes;

    // WorkOS user IDs allowed to access this property.
    private List<String> authorizedUserIds = new ArrayList<>();

    public Property() {
    }

    // Keep the constructor used by the team's existing code.
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

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
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