package com.energystart.prod.service;

import com.energystart.prod.model.Property;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PropertyService {

    // Temporary storage until the team's MongoDB repository is connected.
    private final List<Property> properties = new ArrayList<>();

    public synchronized Property addProperty(
            Property request,
            String userId) {

        requireUser(userId);

        Property property = new Property(
                UUID.randomUUID().toString(),
                request.getHumanReadablePropertyId(),
                request.getAddress(),
                request.getNotes()
        );

        // Use the verified login ID, never an access list from the request.
        property.setAuthorizedUserIds(List.of(userId));
        properties.add(property);

        return copy(property);
    }

    public synchronized List<Property> getAllProperties(String userId) {
        requireUser(userId);

        // Each user sees only properties they can access.
        return properties.stream()
                .filter(property ->
                        property.getAuthorizedUserIds().contains(userId))
                .map(this::copy)
                .toList();
    }

    public synchronized Property getPropertyById(
            String id,
            String userId) {

        return copy(requireAccess(id, userId));
    }

    public synchronized Property updateProperty(
            String id,
            Property request,
            String userId) {

        Property existing = requireAccess(id, userId);

        existing.setHumanReadablePropertyId(
                request.getHumanReadablePropertyId());
        existing.setAddress(request.getAddress());
        existing.setNotes(request.getNotes());

        // Preserve the existing ID and access list.
        return copy(existing);
    }

    public synchronized Property deleteProperty(
            String id,
            String userId) {

        Property existing = requireAccess(id, userId);
        properties.remove(existing);

        return copy(existing);
    }

    private Property requireAccess(String id, String userId) {
        requireUser(userId);

        Property property = properties.stream()
                .filter(candidate -> candidate.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Property not found."
                ));

        if (!property.getAuthorizedUserIds().contains(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have access to this property."
            );
        }

        return property;
    }

    private void requireUser(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication is required."
            );
        }
    }

    private Property copy(Property original) {
        Property result = new Property(
                original.getId(),
                original.getHumanReadablePropertyId(),
                original.getAddress(),
                original.getNotes()
        );

        result.setAuthorizedUserIds(original.getAuthorizedUserIds());
        return result;
    }
}