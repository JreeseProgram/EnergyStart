package com.energystart.prod.service;

import com.energystart.prod.EnergyMeter;
import com.energystart.prod.EnergyMeter.TYPE_OF_METER;
import com.energystart.prod.dto.BuildingEuiResponse;
import com.energystart.prod.model.Building;
import com.energystart.prod.model.EnergyReading;
import com.energystart.prod.repository.BuildingRepository;
import com.energystart.prod.repository.EnergyReadingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class BuildingEuiService {
    private final BuildingRepository buildings;
    private final EnergyReadingRepository readings;

    public BuildingEuiService(BuildingRepository buildings, EnergyReadingRepository readings) {
        this.buildings = buildings;
        this.readings = readings;
    }

    public EnergyReading addReading(String buildingId, EnergyReading reading) {
        requireBuilding(buildingId);
        if (reading.getRecordDate() == null || reading.getRecordDate().getDayOfMonth() != 1
                || reading.getMeterId() == null || reading.getMeterId().isBlank()
                || reading.getMeterType() == null || reading.getUnit() == null
                || !Double.isFinite(reading.getAmount()) || reading.getAmount() <= 0
                || reading.getAmount() > Float.MAX_VALUE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "A meter ID, first day of the month, meter type, unit, and positive amount are required.");
        }
        // Verify that the team's meter class supports this fuel and unit pair.
        siteKbtu(reading);
        sourceFactor(reading.getMeterType());
        if (readings.existsByBuildingIdAndMeterIdAndRecordDate(
                buildingId, reading.getMeterId(), reading.getRecordDate())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This meter already has a reading for that month.");
        }
        reading.setId(null);
        reading.setBuildingId(buildingId);
        return readings.save(reading);
    }

    public BuildingEuiResponse calculate(String buildingId, int year) {
        Building building = requireBuilding(buildingId);
        if (year < 1900 || year > 9999) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reporting year.");
        }
        Double area = building.getGrossFloorArea();
        if (area == null || !Double.isFinite(area) || area <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Building grossFloorArea must be a positive number of square feet.");
        }
        List<EnergyReading> yearly = readings.findByBuildingId(buildingId).stream()
                .filter(r -> r.getRecordDate() != null && r.getRecordDate().getYear() == year)
                .toList();
        double site = 0;
        double source = 0;
        for (EnergyReading reading : yearly) {
            double amount = siteKbtu(reading);
            site += amount;
            source += amount * sourceFactor(reading.getMeterType());
        }
        long months = yearly.stream().map(EnergyReading::getRecordDate)
                .map(LocalDate::getMonthValue).distinct().count();
        return new BuildingEuiResponse(buildingId, year, round(site), round(site / area),
                round(source), round(source / area), yearly.size(), (int) months,
                months == 12 ? "12 months represented; verify coverage for every active meter."
                        : "INCOMPLETE: " + months + " of 12 months represented.");
    }

    private Building requireBuilding(String buildingId) {
        return buildings.findById(buildingId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Building not found: " + buildingId));
    }

    private double siteKbtu(EnergyReading reading) {
        try {
            EnergyMeter meter = new EnergyMeter(reading.getMeterType(), reading.getUnit(),
                    true, false, (float) reading.getAmount());
            return meter.getMeterKBtu();
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported meter or unit.", e);
        }
    }

    // U.S. Portfolio Manager source-to-site ratios for the fuel types supported here.
    private double sourceFactor(TYPE_OF_METER type) {
        if (type == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meter type is required.");
        }
        return switch (type) {
            case ELECTRIC_GRID -> 2.80;
            case ELECTRIC_SOLAR, ELECTRIC_WIND -> 1.00;
            case NATURAL_GAS -> 1.05;
            case FUEL_OIL_1, FUEL_OIL_2, FUEL_OIL_4, FUEL_OIL_5_AND_6, DIESEL, KEROSENE -> 1.01;
            case DISTRICT_STEAM, DISTRICT_HOT_WATER -> 1.20;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Source factor for " + type + " has not been added yet.");
        };
    }

    private double round(double value) { return Math.round(value * 100.0) / 100.0; }
}
