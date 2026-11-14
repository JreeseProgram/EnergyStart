
package com.energystart.prod.dto;

import com.energystart.prod.energy.EnergyMeter.TYPE_OF_METER;
import com.energystart.prod.energy.EnergyMeter.TYPE_OF_MEASURE;

public record EnergyMeterDTO(

        String id,

        String propertyId,

        String meterId,

        TYPE_OF_METER meterType,

        TYPE_OF_MEASURE unitOfMeasure,

        boolean inUse,

        boolean isDelivered

) {
}
