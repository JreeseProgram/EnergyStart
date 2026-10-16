
package com.energystart.prod;

import com.energystart.prod.model.Property;
import com.energystart.prod.repos.PropertyRepo;
import com.energystart.prod.service.PropertyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PropertyMongoIntegrationTest {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private PropertyRepo propertyRepo;

    @Test
    void propertyCanBeSavedAndRetrievedFromMongoDB() {

        String testUserId = "integration-test-" + UUID.randomUUID();
        String propertyId = null;

        Property request = new Property(
                null,
                999999,
                "Integration Test Street",
                "Orlando",
                "FL",
                32801,
                "Temporary MongoDB integration test"
        );

        try {
            // CREATE: save property to the real database.
            Property created =
                    propertyService.addProperty(request, testUserId);

            propertyId = created.getId();

            assertNotNull(propertyId);

            // READ: retrieve directly from MongoDB.
            Property stored = propertyRepo.findById(propertyId)
                    .orElseThrow();

            assertEquals(
                    "Integration Test Street",
                    stored.getStreetAddress()
            );

            assertTrue(
                    stored.getAuthorizedUserIds().contains(testUserId)
            );

            // READ: verify the service can retrieve it.
            Property retrieved =
                    propertyService.getPropertyById(propertyId, testUserId);

            assertEquals(propertyId, retrieved.getId());

        } finally {
            // Remove only the property created by this test.
            if (propertyId != null) {
                propertyRepo.findById(propertyId)
                        .filter(property ->
                                property.getAuthorizedUserIds()
                                        .contains(testUserId))
                        .ifPresent(propertyRepo::delete);
            }
        }
    }
}
