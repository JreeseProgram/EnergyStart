package com.energystart.prod.service;

import com.energystart.prod.model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    // Temporary list used instead of MongoDB
    private final List<User> users = new ArrayList<>();


    // ============================================================
    // TEST DATA
    // ============================================================

    public UserService() {

        User user1 = new User(
                "1",
                "admin",
                "admin@energystart.com",
                "ADMIN"
        );

        User user2 = new User(
                "2",
                "johnsmith",
                "john.smith@example.com",
                "USER"
        );

        User user3 = new User(
                "3",
                "janedoe",
                "jane.doe@example.com",
                "USER"
        );

        User user4 = new User(
                "4",
                "propertymanager",
                "manager@energystart.com",
                "PROPERTY_MANAGER"
        );

        // Add test users to temporary list
        users.add(user1);
        users.add(user2);
        users.add(user3);
        users.add(user4);
    }


    // ============================================================
    // CREATE
    // ============================================================

    /**
     * Creates a new user.
     *
     * POST /api/users
     */
    public User addUser(User user) {

        users.add(user);

        return user;
    }


    // ============================================================
    // READ - ALL USERS
    // ============================================================

    /**
     * Retrieves all users.
     *
     * GET /api/users
     */
    public List<User> getAllUsers() {

        return users;
    }


    // ============================================================
    // READ - ONE USER
    // ============================================================

    /**
     * Retrieves a user by ID.
     *
     * GET /api/users/{id}
     */
    public User getUserById(String id) {

        for (User user : users) {

            if (user.getId().equals(id)) {
                return user;
            }
        }

        return null;
    }


    // ============================================================
    // UPDATE
    // ============================================================

    /**
     * Updates an existing user.
     *
     * PUT /api/users/{id}
     */
    public User updateUser(String id, User updatedUser) {

        for (int i = 0; i < users.size(); i++) {

            User existingUser = users.get(i);

            if (existingUser.getId().equals(id)) {

                // Make sure the ID cannot accidentally change
                updatedUser.setId(id);

                users.set(i, updatedUser);

                return updatedUser;
            }
        }

        return null;
    }


    // ============================================================
    // DELETE
    // ============================================================

    /**
     * Deletes an existing user.
     *
     * DELETE /api/users/{id}
     */
    public User deleteUser(String id) {

        for (int i = 0; i < users.size(); i++) {

            User user = users.get(i);

            if (user.getId().equals(id)) {

                users.remove(i);

                return user;
            }
        }

        return null;
    }
}