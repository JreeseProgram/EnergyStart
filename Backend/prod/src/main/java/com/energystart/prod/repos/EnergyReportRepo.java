package com.energystart.prod.repos;

import com.energystart.prod.energy.EnergyReport;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EnergyReportRepo extends MongoRepository<EnergyReport, String> {

    List<EnergyReport> findAllByRelatedPropertyID(String relatedPropertyID);
}
