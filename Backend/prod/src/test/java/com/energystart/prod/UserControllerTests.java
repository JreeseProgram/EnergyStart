
package com.energystart.prod;

import com.energystart.prod.model.User;
import com.energystart.prod.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
class UserControllerTests {

    @Autowired
    private WebApplicationContext context;

    // Prevent actual MongoDB operations.
    @MockitoBean
    private UserService userService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    // ============================================================
    // AUTHENTICATION
    // ============================================================

    @Test
    void getUsersWithoutTokenReturnsUnauthorized() throws Exception {

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(userService);
    }

    @Test
    void createUserWithoutTokenReturnsUnauthorized() throws Exception {

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "testuser",
                                  "email": "test@example.com",
                                  "role": "USER"
                                }
                                """))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(userService);
    }

    // ============================================================
    // CREATE
    // ============================================================

    @Test
    void createUserReturns201Created() throws Exception {

        User savedUser = new User(
                "user123",
                "testuser",
                "test@example.com",
                "USER"
        );

        when(userService.addUser(any(User.class)))
                .thenReturn(savedUser);

        mockMvc.perform(post("/api/users")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "testuser",
                                  "email": "test@example.com",
                                  "role": "USER"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("user123"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));

        verify(userService).addUser(any(User.class));
    }

    // ============================================================
    // READ ALL
    // ============================================================

    @Test
    void getAllUsersReturns200AndUserList() throws Exception {

        User user1 = new User(
                "user1",
                "alice",
                "alice@example.com",
                "USER"
        );

        User user2 = new User(
                "user2",
                "bob",
                "bob@example.com",
                "USER"
        );

        when(userService.getAllUsers())
                .thenReturn(List.of(user1, user2));

        mockMvc.perform(get("/api/users")
                        .with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].username").value("alice"))
                .andExpect(jsonPath("$[1].username").value("bob"));

        verify(userService).getAllUsers();
    }

    @Test
    void getAllUsersReturnsEmptyList() throws Exception {

        when(userService.getAllUsers())
                .thenReturn(List.of());

        mockMvc.perform(get("/api/users")
                        .with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        verify(userService).getAllUsers();
    }

    // ============================================================
    // READ ONE
    // ============================================================

    @Test
    void getUserByIdReturns200WhenFound() throws Exception {

        User user = new User(
                "user123",
                "testuser",
                "test@example.com",
                "USER"
        );

        when(userService.getUserById("user123"))
                .thenReturn(user);

        mockMvc.perform(get("/api/users/user123")
                        .with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("user123"))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService).getUserById("user123");
    }

    @Test
    void getUserByIdReturns404WhenMissing() throws Exception {

        when(userService.getUserById("missing"))
                .thenReturn(null);

        mockMvc.perform(get("/api/users/missing")
                        .with(jwt()))
                .andExpect(status().isNotFound());

        verify(userService).getUserById("missing");
    }

    // ============================================================
    // UPDATE
    // ============================================================

    @Test
    void updateUserReturns200WhenFound() throws Exception {

        User updatedUser = new User(
                "user123",
                "updateduser",
                "updated@example.com",
                "USER"
        );

        when(userService.updateUser(
                eq("user123"),
                any(User.class)))
                .thenReturn(updatedUser);

        mockMvc.perform(put("/api/users/user123")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "updateduser",
                                  "email": "updated@example.com"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("user123"))
                .andExpect(jsonPath("$.username").value("updateduser"))
                .andExpect(jsonPath("$.email").value("updated@example.com"));

        verify(userService).updateUser(
                eq("user123"),
                any(User.class));
    }

    @Test
    void updateUserReturns404WhenMissing() throws Exception {

        when(userService.updateUser(
                eq("missing"),
                any(User.class)))
                .thenReturn(null);

        mockMvc.perform(put("/api/users/missing")
                        .with(jwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "updateduser",
                                  "email": "updated@example.com"
                                }
                                """))
                .andExpect(status().isNotFound());

        verify(userService).updateUser(
                eq("missing"),
                any(User.class));
    }

    // ============================================================
    // DELETE
    // ============================================================

    @Test
    void deleteUserReturns200WhenFound() throws Exception {

        User deletedUser = new User(
                "user123",
                "testuser",
                "test@example.com",
                "USER"
        );

        when(userService.deleteUser("user123"))
                .thenReturn(deletedUser);

        mockMvc.perform(delete("/api/users/user123")
                        .with(jwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("user123"))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userService).deleteUser("user123");
    }

    @Test
    void deleteUserReturns404WhenMissing() throws Exception {

        when(userService.deleteUser("missing"))
                .thenReturn(null);

        mockMvc.perform(delete("/api/users/missing")
                        .with(jwt()))
                .andExpect(status().isNotFound());

        verify(userService).deleteUser("missing");
    }
}
