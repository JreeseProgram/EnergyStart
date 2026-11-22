package com.energystart.prod.service;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyMeterReading;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/** Shared eligibility checks for property summaries and report snapshots. */
public final class EnergyScoreQualification {
    private EnergyScoreQualification() {}

    public static List<String> reasons(YearMonth start, YearMonth end,
            List<EnergyMeter> meters, List<EnergyMeterReading> readings) {
        List<String> reasons = new ArrayList<>();
        if (ChronoUnit.MONTHS.between(start, end) + 1 < 12) {
            reasons.add("ENERGY STAR score requires at least 12 months of data");
        }
        if (meters.isEmpty()) {
            reasons.add("Add energy meters and readings to calculate a score");
        }
        for (EnergyMeter meter : meters) {
            if (meter.isDelivered()) continue;
            Set<String> months = readings.stream()
                    .filter(reading -> meter.getID().equals(reading.getAssociatedMeterID()))
                    .map(EnergyMeterReading::getDate).collect(Collectors.toSet());
            for (YearMonth month = start; !month.isAfter(end); month = month.plusMonths(1)) {
                if (!months.contains(month.toString())) {
                    reasons.add(meter.getMeterName() + " does not have data for every month");
                    break;
                }
            }
        }
        return reasons;
    }
}
