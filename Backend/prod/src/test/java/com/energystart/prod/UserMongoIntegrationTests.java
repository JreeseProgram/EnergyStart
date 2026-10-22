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


    @Test
    void canUpdateUserInMongoDB() {

        String testId = "integration-test-" + UUID.randomUUID();

        User testUser = new User(
                testId,
                "originalusername",
                "original@example.com",
                "USER"
        );

        try {
            // Step 1: Create the user in MongoDB.
            userRepo.save(testUser);

            // Step 2: Retrieve the saved user.
            User existingUser = userRepo.findById(testId)
                    .orElseThrow();

            // Step 3: Change the username and email.
            existingUser.setUsername("updatedusername");
            existingUser.setEmail("updated@example.com");

            // Step 4: Save the changes to MongoDB.
            userRepo.save(existingUser);

            // Step 5: Retrieve the user again.
            User updatedUser = userRepo.findById(testId)
                    .orElseThrow();

            // Step 6: Verify the updated information.
            assertEquals("updatedusername", updatedUser.getUsername());
            assertEquals("updated@example.com", updatedUser.getEmail());

            // Verify that the ID and role were preserved.
            assertEquals(testId, updatedUser.getId());
            assertEquals("USER", updatedUser.getRole());

        } finally {
            // Remove only the temporary test document.
            userRepo.deleteById(testId);
        }
    }


    @Test
    void canDeleteUserFromMongoDB() {

        // Generate a unique ID for the test user.
        String testId = "integration-test-" + UUID.randomUUID();

        User testUser = new User(
                testId,
                "deletetest",
                "deletetest@example.com",
                "USER"
        );

        try {
            // Step 1: Save the test user to MongoDB.
            userRepo.save(testUser);

            // Step 2: Verify the user exists.
            assertTrue(userRepo.existsById(testId));

            // Step 3: Delete the user.
            userRepo.deleteById(testId);

            // Step 4: Verify the user no longer exists.
            assertFalse(userRepo.existsById(testId));

            // Step 5: Verify a lookup returns no user.
            assertTrue(userRepo.findById(testId).isEmpty());

        } finally {
            // Clean up if the test fails before deletion.
            userRepo.deleteById(testId);
        }
    }


}