
package com.energystart.prod;

import com.energystart.prod.model.User;
import com.energystart.prod.repos.UserRepo;
import com.energystart.prod.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTests {

    private UserRepo userRepo;
    private UserService userService;

    @BeforeEach
    void setUp() {
        userRepo = mock(UserRepo.class);
        userService = new UserService(userRepo);
    }

    @Test
    void getAllUsersReturnsRepositoryUsers() {

        // Ask the service to retrieve all users.
        userService.getAllUsers();

        // Verify that it calls MongoDB's repository method.
        verify(userRepo).findAll();
    }


    @Test
    void addUserSavesUserToRepository() {

        // Create a sample user.
        User user = new User(
                "user123",
                "testuser",
                "test@example.com",
                "USER"
        );

        // Tell the mock repository what to return.
        when(userRepo.save(user)).thenReturn(user);

        // Call the service method.
        User savedUser = userService.addUser(user);

        // Verify that the repository saved the user.
        verify(userRepo).save(user);

        // Verify that the correct user was returned.
        assertNotNull(savedUser);
        assertEquals("user123", savedUser.getId());
        assertEquals("testuser", savedUser.getUsername());
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals("USER", savedUser.getRole());
    }


    @Test
    void getUserByIdReturnsExistingUser() {

        // Create a sample user.
        User user = new User(
                "user123",
                "testuser",
                "test@example.com",
                "USER"
        );

        // Simulate finding the user in MongoDB.
        when(userRepo.findById("user123"))
                .thenReturn(java.util.Optional.of(user));

        // Retrieve the user.
        User foundUser = userService.getUserById("user123");

        // Verify the repository was called.
        verify(userRepo).findById("user123");

        // Verify the returned information.
        assertNotNull(foundUser);
        assertEquals("user123", foundUser.getId());
        assertEquals("testuser", foundUser.getUsername());
    }

    @Test
    void getUserByIdReturnsNullWhenUserDoesNotExist() {

        // Simulate a user that is not in MongoDB.
        when(userRepo.findById("missing123"))
                .thenReturn(java.util.Optional.empty());

        // Attempt to retrieve the user.
        User foundUser = userService.getUserById("missing123");

        // Verify the repository was called.
        verify(userRepo).findById("missing123");

        // Verify no user was returned.
        assertNull(foundUser);
    }


    @Test
    void updateUserPreservesIdAndRole() {

        // Original user stored in MongoDB.
        User existingUser = new User(
                "user123",
                "oldusername",
                "old@example.com",
                "USER"
        );

        // Updated information submitted by the client.
        User updatedUser = new User(
                "differentId",
                "newusername",
                "new@example.com",
                "ADMIN"
        );

        // Simulate MongoDB finding the existing user.
        when(userRepo.findById("user123"))
                .thenReturn(java.util.Optional.of(existingUser));

        // Simulate MongoDB saving the updated user.
        when(userRepo.save(existingUser))
                .thenReturn(existingUser);

        // Execute the service method.
        User result = userService.updateUser("user123", updatedUser);

        // Verify repository operations.
        verify(userRepo).findById("user123");
        verify(userRepo).save(existingUser);

        // Verify the username and email were updated.
        assertEquals("newusername", result.getUsername());
        assertEquals("new@example.com", result.getEmail());

        // Verify the original ID and role were preserved.
        assertEquals("user123", result.getId());
        assertEquals("USER", result.getRole());
    }


    @Test
    void updateUserReturnsNullWhenUserDoesNotExist() {

        User updatedUser = new User(
                "missing123",
                "newusername",
                "new@example.com",
                "USER"
        );

        // Simulate a missing user in MongoDB.
        when(userRepo.findById("missing123"))
                .thenReturn(java.util.Optional.empty());

        // Attempt to update the nonexistent user.
        User result = userService.updateUser(
                "missing123", updatedUser);

        // Verify the lookup happened.
        verify(userRepo).findById("missing123");

        // No user should be returned or saved.
        assertNull(result);
        verify(userRepo, never()).save(any(User.class));
    }


    @Test
    void deleteUserRemovesExistingUser() {

        // Create a sample user.
        User existingUser = new User(
                "user123",
                "testuser",
                "test@example.com",
                "USER"
        );

        // Simulate finding the user in MongoDB.
        when(userRepo.findById("user123"))
                .thenReturn(java.util.Optional.of(existingUser));

        // Execute the delete operation.
        User deletedUser = userService.deleteUser("user123");

        // Verify that the repository found the user.
        verify(userRepo).findById("user123");

        // Verify that the repository deleted the user.
        verify(userRepo).delete(existingUser);

        // Verify that the deleted user's information was returned.
        assertNotNull(deletedUser);
        assertEquals("user123", deletedUser.getId());
        assertEquals("testuser", deletedUser.getUsername());
    }


    @Test
    void deleteUserReturnsNullWhenUserDoesNotExist() {

        // Simulate MongoDB not finding the user.
        when(userRepo.findById("missing123"))
                .thenReturn(java.util.Optional.empty());

        // Attempt to delete the nonexistent user.
        User deletedUser = userService.deleteUser("missing123");

        // Verify the repository searched for the user.
        verify(userRepo).findById("missing123");

        // Verify that no user was returned.
        assertNull(deletedUser);

        // Verify that no deletion was attempted.
        verify(userRepo, never()).delete(any(User.class));
    }


}
