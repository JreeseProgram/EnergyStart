package com.energystart.prod.controller;

import com.energystart.prod.dto.FrontendLinkingDTO;
import com.energystart.prod.repos.EnergyMeterReadingRepo;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.EnergyReportRepo;
import com.energystart.prod.service.AltPropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/propertyDTO")
public class AltPropertyController {
    private final AltPropertyService altPropertyService;

    public AltPropertyController(AltPropertyService altPropertyService) {this.altPropertyService = altPropertyService;}

    @GetMapping("/{propertyId}")
    public ResponseEntity<FrontendLinkingDTO.Property> getProperty(
            @PathVariable String propertyId,
            @RequestParam YearMonth startDate,
            @RequestParam YearMonth endDate
    ){
        FrontendLinkingDTO.Property property = altPropertyService.getProperty(propertyId, startDate, endDate);
        return ResponseEntity.ok(property);
    }

}
