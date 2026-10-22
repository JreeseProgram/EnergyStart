package com.energystart.prod.service;

import com.energystart.prod.model.User;
import com.energystart.prod.repos.UserRepo;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class UserService {

    private final UserRepo userRepo;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
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
        return userRepo.save(user);
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
        return userRepo.findAll();
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
        return userRepo.findById(id).orElse(null);
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

        User existingUser = userRepo.findById(id).orElse(null);

        if (existingUser == null) {
            return null;
        }

        // Update the existing document's editable fields.
        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setEmail(updatedUser.getEmail());

        // Preserve the existing ID and role.
        return userRepo.save(existingUser);
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

        User existingUser = userRepo.findById(id).orElse(null);

        if (existingUser == null) {
            return null;
        }

        userRepo.delete(existingUser);

        return existingUser;
    }

}