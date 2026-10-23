package com.energystart.prod.controller;

import com.energystart.prod.model.Property;
import com.energystart.prod.service.PropertyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

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

    // Return a JSON message when property access is denied.
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handlePropertyAccessError(
            ResponseStatusException exception) {

        if (!exception.getStatusCode().equals(HttpStatus.FORBIDDEN)) {
            throw exception;
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of(
                        "status", 403,
                        "message", "You do not have access to this property."
                ));
    }
}