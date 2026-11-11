package com.energystart.prod.repos;

import com.energystart.prod.energy.EnergyMeter;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EnergyMeterRepo extends MongoRepository<EnergyMeter,String> {
    @Query("{ 'associatedPropertyID' : ?0, 'date' : { $gte : ?1, $lte : ?2 } }")
    List<EnergyMeter> findByAssociatedPropertyIDAndDateBetween(
            String associatedPropertyID,
            String low,
            String high
    );

    EnergyMeter findByID(String id);
}
