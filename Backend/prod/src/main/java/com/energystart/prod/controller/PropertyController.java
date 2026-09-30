package com.energystart.prod.controller;

import com.energystart.prod.model.Property;
import com.energystart.prod.service.PropertyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;


    // Constructor injection
    public PropertyController(PropertyService propertyService) {

        this.propertyService = propertyService;
    }


    // ============================================================
    // CREATE
    // ============================================================

    /**
     * POST /api/properties
     *
     * Creates a new property.
     */
    @PostMapping
    public Property createProperty(@RequestBody Property property) {

        return propertyService.addProperty(property);
    }


    // ============================================================
    // READ - ALL
    // ============================================================

    /**
     * GET /api/properties
     *
     * Retrieves all properties.
     */
    @GetMapping
    public List<Property> getAllProperties() {

        return propertyService.getAllProperties();
    }


    // ============================================================
    // READ - ONE
    // ============================================================

    /**
     * GET /api/properties/{id}
     *
     * Retrieves one property by ID.
     */
    @GetMapping("/{id}")
    public Property getPropertyById(
            @PathVariable String id) {

        return propertyService.getPropertyById(id);
    }


    // ============================================================
    // UPDATE
    // ============================================================

    /**
     * PUT /api/properties/{id}
     *
     * Updates an existing property.
     */
    @PutMapping("/{id}")
    public Property updateProperty(
            @PathVariable String id,
            @RequestBody Property property) {

        return propertyService.updateProperty(id, property);
    }


    // ============================================================
    // DELETE
    // ============================================================

    /**
     * DELETE /api/properties/{id}
     *
     * Deletes an existing property.
     */
    @DeleteMapping("/{id}")
    public Property deleteProperty(
            @PathVariable String id) {

        return propertyService.deleteProperty(id);
    }
}