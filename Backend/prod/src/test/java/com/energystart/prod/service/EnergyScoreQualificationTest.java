package com.energystart.prod.service;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyMeterReading;
import org.junit.jupiter.api.Test;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class EnergyScoreQualificationTest {
    private final YearMonth start = YearMonth.of(2025, 11);
    private final YearMonth end = YearMonth.of(2026, 10);

    private EnergyMeter meter(String id) {
        EnergyMeter meter = new EnergyMeter();
        meter.setID(id);
        meter.setMeterName(id);
        return meter;
    }
    private List<EnergyMeterReading> completeReadings(String meterId) {
        List<EnergyMeterReading> readings = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            EnergyMeterReading reading = new EnergyMeterReading();
            reading.setAssociatedMeterID(meterId);
            reading.setDate(start.plusMonths(i).toString());
            readings.add(reading);
        }
        return readings;
    }
    @Test void acceptsInclusiveTwelveMonths() {
        assertTrue(EnergyScoreQualification.reasons(start, end,
                List.of(meter("electric")), completeReadings("electric")).isEmpty());
    }
    @Test void duplicatesCannotHideMissingMonthOrClaimPeriodIsShort() {
        List<EnergyMeterReading> readings = completeReadings("electric");
        readings.set(0, readings.get(1));
        assertEquals(List.of("electric does not have data for every month"),
                EnergyScoreQualification.reasons(start, end, List.of(meter("electric")), readings));
    }
    @Test void checksEveryMeterSeparately() {
        assertEquals(List.of("gas does not have data for every month"),
                EnergyScoreQualification.reasons(start, end,
                        List.of(meter("electric"), meter("gas")), completeReadings("electric")));
    }
    @Test void rejectsShortPeriodAndMissingMeters() {
        assertEquals(2, EnergyScoreQualification.reasons(start, start.plusMonths(2), List.of(), List.of()).size());
    }
    @Test void preservesDeliveredMeterCoverageException() {
        EnergyMeter delivered = meter("fuel");
        delivered.setDelivered(true);
        assertTrue(EnergyScoreQualification.reasons(start, end, List.of(delivered), List.of()).isEmpty());
    }
}
