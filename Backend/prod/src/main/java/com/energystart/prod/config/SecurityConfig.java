package com.energystart.prod.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                // Requests use Bearer tokens instead of session cookies.
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(withDefaults()));

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder(
            @Value("${WORKOS_CLIENT_ID:}") String clientId,
            @Value("${WORKOS_ISSUER:}") String issuer) {

        // Reject tokens until the team's client ID is configured.
        if (clientId.isBlank()) {
            return token -> {
                throw new BadJwtException(
                        "WorkOS client ID has not been configured.");
            };
        }

        if (!clientId.matches("client_[A-Za-z0-9]+")) {
            throw new IllegalArgumentException(
                    "WORKOS_CLIENT_ID must be a valid WorkOS client ID.");
        }

        // Default to this application's WorkOS issuer.
        String expectedIssuer = issuer.isBlank()
                ? "https://api.workos.com/user_management/" + clientId
                : issuer;

        NimbusJwtDecoder decoder = NimbusJwtDecoder
                .withJwkSetUri("https://api.workos.com/sso/jwks/" + clientId)
                .build();

        OAuth2TokenValidator<Jwt> requiredClaims = jwt -> {
            if (jwt.getSubject() == null
                    || jwt.getSubject().isBlank()
                    || jwt.getExpiresAt() == null) {

                return OAuth2TokenValidatorResult.failure(
                        new OAuth2Error(
                                "invalid_token",
                                "User ID and expiration are required.",
                                null));
            }

            return OAuth2TokenValidatorResult.success();
        };

        // Verify the signature, issuer, timestamps, and required claims.
        decoder.setJwtValidator(
                new DelegatingOAuth2TokenValidator<>(
                        JwtValidators.createDefaultWithIssuer(expectedIssuer),
                        requiredClaims));

        return decoder;
    }
}
