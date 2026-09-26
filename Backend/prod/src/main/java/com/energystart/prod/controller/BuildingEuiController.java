package com.energystart.prod.controller;

import com.energystart.prod.dto.BuildingEuiResponse;
import com.energystart.prod.model.EnergyReading;
import com.energystart.prod.service.BuildingEuiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/building/{buildingId}")
public class BuildingEuiController {
    private final BuildingEuiService service;

    public BuildingEuiController(BuildingEuiService service) { this.service = service; }

    @PostMapping("/energy-readings")
    public EnergyReading addReading(@PathVariable String buildingId, @RequestBody EnergyReading reading) {
        return service.addReading(buildingId, reading);
    }

    @GetMapping("/energy-metrics")
    public BuildingEuiResponse metrics(@PathVariable String buildingId, @RequestParam int year) {
        return service.calculate(buildingId, year);
    }
}
