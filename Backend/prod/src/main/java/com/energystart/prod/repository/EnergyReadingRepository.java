package com.energystart.prod.repository;

import com.energystart.prod.model.EnergyReading;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EnergyReadingRepository extends MongoRepository<EnergyReading, String> {
    List<EnergyReading> findByBuildingId(String buildingId);
    boolean existsByBuildingIdAndMeterIdAndRecordDate(String buildingId, String meterId,
                                                       java.time.LocalDate recordDate);
}
