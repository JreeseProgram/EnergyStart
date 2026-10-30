
package com.energystart.prod.service;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.repos.EnergyMeterRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnergyMeterService {

    private final EnergyMeterRepo energyMeterRepo;

    // Constructor dependency injection
    public EnergyMeterService(EnergyMeterRepo energyMeterRepo) {
        this.energyMeterRepo = energyMeterRepo;
    }

    // CREATE - Save a new energy meter
    public EnergyMeter createMeter(EnergyMeter meter) {

        validateMeter(meter);

        // MongoDB will generate an ID for the new document.
        meter.setID(null);

        return energyMeterRepo.save(meter);
    }

    // READ - Retrieve all energy meters
    public List<EnergyMeter> getAllMeters() {
        return energyMeterRepo.findAll();
    }

    // READ - Retrieve an energy meter by ID
    public Optional<EnergyMeter> getMeterById(String id) {
        return energyMeterRepo.findById(id);
    }

    // UPDATE - Replace an existing energy meter
    public Optional<EnergyMeter> updateMeter(
            String id, EnergyMeter meter) {

        if (!energyMeterRepo.existsById(id)) {
            return Optional.empty();
        }

        validateMeter(meter);

        // Preserve the existing MongoDB document ID.
        meter.setID(id);

        return Optional.of(energyMeterRepo.save(meter));
    }

    // DELETE - Remove an energy meter
    public boolean deleteMeter(String id) {

        if (!energyMeterRepo.existsById(id)) {
            return false;
        }

        energyMeterRepo.deleteById(id);
        return true;
    }

    // Validate required meter information before saving.
    private void validateMeter(EnergyMeter meter) {

        if (meter == null) {
            throw new IllegalArgumentException(
                    "Energy meter cannot be null.");
        }

        if (meter.getAssociatedPropertyID() == null ||
                meter.getAssociatedPropertyID().isBlank()) {
            throw new IllegalArgumentException(
                    "An associated property ID is required.");
        }

        if (meter.getDate() == null) {
            throw new IllegalArgumentException(
                    "A meter date is required.");
        }

        if (meter.getMeterSelected() == null) {
            throw new IllegalArgumentException(
                    "A meter type is required.");
        }

        if (meter.getUnitOfMeasure() == null) {
            throw new IllegalArgumentException(
                    "A unit of measure is required.");
        }

        if (meter.getRawUse() < 0 ||
                !Float.isFinite(meter.getRawUse())) {
            throw new IllegalArgumentException(
                    "Raw energy usage must be a finite, nonnegative number.");
        }
    }
}
