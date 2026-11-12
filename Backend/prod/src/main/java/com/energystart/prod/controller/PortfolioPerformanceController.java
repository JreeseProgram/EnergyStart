package com.energystart.prod.controller;

import com.energystart.prod.dto.FrontendLinkingDTO;
import com.energystart.prod.service.PortfolioPerformanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolioPerformance")
public class PortfolioPerformanceController {

    private final PortfolioPerformanceService portfolioPerformanceService;

    public PortfolioPerformanceController(PortfolioPerformanceController portfolioPerformanceController, PortfolioPerformanceService portfolioPerformanceService) {
        this.portfolioPerformanceService = portfolioPerformanceService;
    }

    @GetMapping("/input")
    private ResponseEntity<FrontendLinkingDTO.PortfolioPerformanceInput> getPortfolioPerformance(
            @AuthenticationPrincipal Jwt jwt
            ){
        FrontendLinkingDTO.PortfolioPerformanceInput result = portfolioPerformanceService.getPortfolioPerformanceInput(
                jwt.getSubject()
        );

        return ResponseEntity.ok(result);
    }

}
