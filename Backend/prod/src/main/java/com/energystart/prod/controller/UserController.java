package com.energystart.prod.controller;

import com.energystart.prod.model.User;
import com.energystart.prod.service.UserService;
import org.springframework.web.bind.annotation.*;

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
    public User createUser(@RequestBody User user) {

        return userService.addUser(user);
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
    public User getUserById(@PathVariable String id) {

        return userService.getUserById(id);
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
    public User updateUser(
            @PathVariable String id,
            @RequestBody User user) {

        return userService.updateUser(id, user);
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
    public User deleteUser(@PathVariable String id) {

        return userService.deleteUser(id);
    }
}