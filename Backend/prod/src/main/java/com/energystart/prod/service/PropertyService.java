
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

    public PropertyService(PropertyRepo propertyRepo) {
        this.propertyRepo = propertyRepo;
    }

    // CREATE: the authenticated creator receives access,
    // regardless of submitted permissions.
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

        // Grant access using the authenticated user's ID.
        // Do not trust permissions submitted in the request.
        property.setAuthorizedUserIds(List.of(userId));

        return copy(propertyRepo.save(property));
    }

    // READ ALL: query only properties that the authenticated user can access.
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

    // UPDATE: never allow the request to replace the stored ID or access list.
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

        // The request cannot replace the stored ID or permissions.
        return copy(propertyRepo.save(existing));
    }

    // DELETE
    public Property deleteProperty(String id, String userId) {
        Property existing = requireAccess(id, userId);

        propertyRepo.delete(existing);

        return copy(existing);
    }

    // Check both the property ID and authorized user in the repository query.
    private Property requireAccess(String id, String userId) {
        requireUser(userId);

        // MongoDB checks the property ID and authorized-user list together.
        return propertyRepo
                .findByIdAndAuthorizedUserIdsContaining(id, userId)
                .orElseThrow(() -> {

                    // Preserve the existing 403 and 404 responses.
                    if (propertyRepo.existsById(id)) {
                        return new ResponseStatusException(
                                HttpStatus.FORBIDDEN,
                                "You do not have access to this property.");
                    }

                    return new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Property not found.");
                });
    }

    // Require a nonempty authenticated user ID.
    private void requireUser(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication is required.");
        }
    }

    // Return a separate object rather than exposing the repository entity directly.
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

        result.setAuthorizedUserIds(
                original.getAuthorizedUserIds() == null
                        ? List.of()
                        : List.copyOf(original.getAuthorizedUserIds())
        );

        return result;
    }
}
