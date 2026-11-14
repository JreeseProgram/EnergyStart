
package com.energystart.prod.mapper;

import com.energystart.prod.dto.EnergyMeterDTO;
import com.energystart.prod.dto.EnergyMeterReadingFieldsDTO;
import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyMeterReading;
import com.energystart.prod.repos.EnergyMeterReadingRepo;
import com.energystart.prod.repos.EnergyMeterRepo;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class EnergyMeterMapper {

    EnergyMeterReadingRepo energyMeterReadingRepo;
    EnergyMeterRepo energyMeterRepo;

    //Dependency Injection
    public EnergyMeterMapper(EnergyMeterReadingRepo energyMeterReadingRepo) {
        this.energyMeterReadingRepo = energyMeterReadingRepo;
    }

    // Convert frontend DTO into backend MongoDB model
    public EnergyMeter toEnergyMeter(EnergyMeterDTO dto) {

        if (dto == null) {
            throw new IllegalArgumentException("Energy meter DTO cannot be null.");
        }

        EnergyMeter meter = new EnergyMeter();

        meter.setID(dto.meterId());
        meter.setAssociatedPropertyID(dto.propertyId());
        meter.setMeterName(dto.meterName());
        meter.setMeterSelected(dto.meterType());
        meter.setUnitOfMeasure(dto.unitOfMeasure());
        meter.setInUse(dto.inUse());
        meter.setDelivered(dto.isDelivered());

        return meter;
    }

    // Convert backend MongoDB model into frontend DTO
    public EnergyMeterDTO toEnergyMeterDTO(EnergyMeter meter) {

        if (meter == null) {
            throw new IllegalArgumentException("Energy meter cannot be null.");
        }

        List<EnergyMeterReading>  energyMeterReadings =
                energyMeterReadingRepo.findAllByAssociatedMeterID(meter.getID());

        List<EnergyMeterReadingFieldsDTO> convertedReadings = new ArrayList<>();

        for (EnergyMeterReading energyMeterReading : energyMeterReadings) {
            convertedReadings.add(new EnergyMeterReadingFieldsDTO(
                    energyMeterReading.getId(),
                    energyMeterReading.getDate(),
                    energyMeterReading.getRawUse(),
                    energyMeterReading.getCost(),
                    LocalDateTime.now()
            ));
        }
        return new EnergyMeterDTO(
                meter.getID(),
                convertedReadings,
                meter.getAssociatedPropertyID(),
                meter.getMeterName(),
                meter.getMeterSelected(),
                meter.getUnitOfMeasure(),
                meter.isInUse(),
                meter.isDelivered()
        );
    }

    // Convert backend MongoDB model into frontend DTO
    public List<EnergyMeterDTO> toEnergyMeterDatedDTO(
            String propertyId,
            YearMonth startDate,
            YearMonth endDate) {

        if (propertyId == null) {
            throw new IllegalArgumentException("Energy meter cannot be null.");
        }
        List<EnergyMeter> meters = energyMeterRepo.findByAssociatedPropertyIDAndDateBetween(
                propertyId,
                startDate.toString(),
                endDate.toString());

        List<String> meterIDs = meters.stream()
                .map(EnergyMeter::getID)
                .toList();

        List<EnergyMeterReading> energyMeterReadings =
                energyMeterReadingRepo.findAllByAssociatedMeterIDInAndDateBetween(
                        meterIDs,
                        startDate.toString(),
                        endDate.toString());


        List<EnergyMeterDTO> convertedMeters = new ArrayList<>();

        for (EnergyMeter meter : meters) {
            List<EnergyMeterReading> matchingReadings = new ArrayList<>();
            List<EnergyMeterReadingFieldsDTO> convertedReadings = new ArrayList<>();
            matchingReadings = energyMeterReadings.stream()
                    .filter(reading -> meter.getID().equals(reading.getAssociatedMeterID()))
                    .toList();
            convertedReadings = matchingReadings.stream()
                    .map(record -> new EnergyMeterReadingFieldsDTO(
                            record.getId(),
                            record.getDate(),
                            record.getRawUse(),
                            record.getCost(),
                            LocalDateTime.now()
                    ))
                    .toList();
            convertedMeters.add(new EnergyMeterDTO(
                    meter.getID(),
                    convertedReadings,
                    meter.getAssociatedPropertyID(),
                    meter.getMeterName(),
                    meter.getMeterSelected(),
                    meter.getUnitOfMeasure(),
                    meter.isInUse(),
                    meter.isDelivered()
            ));
        }
        return convertedMeters;
    }
}
