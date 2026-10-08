package com.energystart.prod;

import com.energystart.prod.energy.EnergyReport;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EnergyReportTests {

    @Test
    void testRetrieveCDDHDD1() {
        LocalDate startDate = LocalDate.of(2026,8,1);
        LocalDate endDate = LocalDate.of(2026,8,2);
        int zipcode = 32812;

        Integer[] resultArray = EnergyReport.retrieveCDDHDD(zipcode, startDate, endDate);

        assertEquals(33, resultArray[0]);
        assertEquals(0, resultArray[1]);

    }

    @Test
    void testRetrieveCDDHDD2() {
        LocalDate startDate = LocalDate.of(2025,12,10);
        LocalDate endDate = LocalDate.of(2025,12,11);
        int zipcode = 32812;

        Integer[] resultArray = EnergyReport.retrieveCDDHDD(zipcode, startDate, endDate);

        assertEquals(0, resultArray[0]);
        assertEquals(10, resultArray[1]);

    }

}