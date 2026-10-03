package com.energystart.prod;

import com.energystart.prod.service.WorkOsUserService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class WorkOsUserServiceTests {

    private final WorkOsUserService service = new WorkOsUserService("");

    @Test
    void invalidEmailReturnsBadRequest() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.getUserByEmail("not-an-email")
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void invalidUserIdReturnsBadRequest() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.getUserById("../users")
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void emailLookupWithoutApiKeyReturnsServiceUnavailable() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.getUserByEmail("sergio@example.com")
        );

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, exception.getStatusCode());
    }

    @Test
    void idLookupWithoutApiKeyReturnsServiceUnavailable() {
        // Valid ID format lets this test reach the missing API key check.
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.getUserById("user_testsergio")
        );

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, exception.getStatusCode());
    }
}