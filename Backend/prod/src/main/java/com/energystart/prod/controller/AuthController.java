package com.energystart.prod.controller;

import com.energystart.prod.dto.WorkOsUserResponse;
import com.energystart.prod.service.WorkOsUserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final WorkOsUserService workOsUserService;

    public AuthController(WorkOsUserService workOsUserService) {
        this.workOsUserService = workOsUserService;
    }

    public record AuthenticatedUserResponse(String userId) {
    }

    // Return the user ID from the verified login token.
    @GetMapping("/me")
    public AuthenticatedUserResponse getCurrentUser(
            @AuthenticationPrincipal Jwt jwt) {

        return new AuthenticatedUserResponse(jwt.getSubject());
    }

    // Look up only the authenticated user's own WorkOS profile.
    @GetMapping("/me/profile")
    public WorkOsUserResponse getCurrentUserProfile(
            @AuthenticationPrincipal Jwt jwt) {

        return workOsUserService.getUserById(jwt.getSubject());
    }
}