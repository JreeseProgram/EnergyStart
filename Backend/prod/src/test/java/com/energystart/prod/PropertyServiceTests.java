package com.energystart.prod;

import com.energystart.prod.model.Property;
import com.energystart.prod.service.PropertyService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PropertyServiceTests {

    private final PropertyService service = new PropertyService();

    private Property request() {
        return new Property(
                null, 1001, "123 Main Street",
                "Orlando", "FL", 32801, "Test property");
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
    }

    @Test
    void propertyListOnlyIncludesUsersOwnProperties() {
        Property ownerProperty = service.addProperty(request(), "user_owner");
        service.addProperty(request(), "user_other");

        List<Property> visible = service.getAllProperties("user_owner");

        assertEquals(1, visible.size());
        assertEquals(ownerProperty.getId(), visible.get(0).getId());
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
    }

    @Test
    void anotherUserCannotDeleteProperty() {
        Property created = service.addProperty(request(), "user_owner");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.deleteProperty(created.getId(), "user_other"));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        assertNotNull(service.getPropertyById(created.getId(), "user_owner"));
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
    }

    @Test
    void authorizedUserCanDeleteProperty() {
        Property created = service.addProperty(request(), "user_owner");
        service.deleteProperty(created.getId(), "user_owner");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.getPropertyById(created.getId(), "user_owner"));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
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
    }
}
