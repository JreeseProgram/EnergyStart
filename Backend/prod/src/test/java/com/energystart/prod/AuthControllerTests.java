package com.energystart.prod;

import com.energystart.prod.dto.WorkOsUserResponse;
import com.energystart.prod.service.WorkOsUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class AuthControllerTests {

    @Autowired
    private WebApplicationContext context;

    // Replace WorkOS calls with controlled responses during these tests.
    @MockitoBean
    private WorkOsUserService workOsUserService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    void missingTokenReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidTokenReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer invalid-test-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void authenticatedUserReceivesTheirOwnId() throws Exception {
        // Mock authentication does not verify a real token signature.
        mockMvc.perform(get("/api/auth/me")
                        .with(jwt().jwt(token ->
                                token.subject("user_test_sergio"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId")
                        .value("user_test_sergio"));
    }

    @Test
    void profileWithoutTokenIsBlockedBeforeWorkOsLookup() throws Exception {
        mockMvc.perform(get("/api/auth/me/profile"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(workOsUserService);
    }

    @Test
    void profileLookupUsesAuthenticatedUserId() throws Exception {
        when(workOsUserService.getUserById("user_test_sergio"))
                .thenReturn(new WorkOsUserResponse(
                        "user_test_sergio",
                        "sergio@example.com",
                        "Sergio",
                        "Figueroa"));

        mockMvc.perform(get("/api/auth/me/profile")
                        .with(jwt().jwt(token ->
                                token.subject("user_test_sergio"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id")
                        .value("user_test_sergio"))
                .andExpect(jsonPath("$.email")
                        .value("sergio@example.com"));

        verify(workOsUserService).getUserById("user_test_sergio");
    }

    @Test
    void queryParameterCannotChangeProfileUser() throws Exception {
        when(workOsUserService.getUserById("user_test_sergio"))
                .thenReturn(new WorkOsUserResponse(
                        "user_test_sergio",
                        "sergio@example.com",
                        "Sergio",
                        "Figueroa"));

        mockMvc.perform(get("/api/auth/me/profile")
                        .param("userId", "user_someone_else")
                        .with(jwt().jwt(token ->
                                token.subject("user_test_sergio"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id")
                        .value("user_test_sergio"));

        verify(workOsUserService).getUserById("user_test_sergio");
    }
}