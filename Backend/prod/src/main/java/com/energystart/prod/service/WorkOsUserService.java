package com.energystart.prod.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.energystart.prod.dto.WorkOsUserResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class WorkOsUserService {

    private final RestClient client;
    private final String apiKey;

    // WorkOS returns email search results inside a "data" list.
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record UserListResponse(List<WorkOsUserResponse> data) {
    }

    public WorkOsUserService(
            @Value("${WORKOS_API_KEY:}") String apiKey) {

        this.apiKey = apiKey;

        SimpleClientHttpRequestFactory factory =
                new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);

        this.client = RestClient.builder()
                .baseUrl("https://api.workos.com")
                .requestFactory(factory)
                .build();
    }

    public WorkOsUserResponse getUserById(String userId) {
        if (userId == null || !userId.matches("user_[A-Za-z0-9]+")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid WorkOS user ID.");
        }

        requireApiKey();

        try {
            WorkOsUserResponse user = client.get()
                    .uri("/user_management/users/{id}", userId)
                    .headers(headers -> headers.setBearerAuth(apiKey))
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(WorkOsUserResponse.class);

            validateUser(user);

            if (!userId.equals(user.id())) {
                throw invalidResponse();
            }

            return user;

        } catch (RestClientResponseException exception) {
            throw mapApiError(exception);
        } catch (RestClientException exception) {
            throw connectionError();
        }
    }

    public WorkOsUserResponse getUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw invalidEmail();
        }

        String normalizedEmail = email.trim();

        // Basic input check; WorkOS performs the actual lookup.
        if (normalizedEmail.length() > 254
                || !normalizedEmail.matches("[^\\s@]+@[^\\s@]+")) {
            throw invalidEmail();
        }

        requireApiKey();

        try {
            UserListResponse response = client.get()
                    .uri(builder -> builder
                            .path("/user_management/users")
                            .queryParam("email", "{email}")
                            .queryParam("limit", 2)
                            .build(normalizedEmail))
                    .headers(headers -> headers.setBearerAuth(apiKey))
                    .accept(MediaType.APPLICATION_JSON)
                    .retrieve()
                    .body(UserListResponse.class);

            if (response == null || response.data() == null) {
                throw invalidResponse();
            }

            if (response.data().isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "WorkOS user not found.");
            }

            // Never choose an arbitrary user if results are ambiguous.
            if (response.data().size() != 1) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Email lookup returned multiple users.");
            }

            WorkOsUserResponse user = response.data().get(0);
            validateUser(user);

            if (!normalizedEmail.equalsIgnoreCase(user.email())) {
                throw invalidResponse();
            }

            return user;

        } catch (RestClientResponseException exception) {
            throw mapApiError(exception);
        } catch (RestClientException exception) {
            throw connectionError();
        }
    }

    private void requireApiKey() {
        if (apiKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "WorkOS API key has not been configured.");
        }
    }

    private void validateUser(WorkOsUserResponse user) {
        if (user == null
                || user.id() == null
                || !user.id().matches("user_[A-Za-z0-9]+")
                || user.email() == null
                || user.email().isBlank()) {
            throw invalidResponse();
        }
    }

    private ResponseStatusException mapApiError(
            RestClientResponseException exception) {

        if (exception.getStatusCode().value() == 404) {
            return new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "WorkOS user not found.");
        }

        return new ResponseStatusException(
                HttpStatus.BAD_GATEWAY, "WorkOS user lookup failed.");
    }

    private ResponseStatusException invalidEmail() {
        return new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "A valid email is required.");
    }

    private ResponseStatusException invalidResponse() {
        return new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "WorkOS returned an invalid user response.");
    }

    private ResponseStatusException connectionError() {
        return new ResponseStatusException(
                HttpStatus.BAD_GATEWAY, "Unable to contact WorkOS.");
    }
}