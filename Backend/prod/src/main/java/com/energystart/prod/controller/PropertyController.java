
package com.energystart.prod.controller;

import com.energystart.prod.model.Property;
import com.energystart.prod.service.PropertyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    // Temporary development identity.
    // Replace with authenticated user identity before deployment.
    private static final String TEST_USER_ID = "sample_user_001";

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public Property createProperty(@RequestBody Property property) {
        return propertyService.addProperty(property, TEST_USER_ID);
    }

    @GetMapping
    public List<Property> getAllProperties() {
        return propertyService.getAllProperties(TEST_USER_ID);
    }

    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable String id) {
        return propertyService.getPropertyById(id, TEST_USER_ID);
    }

    @PutMapping("/{id}")
    public Property updateProperty(
            @PathVariable String id,
            @RequestBody Property property) {

        return propertyService.updateProperty(
                id,
                property,
                TEST_USER_ID
        );
    }

    @DeleteMapping("/{id}")
    public Property deleteProperty(@PathVariable String id) {
        return propertyService.deleteProperty(id, TEST_USER_ID);
    }
}
