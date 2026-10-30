package com.energystart.prod;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.report_types.ConvenienceStoreReport;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.EnergyReportRepo;
import com.energystart.prod.repos.PropertyRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.mongodb.test.autoconfigure.DataMongoTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
@DataMongoTest(properties = "spring.mongodb.uri=${MONGODB_URI}")
class EnergyReportTests {

    //Repos in use for the tests
    @Autowired
    EnergyMeterRepo meterRepo;
    @Autowired
    EnergyReportRepo reportRepo;
    @Autowired
    PropertyRepo propertyRepo;
    @Autowired
    private EnergyReportRepo energyReportRepo;

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
        assertEquals(11, resultArray[1]);

    }

    @Test
    void testConvenienceStoreScore(){

        Property property = new Property(
                "Test-Energy-Score-conv-store",
                90001,
                "Test-Conv-Store",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        ConvenienceStoreReport csr = new ConvenienceStoreReport(
                8847,
                10,
                1987,
                407,
                87,
                6,
                15,
                5,
                1.0f,
                1.0f
                );
        csr.setRelatedPropertyID("Test-Energy-Score-conv-store");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                true,
                false,
                490000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                true,
                true,
                5446.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-conv-store");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-conv-store");

        propertyRepo.save(property);
        meterRepo.save(meterElec);
        meterRepo.save(meterGas);
        energyReportRepo.save(csr);

        property.calculateEnergyScore(
                LocalDate.now(),
                LocalDate.now(),
                480,
                9285
        );

        int result = property.getEnergyScore();

        propertyRepo.delete(property);
        meterRepo.delete(meterElec);
        meterRepo.delete(meterGas);
        energyReportRepo.delete(csr);

        assertEquals(53, result);


    }

}