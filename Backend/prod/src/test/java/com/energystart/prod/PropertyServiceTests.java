package com.energystart.prod;

import com.energystart.prod.model.Property;
import com.energystart.prod.repos.PropertyRepo;
import com.energystart.prod.service.PropertyService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PropertyServiceTests {

    private final PropertyRepo repository = mock(PropertyRepo.class);
    private final PropertyService service = new PropertyService(repository);

    private Property request() {
        return new Property(null, 1001, "Test Office Building","123 Main Street", "Orlando", "FL", 32801, "Test property");
    }

    private Property storedProperty() {
        Property property = request();
        property.setId("property-1");
        property.setAuthorizedUserIds(List.of("user_owner"));
        return property;
    }

    private void allowOwner(Property property) {
        when(repository.findByIdAndAuthorizedUserIdsContaining(
                property.getId(), "user_owner"))
                .thenReturn(Optional.of(property));
    }

    private void denyOtherUser() {
        when(repository.findByIdAndAuthorizedUserIdsContaining(
                "property-1", "user_other"))
                .thenReturn(Optional.empty());
        when(repository.existsById("property-1")).thenReturn(true);
    }

    @Test
    void creatorGetsAccessAndSubmittedAccessListIsIgnored() {
        when(repository.save(any(Property.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Property request = request();
        request.setId("submitted-id");
        request.setAuthorizedUserIds(List.of("user_other"));

        Property created = service.addProperty(request, "user_owner");

        assertNotNull(created.getId());
        assertNotEquals("submitted-id", created.getId());
        assertEquals("Test Office Building", created.getPropertyName());
        assertEquals(List.of("user_owner"), created.getAuthorizedUserIds());
        assertEquals("123 Main Street", created.getStreetAddress());
        assertEquals("Orlando", created.getCity());
        assertEquals("FL", created.getState());
        assertEquals(Integer.valueOf(32801), created.getZipcode());

        verify(repository).save(any(Property.class));
    }

    @Test
    void propertyListOnlyIncludesAccessibleProperties() {
        Property ownerProperty = storedProperty();

        Property otherProperty = request();
        otherProperty.setId("property-2");
        otherProperty.setAuthorizedUserIds(List.of("user_other"));

        // Include both users' properties to check the permission filter.
        when(repository.findAll())
                .thenReturn(List.of(ownerProperty, otherProperty));

        List<Property> visible = service.getAllProperties("user_owner");

        assertEquals(1, visible.size());
        assertEquals(ownerProperty.getId(), visible.get(0).getId());
        assertNotSame(ownerProperty, visible.get(0));

        verify(repository).findAll();
    }

    @Test
    void authorizedUserCanViewPropertyUsingRepositoryQuery() {
        Property stored = storedProperty();
        allowOwner(stored);

        Property result = service.getPropertyById(
                "property-1", "user_owner");

        assertEquals(stored.getId(), result.getId());
        assertEquals(stored.getStreetAddress(), result.getStreetAddress());
        assertNotSame(stored, result);

        verify(repository).findByIdAndAuthorizedUserIdsContaining(
                "property-1", "user_owner");
    }

    @Test
    void anotherUserCannotViewProperty() {
        denyOtherUser();

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.getPropertyById("property-1", "user_other"));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    void anotherUserCannotEditOrGiveThemselvesAccess() {
        denyOtherUser();

        Property update = request();
        update.setStreetAddress("Unauthorized change");
        update.setAuthorizedUserIds(List.of("user_other"));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.updateProperty(
                        "property-1", update, "user_other"));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        verify(repository, never()).save(any(Property.class));
    }

    @Test
    void anotherUserCannotDeleteProperty() {
        denyOtherUser();

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.deleteProperty("property-1", "user_other"));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        verify(repository, never()).delete(any(Property.class));
    }

    @Test
    void authorizedUpdatePreservesIdAndAccessList() {
        Property stored = storedProperty();
        allowOwner(stored);
        when(repository.save(any(Property.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Property update = request();
        update.setId("replacement-id");
        update.setPropertyName("Updated Office Building");
        update.setStreetAddress("456 Updated Street");
        update.setCity("Miami");
        update.setState("FL");
        update.setZipcode(33101);
        update.setNotes("Updated notes");
        update.setAuthorizedUserIds(List.of("user_other"));

        Property updated = service.updateProperty(
                "property-1", update, "user_owner");

        assertEquals("property-1", updated.getId());
        assertEquals("Updated Office Building", updated.getPropertyName());
        assertEquals("456 Updated Street", updated.getStreetAddress());
        assertEquals("Miami", updated.getCity());
        assertEquals("FL", updated.getState());
        assertEquals(Integer.valueOf(33101), updated.getZipcode());
        assertEquals("Updated notes", updated.getNotes());
        assertEquals(List.of("user_owner"), updated.getAuthorizedUserIds());

        verify(repository).save(stored);
    }

    @Test
    void authorizedUserCanDeleteProperty() {
        Property stored = storedProperty();
        allowOwner(stored);

        Property deleted = service.deleteProperty(
                "property-1", "user_owner");

        assertEquals(stored.getId(), deleted.getId());
        verify(repository).delete(stored);
    }

    @Test
    void missingPropertyReturnsNotFound() {
        when(repository.findByIdAndAuthorizedUserIdsContaining(
                "missing-property", "user_owner"))
                .thenReturn(Optional.empty());
        when(repository.existsById("missing-property")).thenReturn(false);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.getPropertyById(
                        "missing-property", "user_owner"));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(repository, never()).delete(any(Property.class));
    }

    @Test
    void changingReturnedObjectDoesNotChangeStoredPermissions() {
        Property stored = storedProperty();
        allowOwner(stored);

        Property result = service.getPropertyById(
                "property-1", "user_owner");
        result.setAuthorizedUserIds(List.of("user_other"));

        assertEquals(List.of("user_owner"), stored.getAuthorizedUserIds());
    }

    @Test
    void missingUserIsRejectedBeforeDatabaseAccess() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.addProperty(request(), ""));

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
        verifyNoInteractions(repository);
    }
}