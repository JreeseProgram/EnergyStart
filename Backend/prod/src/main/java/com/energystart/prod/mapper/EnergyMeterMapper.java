
package com.energystart.prod.mapper;

import com.energystart.prod.dto.EnergyMeterDTO;
import com.energystart.prod.energy.EnergyMeter;
import org.springframework.stereotype.Component;

@Component
public class EnergyMeterMapper {

    // Convert frontend DTO into backend MongoDB model
    public EnergyMeter toEnergyMeter(EnergyMeterDTO dto) {

        if (dto == null) {
            throw new IllegalArgumentException("Energy meter DTO cannot be null.");
        }

        EnergyMeter meter = new EnergyMeter();

        meter.setID(dto.id());
        meter.setAssociatedPropertyID(dto.propertyId());
        meter.setMeterName(dto.meterId());
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

        return new EnergyMeterDTO(
                meter.getID(),
                meter.getAssociatedPropertyID(),
                meter.getMeterName(),
                meter.getMeterSelected(),
                meter.getUnitOfMeasure(),
                meter.isInUse(),
                meter.isDelivered()
        );
    }
}
