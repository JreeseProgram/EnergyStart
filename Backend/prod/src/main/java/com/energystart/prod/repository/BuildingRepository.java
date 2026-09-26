package com.energystart.prod.repository;

import com.energystart.prod.model.Building;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BuildingRepository extends MongoRepository<Building, String> {
}