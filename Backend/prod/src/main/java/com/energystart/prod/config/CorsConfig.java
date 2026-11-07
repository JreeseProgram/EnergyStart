package com.energystart.prod.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// The frontend and API run on different origins locally, so browsers require
// explicit permission to send API requests and read their responses.
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${FRONTEND_ORIGIN:http://localhost:5173}") String frontendOrigin) {
        CorsConfiguration configuration = new CorsConfiguration();
        // Use an exact origin: credentialed browser requests cannot use a wildcard.
        // FRONTEND_ORIGIN lets other environments override the local Vite address.
        configuration.setAllowedOrigins(List.of(frontendOrigin));
        configuration.setAllowedMethods(List.of("GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // Permit the WorkOS bearer token and JSON headers during browser preflight.
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        // Match the frontend Axios client's withCredentials setting.
        // This does not authenticate requests or replace bearer-token validation.
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Share this policy between security profiles, scoped to API routes.
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
