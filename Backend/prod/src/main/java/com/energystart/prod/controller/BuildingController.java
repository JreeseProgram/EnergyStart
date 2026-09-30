package com.energystart.prod.controller;

import com.energystart.prod.model.Building;
import com.energystart.prod.service.BuildingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
public class BuildingController {

    private final BuildingService buildingService;


    // Constructor injection
    public BuildingController(BuildingService buildingService) {

        this.buildingService = buildingService;
    }


    // ============================================================
    // CREATE
    // ============================================================

    /**
     * POST /api/buildings
     *
     * Creates a new building.
     */
    @PostMapping
    public Building createBuilding(
            @RequestBody Building building) {

        return buildingService.addBuilding(building);
    }


    // ============================================================
    // READ - ALL
    // ============================================================

    /**
     * GET /api/buildings
     *
     * Retrieves all buildings.
     */
    @GetMapping
    public List<Building> getAllBuildings() {

        return buildingService.getAllBuildings();
    }


    // ============================================================
    // READ - ONE
    // ============================================================

    /**
     * GET /api/buildings/{id}
     *
     * Retrieves one building by ID.
     */
    @GetMapping("/{id}")
    public Building getBuildingById(
            @PathVariable String id) {

        return buildingService.getBuildingById(id);
    }


    // ============================================================
    // UPDATE
    // ============================================================

    /**
     * PUT /api/buildings/{id}
     *
     * Updates an existing building.
     */
    @PutMapping("/{id}")
    public Building updateBuilding(
            @PathVariable String id,
            @RequestBody Building building) {

        return buildingService.updateBuilding(id, building);
    }


    // ============================================================
    // DELETE
    // ============================================================

    /**
     * DELETE /api/buildings/{id}
     *
     * Deletes an existing building.
     */
    @DeleteMapping("/{id}")
    public Building deleteBuilding(
            @PathVariable String id) {

        return buildingService.deleteBuilding(id);
    }
}