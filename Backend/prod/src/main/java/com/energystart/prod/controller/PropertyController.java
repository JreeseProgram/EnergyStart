package com.energystart.prod.controller;

import com.energystart.prod.model.Property;
import com.energystart.prod.service.PropertyService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

        return propertyService.addProperty(property, jwt.getSubject());
    }

    @GetMapping
    public List<Property> getAllProperties(
            @AuthenticationPrincipal Jwt jwt) {

        return propertyService.getAllProperties(jwt.getSubject());
    }

    @GetMapping("/{id}")
    public Property getPropertyById(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {

        return propertyService.getPropertyById(id, jwt.getSubject());
    }

    @PutMapping("/{id}")
    public Property updateProperty(
            @PathVariable String id,
            @RequestBody Property property,
            @AuthenticationPrincipal Jwt jwt) {

        return propertyService.updateProperty(
                id,
                property,
                jwt.getSubject()
        );
    }

    @DeleteMapping("/{id}")
    public Property deleteProperty(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {

        return propertyService.deleteProperty(id, jwt.getSubject());
    }
}