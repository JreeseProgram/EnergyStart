package com.energystart.prod.service;

import com.energystart.prod.model.Building;
import com.energystart.prod.repository.BuildingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BuildingService {

    private final BuildingRepository buildingRepository;

    public BuildingService(BuildingRepository buildingRepository) {
        this.buildingRepository = buildingRepository;
    }

    public List<Building> getAllBuildings() {
        return buildingRepository.findAll();
    }

    public Building getBuildingById(String id) {
        return buildingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Building not found: " + id));
    }

    public Building createBuilding(Building building) {
        building.setId(null); // MongoDB generates the ID for a new building.
        return buildingRepository.save(building);
    }

    public String updateBuilding(String id, Building building) {
        Building existing = getBuildingById(id);
        existing.setProperty_id(building.getProperty_id());
        existing.setBuilding_id(building.getBuilding_id());
        existing.setBuilding_size(building.getBuilding_size());
        existing.setPrimaryUseType(building.getPrimaryUseType());
        buildingRepository.save(existing);
        return "Building updated: " + id;
    }

    public String deleteBuilding(String id) {
        Building existing = getBuildingById(id);
        buildingRepository.delete(existing);
        return "Building deleted: " + id;
    }
}