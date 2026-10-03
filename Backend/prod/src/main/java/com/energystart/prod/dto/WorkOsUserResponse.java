package com.energystart.prod.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

// Keep only the user information needed by our backend.
@JsonIgnoreProperties(ignoreUnknown = true)
public record WorkOsUserResponse(
        String id,
        String email,
        @JsonProperty("first_name") String firstName,
        @JsonProperty("last_name") String lastName
) {
}