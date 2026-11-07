package com.energystart.prod.config;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("local-test")
public class LocalTestSecurityConfig {

    @Bean
    public SecurityFilterChain localTestSecurityFilterChain(
            HttpSecurity http) throws Exception {

        // Temporary identity for the local-only No Auth testing flow.
        Jwt localUser = Jwt.withTokenValue("local-test")
                .header("alg", "none")
                .subject("user_localtest")
                .build();

        http
                // Browsers still enforce CORS when this local profile bypasses auth.
                // Reuse the same frontend-origin policy as the authenticated profile.
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .anonymous(anonymous -> anonymous.principal(localUser))
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll());

        return http.build();
    }
}
