
package com.energystart.prod.service;

import com.energystart.prod.energy.EnergyMeterReading;
import com.energystart.prod.repos.EnergyMeterReadingRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnergyMeterReadingService {

    private final EnergyMeterReadingRepo readingRepo;

    public EnergyMeterReadingService(EnergyMeterReadingRepo readingRepo) {
        this.readingRepo = readingRepo;
    }

    // CREATE
    public EnergyMeterReading createReading(EnergyMeterReading reading) {
        reading.setId(null);
        return readingRepo.save(reading);
    }

    // READ - All readings for a particular meter
    public List<EnergyMeterReading> getReadingsByMeterId(String meterId) {
        return readingRepo.findAllByAssociatedMeterID(meterId);
    }

    // READ - One reading by its ID
    public Optional<EnergyMeterReading> getReadingById(String id) {
        return readingRepo.findById(id);
    }

    // UPDATE
    public Optional<EnergyMeterReading> updateReading(
            String id, EnergyMeterReading reading) {

        if (!readingRepo.existsById(id)) {
            return Optional.empty();
        }

        reading.setId(id);
        return Optional.of(readingRepo.save(reading));
    }

    // DELETE
    public boolean deleteReading(String id) {
        if (!readingRepo.existsById(id)) {
            return false;
        }

        readingRepo.deleteById(id);
        return true;
    }
}
