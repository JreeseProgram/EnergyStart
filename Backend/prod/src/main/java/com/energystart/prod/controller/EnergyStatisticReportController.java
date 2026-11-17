package com.energystart.prod.controller;

import com.energystart.prod.dto.FrontendLinkingDTO;
import com.energystart.prod.service.EnergyStatisticReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/energyStatisticReport")
public class EnergyStatisticReportController {

    private final EnergyStatisticReportService energyStatisticReportService;

    public EnergyStatisticReportController(EnergyStatisticReportService energyStatisticReportService) {
        this.energyStatisticReportService = energyStatisticReportService;
    }

    @GetMapping("/{propertyID}")
    public ResponseEntity<FrontendLinkingDTO.EnergyReport> getEnergyStatisticReport(
            @PathVariable String propertyID,
            @RequestParam YearMonth startDate,
            @RequestParam YearMonth endDate,
            @AuthenticationPrincipal Jwt jwt
    ) {
        FrontendLinkingDTO.EnergyReport report = energyStatisticReportService.getEnergyReport(
                propertyID,
                startDate,
                endDate,
                jwt.getSubject()
        );
        return  ResponseEntity.ok(report);
    }
}
