
package com.energystart.prod;

import com.energystart.prod.model.Property;
import com.energystart.prod.repos.PropertyRepo;
import com.energystart.prod.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class PropertyServiceTests {

    private PropertyRepo propertyRepo;
    private PropertyService service;

    // Simulates documents stored in MongoDB.
    private Map<String, Property> storedProperties;

    @BeforeEach
    void setUp() {
        propertyRepo = mock(PropertyRepo.class);
        storedProperties = new HashMap<>();
        service = new PropertyService(propertyRepo);

        when(propertyRepo.save(any(Property.class)))
                .thenAnswer(invocation -> {
                    Property property = invocation.getArgument(0);
                    Property stored = copy(property);
                    storedProperties.put(stored.getId(), stored);
                    return copy(stored);
                });

        when(propertyRepo.findById(anyString()))
                .thenAnswer(invocation -> {
                    String id = invocation.getArgument(0);
                    Property stored = storedProperties.get(id);
                    return Optional.ofNullable(stored).map(this::copy);
                });

        when(propertyRepo.findByAuthorizedUserIdsContaining(anyString()))
                .thenAnswer(invocation -> {
                    String userId = invocation.getArgument(0);
                    return storedProperties.values().stream()
                            .filter(property ->
                                    property.getAuthorizedUserIds().contains(userId))
                            .map(this::copy)
                            .toList();
                });

        doAnswer(invocation -> {
            Property property = invocation.getArgument(0);
            storedProperties.remove(property.getId());
            return null;
        }).when(propertyRepo).delete(any(Property.class));
    }

    private Property request() {
        return new Property(
                null, 1001, "123 Main Street",
                "Orlando", "FL", 32801, "Test property");
    }

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

    @Test
    void creatorGetsAccessAndSubmittedAccessListIsIgnored() {
        Property request = request();
        request.setId("submitted-id");
        request.setAuthorizedUserIds(List.of("user_other"));

        Property created = service.addProperty(request, "user_owner");
        Property stored = service.getPropertyById(
                created.getId(), "user_owner");

        assertNotNull(created.getId());
        assertNotEquals("submitted-id", created.getId());
        assertEquals(List.of("user_owner"), created.getAuthorizedUserIds());
        assertEquals(created.getId(), stored.getId());
        assertEquals("123 Main Street", stored.getStreetAddress());
        assertEquals("Orlando", stored.getCity());
        assertEquals("FL", stored.getState());
        assertEquals(Integer.valueOf(32801), stored.getZipcode());

        verify(propertyRepo).save(any(Property.class));
    }

    @Test
    void propertyListOnlyIncludesUsersOwnProperties() {
        Property ownerProperty = service.addProperty(request(), "user_owner");
        service.addProperty(request(), "user_other");

        List<Property> visible = service.getAllProperties("user_owner");

        assertEquals(1, visible.size());
        assertEquals(ownerProperty.getId(), visible.get(0).getId());

        verify(propertyRepo)
                .findByAuthorizedUserIdsContaining("user_owner");
    }

    @Test
    void anotherUserCannotViewProperty() {
        Property created = service.addProperty(request(), "user_owner");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.getPropertyById(created.getId(), "user_other"));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    void anotherUserCannotEditOrGiveThemselvesAccess() {
        Property created = service.addProperty(request(), "user_owner");
        Property update = request();
        update.setStreetAddress("Unauthorized change");
        update.setAuthorizedUserIds(List.of("user_other"));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.updateProperty(
                        created.getId(), update, "user_other"));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());

        Property stored = service.getPropertyById(
                created.getId(), "user_owner");

        assertEquals("123 Main Street", stored.getStreetAddress());
        assertEquals(List.of("user_owner"), stored.getAuthorizedUserIds());

        // Only the initial creation should have saved.
        verify(propertyRepo, times(1)).save(any(Property.class));
    }

    @Test
    void anotherUserCannotDeleteProperty() {
        Property created = service.addProperty(request(), "user_owner");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.deleteProperty(created.getId(), "user_other"));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        assertNotNull(service.getPropertyById(created.getId(), "user_owner"));

        verify(propertyRepo, never()).delete(any(Property.class));
    }

    @Test
    void authorizedUpdatePreservesIdAndAccessList() {
        Property created = service.addProperty(request(), "user_owner");
        Property update = request();
        update.setId("replacement-id");
        update.setStreetAddress("456 Updated Street");
        update.setCity("Miami");
        update.setState("FL");
        update.setZipcode(33101);
        update.setAuthorizedUserIds(List.of("user_other"));

        Property updated = service.updateProperty(
                created.getId(), update, "user_owner");
        Property stored = service.getPropertyById(
                created.getId(), "user_owner");

        assertEquals(created.getId(), updated.getId());
        assertEquals("456 Updated Street", stored.getStreetAddress());
        assertEquals("Miami", stored.getCity());
        assertEquals("FL", stored.getState());
        assertEquals(Integer.valueOf(33101), stored.getZipcode());
        assertEquals(List.of("user_owner"), stored.getAuthorizedUserIds());

        verify(propertyRepo, times(2)).save(any(Property.class));
    }

    @Test
    void authorizedUserCanDeleteProperty() {
        Property created = service.addProperty(request(), "user_owner");
        service.deleteProperty(created.getId(), "user_owner");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.getPropertyById(created.getId(), "user_owner"));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());

        verify(propertyRepo).delete(any(Property.class));
    }

    @Test
    void changingReturnedObjectDoesNotChangeStoredPermissions() {
        Property created = service.addProperty(request(), "user_owner");
        created.setAuthorizedUserIds(List.of("user_other"));

        Property stored = service.getPropertyById(
                created.getId(), "user_owner");

        assertEquals(List.of("user_owner"), stored.getAuthorizedUserIds());
    }

    @Test
    void missingUserIsRejected() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.addProperty(request(), ""));

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());

        verify(propertyRepo, never()).save(any(Property.class));
    }
}
