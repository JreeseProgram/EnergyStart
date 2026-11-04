package com.energystart.prod;

import com.energystart.prod.model.Property;
import com.energystart.prod.repos.PropertyRepo;
import com.energystart.prod.service.PropertyService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = {
        "spring.mongodb.uri=${MONGODB_URI}"
})
@EnabledIfEnvironmentVariable(
        named = "MONGODB_URI",
        matches = "mongodb(?:\\+srv)?://.+")
class PropertyMongoLiveTests {

    @Autowired
    private PropertyRepo repository;

    @Autowired
    private PropertyService service;

    @Test
    void mongoQueryAllowsAuthorizedUserAndRejectsOtherUser() {
        String suffix = UUID.randomUUID().toString();
        String owner = "user_testowner_" + suffix;
        String other = "user_testother_" + suffix;

        Property property = new Property(
                "permission-test-" + suffix,
                910017,
                "Permission Test Property",
                "Temporary permission test",
                "Orlando",
                "FL",
                32801,
                "Removed automatically after this test"
        );
        property.setAuthorizedUserIds(List.of(owner));

        try {
            repository.insert(property);

            assertTrue(repository
                    .findByIdAndAuthorizedUserIdsContaining(
                            property.getId(), owner)
                    .isPresent());

            assertTrue(repository
                    .findByIdAndAuthorizedUserIdsContaining(
                            property.getId(), other)
                    .isEmpty());

            assertEquals(property.getId(),
                    service.getPropertyById(property.getId(), owner).getId());

            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> service.getPropertyById(property.getId(), other));

            assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());

        } finally {
            // Delete only the temporary property created by this test.
            repository.deleteById(property.getId());
        }
    }
}
