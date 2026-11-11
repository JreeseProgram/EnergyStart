package com.energystart.prod.repos;

import com.energystart.prod.energy.EnergyMeterReading;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EnergyMeterReadingRepo extends MongoRepository<EnergyMeterReading, String> {
    List<EnergyMeterReading> findAllByAssociatedMeterID(String associatedMeterID);
}
