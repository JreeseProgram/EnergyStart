package com.energystart.prod;

import com.energystart.prod.controller.PropertyController;
import com.energystart.prod.model.Property;
import com.energystart.prod.service.PropertyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PropertyControllerErrorTests {

    private PropertyService propertyService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        propertyService = mock(PropertyService.class);

        // Test the controller responses without connecting to MongoDB.
        mockMvc = MockMvcBuilders
                .standaloneSetup(new PropertyController(propertyService))
                .build();
    }

    @Test
    void deniedPropertyAccessReturnsJson() throws Exception {
        when(propertyService.getPropertyById("property_1", "sample_user_001"))
                .thenThrow(new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You do not have access to this property."));

        mockMvc.perform(get("/api/properties/property_1"))
                .andExpect(status().isForbidden())
                .andExpect(content().contentTypeCompatibleWith("application/json"))
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message")
                        .value("You do not have access to this property."));
    }

    @Test
    void missingPropertyStillReturnsNotFound() throws Exception {
        when(propertyService.getPropertyById("missing", "sample_user_001"))
                .thenThrow(new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Property not found."));

        mockMvc.perform(get("/api/properties/missing"))
                .andExpect(status().isNotFound());
    }

    @Test
    void successfulRequestStillReturnsProperty() throws Exception {
        Property property = new Property();
        property.setId("property_1");

        when(propertyService.getPropertyById("property_1", "sample_user_001"))
                .thenReturn(property);

        mockMvc.perform(get("/api/properties/property_1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("property_1"));
    }
}