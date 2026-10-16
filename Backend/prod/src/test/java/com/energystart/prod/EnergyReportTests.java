package com.energystart.prod;

import com.energystart.prod.energy.EnergyReport;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EnergyReportTests {

    private JsonArray temperatures(String json) {
        return JsonParser.parseString(json).getAsJsonArray();
    }

    @Test
    void warmDaysProduceCoolingDegreeDays() {
        // Daily means are 82 and 81: 17 + 16 = 33 CDD.
        Integer[] result = EnergyReport.calculateDegreeDays(
                temperatures("[84, 82]"),
                temperatures("[80, 80]"));

        assertArrayEquals(new Integer[] {33, 0}, result);
    }

    @Test
    void coldDaysProduceHeatingDegreeDays() {
        // Both daily means are 60: 5 + 5 = 10 HDD.
        Integer[] result = EnergyReport.calculateDegreeDays(
                temperatures("[62, 62]"),
                temperatures("[58, 58]"));

        assertArrayEquals(new Integer[] {0, 10}, result);
    }

    @Test
    void mixedDaysCalculateBothTotals() {
        // Means of 70 and 60 produce 5 CDD and 5 HDD.
        Integer[] result = EnergyReport.calculateDegreeDays(
                temperatures("[75, 65]"),
                temperatures("[65, 55]"));

        assertArrayEquals(new Integer[] {5, 5}, result);
    }

    @Test
    void temperaturesAtBaseProduceNoDegreeDays() {
        Integer[] result = EnergyReport.calculateDegreeDays(
                temperatures("[70]"),
                temperatures("[60]"));

        assertArrayEquals(new Integer[] {0, 0}, result);
    }

    @Test
    void totalsAreRoundedAfterAddingAllDays() {
        // Each day contributes 0.3 HDD; total 0.6 rounds to 1.
        Integer[] result = EnergyReport.calculateDegreeDays(
                temperatures("[65, 65]"),
                temperatures("[64.4, 64.4]"));

        assertArrayEquals(new Integer[] {0, 1}, result);
    }

    @Test
    void daysWithMissingTemperaturesAreSkipped() {
        Integer[] result = EnergyReport.calculateDegreeDays(
                temperatures("[null, 75, 90]"),
                temperatures("[50, 65, null]"));

        assertArrayEquals(new Integer[] {5, 0}, result);
    }

    @Test
    void mismatchedTemperatureListsAreRejected() {
        assertThrows(
                IllegalArgumentException.class,
                () -> EnergyReport.calculateDegreeDays(
                        temperatures("[75, 80]"),
                        temperatures("[65]")));
    }
}
