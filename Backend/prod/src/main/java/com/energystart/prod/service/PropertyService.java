
package com.energystart.prod.service;

import com.energystart.prod.model.Property;
import com.energystart.prod.repos.PropertyRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class PropertyService {

    private final PropertyRepo propertyRepo;

    // Constructor injection for MongoDB repository.
    public PropertyService(PropertyRepo propertyRepo) {
        this.propertyRepo = propertyRepo;
    }

    // CREATE
    public Property addProperty(Property request, String userId) {
        requireUser(userId);

        Property property = new Property(
                UUID.randomUUID().toString(),
                request.getHumanReadablePropertyId(),
                request.getStreetAddress(),
                request.getCity(),
                request.getState(),
                request.getZipcode(),
                request.getNotes()
        );

        // Grant access to the authenticated creator.
        // Do not trust permissions submitted in the request.
        property.setAuthorizedUserIds(List.of(userId));

        Property saved = propertyRepo.save(property);
        return copy(saved);
    }

    // READ ALL - only properties authorized for this user.
    public List<Property> getAllProperties(String userId) {
        requireUser(userId);

        return propertyRepo.findByAuthorizedUserIdsContaining(userId)
                .stream()
                .map(this::copy)
                .toList();
    }

    // READ ONE
    public Property getPropertyById(String id, String userId) {
        return copy(requireAccess(id, userId));
    }

    // UPDATE
    public Property updateProperty(
            String id, Property request, String userId) {

        Property existing = requireAccess(id, userId);

        existing.setHumanReadablePropertyId(
                request.getHumanReadablePropertyId());
        existing.setStreetAddress(request.getStreetAddress());
        existing.setCity(request.getCity());
        existing.setState(request.getState());
        existing.setZipcode(request.getZipcode());
        existing.setNotes(request.getNotes());

        // Preserve the existing ID and access permissions.
        Property saved = propertyRepo.save(existing);
        return copy(saved);
    }

    // DELETE
    public Property deleteProperty(String id, String userId) {
        Property existing = requireAccess(id, userId);

        propertyRepo.delete(existing);

        return copy(existing);
    }

    // Check property access.
    private Property requireAccess(String id, String userId) {
        requireUser(userId);

        Property property = propertyRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Property not found."));

        if (!property.getAuthorizedUserIds().contains(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have access to this property.");
        }

        return property;
    }

    // Require an authenticated user ID.
    private void requireUser(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication is required.");
        }
    }

    // Return a separate copy of the property.
    private Property copy(Property original) {
        Property result = new Property(
                original.getId(),
                original.getHumanReadablePropertyId(),
                original.getStreetAddress(),
                original.getCity(),
                original.getState(),
                original.getZipcode(),
                original.getNotes()
        );

        result.setAuthorizedUserIds(original.getAuthorizedUserIds());
        return result;
    }
}
