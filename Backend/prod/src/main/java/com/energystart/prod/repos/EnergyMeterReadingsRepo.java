package com.energystart.prod.repos;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyMeterReadings;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EnergyMeterReadingsRepo extends MongoRepository<EnergyMeterReadings, String> {
    List<EnergyMeterReadings> findAllByAssociatedMeterID(String associatedMeterID);
}
