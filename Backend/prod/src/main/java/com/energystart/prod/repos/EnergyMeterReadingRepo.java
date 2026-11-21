package com.energystart.prod.repos;

import com.energystart.prod.energy.EnergyMeterReading;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface EnergyMeterReadingRepo extends MongoRepository<EnergyMeterReading, String> {
    List<EnergyMeterReading> findAllByAssociatedMeterID(String associatedMeterID);

    @Query("{ 'associatedMeterID': { '$in': ?0 }, 'date': { '$gte': ?1, '$lte': ?2 } }")
    List<EnergyMeterReading> findAllByAssociatedMeterIDInAndDateBetween(List<String> associatedMeterID, String startDate, String endDate);

    void deleteAllByAssociatedMeterIDIn(List<String> associatedMeterIDs);
    boolean existsByAssociatedMeterIDAndDate(String associatedMeterID, String date);
    boolean existsByAssociatedMeterIDAndDateAndIdNot(String associatedMeterID, String date, String id);
}
