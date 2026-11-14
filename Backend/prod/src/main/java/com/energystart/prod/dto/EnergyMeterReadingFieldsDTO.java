package com.energystart.prod.dto;

import java.time.LocalDateTime;

public record EnergyMeterReadingFieldsDTO(
        String id,
        String date,
        float usage,
        float cost,
        LocalDateTime createdAt
) {}
