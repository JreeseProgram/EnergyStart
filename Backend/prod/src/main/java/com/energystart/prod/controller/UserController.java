package com.energystart.prod.controller;

import com.energystart.prod.model.User;
import com.energystart.prod.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    // ============================================================
    // CREATE
    // ============================================================

    /**
     * POST /api/users
     *
     * Creates a new user.
     */

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {

        User createdUser = userService.addUser(user);

        return ResponseEntity.status(201).body(createdUser);
    }



    // ============================================================
    // READ - ALL USERS
    // ============================================================

    /**
     * GET /api/users
     *
     * Retrieves all users.
     */
    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();
    }


    // ============================================================
    // READ - ONE USER
    // ============================================================

    /**
     * GET /api/users/{id}
     *
     * Retrieves a single user by ID.
     */

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {

        User user = userService.getUserById(id);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }



    // ============================================================
    // UPDATE
    // ============================================================

    /**
     * PUT /api/users/{id}
     *
     * Updates an existing user.
     */

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable String id,
            @RequestBody User user) {

        User updatedUser = userService.updateUser(id, user);

        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedUser);
    }



    // ============================================================
    // DELETE
    // ============================================================

    /**
     * DELETE /api/users/{id}
     *
     * Deletes an existing user.
     */

    @DeleteMapping("/{id}")
    public ResponseEntity<User> deleteUser(@PathVariable String id) {

        User deletedUser = userService.deleteUser(id);

        if (deletedUser == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(deletedUser);
    }

}