package com.energystart.prod;

import com.energystart.prod.model.Property;
import com.energystart.prod.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.server.ResponseStatusException;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class PropertyControllerErrorTests {

    @Autowired
    private WebApplicationContext context;

    @MockitoBean
    private PropertyService propertyService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    void deniedPropertyAccessReturnsJson() throws Exception {
        when(propertyService.getPropertyById("property_1", "user_test_sergio"))
                .thenThrow(new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You do not have access to this property."));

        mockMvc.perform(get("/api/properties/property_1")
                        .with(jwt().jwt(token ->
                                token.subject("user_test_sergio"))))
                .andExpect(status().isForbidden())
                .andExpect(content().contentTypeCompatibleWith("application/json"))
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message")
                        .value("You do not have access to this property."));

        verify(propertyService)
                .getPropertyById("property_1", "user_test_sergio");
    }

    @Test
    void missingPropertyStillReturnsNotFound() throws Exception {
        when(propertyService.getPropertyById("missing", "user_test_sergio"))
                .thenThrow(new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Property not found."));

        mockMvc.perform(get("/api/properties/missing")
                        .with(jwt().jwt(token ->
                                token.subject("user_test_sergio"))))
                .andExpect(status().isNotFound());

        verify(propertyService)
                .getPropertyById("missing", "user_test_sergio");
    }

    @Test
    void successfulRequestStillReturnsProperty() throws Exception {
        Property property = new Property();
        property.setId("property_1");

        when(propertyService.getPropertyById("property_1", "user_test_sergio"))
                .thenReturn(property);

        mockMvc.perform(get("/api/properties/property_1")
                        .with(jwt().jwt(token ->
                                token.subject("user_test_sergio"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("property_1"));

        verify(propertyService)
                .getPropertyById("property_1", "user_test_sergio");
    }

    @Test
    void missingTokenIsBlockedBeforePropertyLookup() throws Exception {
        mockMvc.perform(get("/api/properties/property_1"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message")
                        .value("A valid login token is required."));

        verifyNoInteractions(propertyService);
    }
}