package com.energystart.prod.repos;

import com.energystart.prod.energy.EnergyMeter;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface EnergyMeterRepo extends MongoRepository<EnergyMeter,String> {
    List<EnergyMeter> findByAssociatedReportIDAndDateBetween(
            String associatedReportID,
            LocalDate low,
            LocalDate high
    );
}
