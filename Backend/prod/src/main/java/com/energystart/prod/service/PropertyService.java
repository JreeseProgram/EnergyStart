
package com.energystart.prod.service;

import com.energystart.prod.dto.PropertyUserResponse;
import com.energystart.prod.dto.WorkOsUserResponse;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.PropertyRepo;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.ArrayList;

@Service
public class PropertyService {


    private final PropertyRepo propertyRepo;
    private final WorkOsUserService workOsUserService;

    public PropertyService(
            PropertyRepo propertyRepo,
            WorkOsUserService workOsUserService) {

        this.propertyRepo = propertyRepo;
        this.workOsUserService = workOsUserService;
    }


    public Property addProperty(Property request, String userId) {
        requireUser(userId);

        Property property = new Property(
                UUID.randomUUID().toString(),
                request.getHumanReadablePropertyId(),
                request.getPropertyName(),
                request.getStreetAddress(),
                request.getCity(),
                request.getState(),
                request.getZipcode(),
                request.getNotes()
        );

        // Grant access using the user ID from the verified token.
        property.setAuthorizedUserIds(List.of(userId));

        return copy(propertyRepo.save(property));
    }

    public List<Property> getAllProperties(String userId) {
        requireUser(userId);

        // Keep the existing list behavior: show only accessible properties.
        return propertyRepo.findAll().stream()
                .filter(property ->
                        property.getAuthorizedUserIds().contains(userId))
                .map(this::copy)
                .toList();
    }

    public Property getPropertyById(String id, String userId) {
        return copy(requireAccess(id, userId));
    }

    public Property updateProperty(
            String id, Property request, String userId) {

        Property existing = requireAccess(id, userId);

        existing.setHumanReadablePropertyId(
                request.getHumanReadablePropertyId());
        existing.setPropertyName(request.getPropertyName());
        existing.setStreetAddress(request.getStreetAddress());
        existing.setCity(request.getCity());
        existing.setState(request.getState());
        existing.setZipcode(request.getZipcode());
        existing.setNotes(request.getNotes());

        // The request cannot replace the stored ID or permissions.
        return copy(propertyRepo.save(existing));
    }

    public Property deleteProperty(String id, String userId) {
        Property existing = requireAccess(id, userId);
        propertyRepo.delete(existing);

        return copy(existing);
    }


    public List<PropertyUserResponse> getPropertyUsers(
            String propertyId,
            String requestingUserId) {

        // Confirm the user is authorized.
        Property property = requireAccess(
                propertyId, requestingUserId);

        List<PropertyUserResponse> users = new ArrayList<>();

        // Look up each assigned user in WorkOS.
        for (String userId : property.getAuthorizedUserIds()) {

            WorkOsUserResponse workOsUser =
                    workOsUserService.getUserById(userId);

            users.add(new PropertyUserResponse(
                    workOsUser.id(),
                    workOsUser.email(),
                    workOsUser.firstName(),
                    workOsUser.lastName()
            ));
        }

        return users;
    }



    public PropertyUserResponse shareProperty(
            String propertyId,
            String email,
            String requestingUserId) {

        // 1. Verify the requesting user has access.
        Property property = requireAccess(
                propertyId, requestingUserId);

        // 2. Find the WorkOS user by email.
        WorkOsUserResponse workOsUser =
                workOsUserService.getUserByEmail(email);

        // 3. Create a mutable copy of the assigned users.
        List<String> authorizedUsers = new ArrayList<>(
                property.getAuthorizedUserIds()
        );

        // 4. Prevent duplicate assignments.
        if (authorizedUsers.contains(workOsUser.id())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "User already has access to this property.");
        }

        // 5. Add the new user ID.
        authorizedUsers.add(workOsUser.id());

        // 6. Save the updated property in MongoDB.
        property.setAuthorizedUserIds(authorizedUsers);
        propertyRepo.save(property);

        // 7. Return the new user's information.
        return new PropertyUserResponse(
                workOsUser.id(),
                workOsUser.email(),
                workOsUser.firstName(),
                workOsUser.lastName()
        );
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
                original.getPropertyName(),
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
