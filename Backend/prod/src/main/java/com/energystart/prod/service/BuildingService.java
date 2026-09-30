package com.energystart.prod.service;

import com.energystart.prod.model.Building;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BuildingService {

    /*
     * Temporary list used as our prototype database.
     *
     * Later this will be replaced with a MongoDB repository.
     */
    private final List<Building> buildings = new ArrayList<>();


    // ============================================================
    // TEST DATA
    // ============================================================

    public BuildingService() {

        Building building1 = new Building(
                "1",
                "BLDG-1001",
                "1",
                25000,
                "Main office building."
        );

        Building building2 = new Building(
                "2",
                "BLDG-1002",
                "1",
                15000,
                "Secondary office building."
        );

        Building building3 = new Building(
                "3",
                "BLDG-1003",
                "2",
                50000,
                "Large commercial building."
        );

        Building building4 = new Building(
                "4",
                "BLDG-1004",
                "3",
                10000,
                "Small commercial building."
        );


        // Add test buildings to temporary database
        buildings.add(building1);
        buildings.add(building2);
        buildings.add(building3);
        buildings.add(building4);
    }


    // ============================================================
    // CREATE
    // ============================================================

    /**
     * Creates a new building.
     *
     * POST /api/buildings
     */
    public Building addBuilding(Building building) {

        buildings.add(building);

        return building;
    }


    // ============================================================
    // READ - ALL
    // ============================================================

    /**
     * Retrieves all buildings.
     *
     * GET /api/buildings
     */
    public List<Building> getAllBuildings() {

        return buildings;
    }


    // ============================================================
    // READ - ONE
    // ============================================================

    /**
     * Retrieves one building by ID.
     *
     * GET /api/buildings/{id}
     */
    public Building getBuildingById(String id) {

        for (Building building : buildings) {

            if (building.getId().equals(id)) {

                return building;
            }
        }

        return null;
    }


    // ============================================================
    // UPDATE
    // ============================================================

    /**
     * Updates an existing building.
     *
     * PUT /api/buildings/{id}
     */
    public Building updateBuilding(
            String id,
            Building updatedBuilding) {

        for (int i = 0; i < buildings.size(); i++) {

            Building existingBuilding = buildings.get(i);

            if (existingBuilding.getId().equals(id)) {

                /*
                 * Keep the ID from the URL.
                 *
                 * This prevents the client from accidentally
                 * changing the ID of the building being updated.
                 */
                updatedBuilding.setId(id);

                buildings.set(i, updatedBuilding);

                return updatedBuilding;
            }
        }

        return null;
    }


    // ============================================================
    // DELETE
    // ============================================================

    /**
     * Deletes an existing building.
     *
     * DELETE /api/buildings/{id}
     */
    public Building deleteBuilding(String id) {

        for (int i = 0; i < buildings.size(); i++) {

            Building building = buildings.get(i);

            if (building.getId().equals(id)) {

                buildings.remove(i);

                return building;
            }
        }

        return null;
    }
}