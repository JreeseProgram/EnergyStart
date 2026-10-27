package com.energystart.prod.controller;

import com.energystart.prod.model.Property;
import com.energystart.prod.service.PropertyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public Property createProperty(
            @RequestBody Property property,
            @AuthenticationPrincipal Jwt jwt) {
        return propertyService.addProperty(property, requireUserId(jwt));
    }

    @GetMapping
    public List<Property> getAllProperties(
            @AuthenticationPrincipal Jwt jwt) {
        return propertyService.getAllProperties(requireUserId(jwt));
    }

    @GetMapping("/{id}")
    public Property getPropertyById(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        return propertyService.getPropertyById(id, requireUserId(jwt));
    }

    @PutMapping("/{id}")
    public Property updateProperty(
            @PathVariable String id,
            @RequestBody Property property,
            @AuthenticationPrincipal Jwt jwt) {

        return propertyService.updateProperty(
                id,
                property,
                requireUserId(jwt)
        );
    }

    @DeleteMapping("/{id}")
    public Property deleteProperty(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        return propertyService.deleteProperty(id, requireUserId(jwt));
    }

    private String requireUserId(Jwt jwt) {
        if (jwt == null
                || jwt.getSubject() == null
                || jwt.getSubject().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication is required.");
        }

        return jwt.getSubject();
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