package com.energystart.prod.controller;

import com.energystart.prod.model.Building;
import com.energystart.prod.service.BuildingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/building")
public class BuildingController {

    private final BuildingService buildingService;
    public BuildingController(BuildingService buildingService) {
        this.buildingService = buildingService;
    }

    @GetMapping
    public List<Building> getAllBuildings() {
        return buildingService.getAllBuildings();
    }

    @GetMapping("/{id}")
    public Building getBuildingById(@PathVariable String id) {
        return buildingService.getBuildingById(id);
    }

    @PostMapping
    public Building createBuilding(@RequestBody Building building) {
        return buildingService.createBuilding(building);
    }

    @PutMapping("/{id}")
    public String updateBuilding(@PathVariable String id, @RequestBody Building building) {
        return buildingService.updateBuilding(id,building);
    }

    @DeleteMapping("/{id}")
    public String deleteBuilding(@PathVariable String id) {
        return buildingService.deleteBuilding(id);
    }
}
