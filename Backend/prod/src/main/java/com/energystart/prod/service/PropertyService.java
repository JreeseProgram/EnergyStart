package com.energystart.prod.service;

import com.energystart.prod.model.Property;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PropertyService {

    /*
     * Temporary list used as our prototype database.
     *
     * Later this List will be replaced with a MongoDB repository.
     */
    private final List<Property> properties = new ArrayList<>();


    // ============================================================
    // TEST DATA
    // ============================================================

    public PropertyService() {

        Property property1 = new Property(
                "1",
                1001,
                "123 Main Street, Orlando, FL 32801",
                "Downtown commercial property."
        );

        Property property2 = new Property(
                "2",
                1002,
                "456 Orange Avenue, Orlando, FL 32801",
                "Office building."
        );

        Property property3 = new Property(
                "3",
                1003,
                "789 Colonial Drive, Orlando, FL 32803",
                "Multi-purpose commercial property."
        );

        Property property4 = new Property(
                "4",
                1004,
                "2500 International Drive, Orlando, FL 32819",
                "Large commercial property."
        );


        // Add test properties to our temporary database
        properties.add(property1);
        properties.add(property2);
        properties.add(property3);
        properties.add(property4);
    }


    // ============================================================
    // CREATE
    // ============================================================

    /**
     * Creates a new property.
     *
     * POST /api/properties
     */
    public Property addProperty(Property property) {

        properties.add(property);

        return property;
    }


    // ============================================================
    // READ - ALL
    // ============================================================

    /**
     * Retrieves all properties.
     *
     * GET /api/properties
     */
    public List<Property> getAllProperties() {

        return properties;
    }


    // ============================================================
    // READ - ONE
    // ============================================================

    /**
     * Retrieves one property by its MongoDB-style ID.
     *
     * GET /api/properties/{id}
     */
    public Property getPropertyById(String id) {

        for (Property property : properties) {

            if (property.getId().equals(id)) {

                return property;
            }
        }

        return null;
    }


    // ============================================================
    // UPDATE
    // ============================================================

    /**
     * Updates an existing property.
     *
     * PUT /api/properties/{id}
     */
    public Property updateProperty(
            String id,
            Property updatedProperty) {

        for (int i = 0; i < properties.size(); i++) {

            Property existingProperty = properties.get(i);

            if (existingProperty.getId().equals(id)) {

                /*
                 * Make sure the ID from the URL remains the ID
                 * of the property being updated.
                 */
                updatedProperty.setId(id);

                properties.set(i, updatedProperty);

                return updatedProperty;
            }
        }

        return null;
    }


    // ============================================================
    // DELETE
    // ============================================================

    /**
     * Deletes an existing property.
     *
     * DELETE /api/properties/{id}
     */
    public Property deleteProperty(String id) {

        for (int i = 0; i < properties.size(); i++) {

            Property property = properties.get(i);

            if (property.getId().equals(id)) {

                properties.remove(i);

                return property;
            }
        }

        return null;
    }
}