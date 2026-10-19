package com.energystart.prod;

import com.energystart.prod.model.User;
import com.energystart.prod.repos.UserRepo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserMongoIntegrationTests {

    @Autowired
    private UserRepo userRepo;

    @Test
    void canSaveAndRetrieveUserFromMongoDB() {

        String testId = "integration-test-" + UUID.randomUUID();

        User testUser = new User(
                testId,
                "integrationtest",
                "integration@example.com",
                "USER"
        );

        try {
            // Save the test user.
            userRepo.save(testUser);

            // Retrieve the saved user.
            User foundUser = userRepo.findById(testId)
                    .orElse(null);

            // Verify the information.
            assertNotNull(foundUser);
            assertEquals(testId, foundUser.getId());
            assertEquals("integrationtest", foundUser.getUsername());
            assertEquals("integration@example.com", foundUser.getEmail());
            assertEquals("USER", foundUser.getRole());

        } finally {
            // Remove only the temporary test user.
            userRepo.deleteById(testId);
        }
    }
}