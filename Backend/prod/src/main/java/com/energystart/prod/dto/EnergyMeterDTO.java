
package com.energystart.prod.dto;

import com.energystart.prod.energy.EnergyMeter.TYPE_OF_METER;
import com.energystart.prod.energy.EnergyMeter.TYPE_OF_MEASURE;

import java.util.List;

public record EnergyMeterDTO(

        String meterId,

        List<EnergyMeterReadingFieldsDTO> readings,

        String propertyId,

        String meterName,

        TYPE_OF_METER meterType,

        TYPE_OF_MEASURE unitOfMeasure,

        boolean inUse,

        boolean isDelivered

) {
}
