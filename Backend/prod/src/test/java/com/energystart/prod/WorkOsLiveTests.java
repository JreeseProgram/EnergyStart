package com.energystart.prod;

import com.energystart.prod.dto.WorkOsUserResponse;
import com.energystart.prod.service.WorkOsUserService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

class WorkOsLiveTests {

    @Test
    void emailAndIdLookupsReturnTheSameUser() {
        String apiKey = System.getenv("WORKOS_API_KEY");
        String email = System.getenv("WORKOS_TEST_EMAIL");

        // Skip during normal builds unless live testing is configured.
        assumeTrue(apiKey != null && !apiKey.isBlank(),
                "Live test requires WORKOS_API_KEY.");
        assumeTrue(email != null && !email.isBlank(),
                "Live test requires WORKOS_TEST_EMAIL.");

        WorkOsUserService service = new WorkOsUserService(apiKey);

        WorkOsUserResponse byEmail = service.getUserByEmail(email);
        WorkOsUserResponse byId = service.getUserById(byEmail.id());

        assertTrue(email.trim().equalsIgnoreCase(byEmail.email()));
        assertEquals(byEmail.id(), byId.id());
        assertEquals(byEmail.email(), byId.email());
    }
}
