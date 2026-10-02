package com.energystart.prod.repos;

import com.energystart.prod.energy.EnergyReport;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EnergyReportRepo extends MongoRepository<EnergyReport, String> {
}
