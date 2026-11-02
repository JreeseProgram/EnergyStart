package com.energystart.prod;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.report_types.*;
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

        String targetDate = "2026-08";

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
                3, //Changed to 3 from 6 as its literally wrong on official documentation
                15,
                5,
                1.0f,
                1.0f
                );
        csr.setRelatedPropertyID("Test-Energy-Score-conv-store");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                490000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                5446.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-conv-store");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-conv-store");



        property = propertyRepo.save(property);
        csr = energyReportRepo.save(csr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                480,
                9285
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(csr.getID());

        assertEquals(53, result);


    }

    @Test
    void testDataCenterScore(){
        String targetDate = "2026-08";

        Property property = new Property(
                "Test-Energy-Score-Data-center",
                90001,
                "Test-data-center",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        DataCenterReport dcr = new DataCenterReport(
                1,
                1000,
                2008,
                8500000
        );
        dcr.setRelatedPropertyID("Test-Energy-Score-Data-center");

        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                15000000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                20000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Data-center");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Data-center");



        property = propertyRepo.save(property);
        dcr = energyReportRepo.save(dcr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                -1,
                -1
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(dcr.getID());

        assertEquals(72, result);
    }

    @Test
    void testHospitalScore(){
        String targetDate = "2026-08";

        Property property = new Property(
                "Test-Energy-Score-hospital",
                90001,
                "Test-hospital",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        HospitalReport hr = new HospitalReport(
                400000,
                2000,
                1998,
                1200,
                1,
                220
        );
        hr.setRelatedPropertyID("Test-Energy-Score-hospital");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                10500000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                450000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-hospital");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-hospital");



        property = propertyRepo.save(property);
        hr = energyReportRepo.save(hr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                1600,
                3400
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(hr.getID());

        assertEquals(82, result);
    }

    @Test
    void testHotelScore(){
        String targetDate = "2026-08";

        Property property = new Property(
                "Test-Energy-Score-Hotel",
                90001,
                "Test-Hotel",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        HotelReport hr = new HotelReport(
                300000,
                30000,
                1985,
                true,
                20,
                360,
                180,
                1.0f,
                1.0f
        );
        hr.setRelatedPropertyID("Test-Energy-Score-Hotel");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                4500000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                110000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Hotel");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Hotel");



        property = propertyRepo.save(property);
        hr = energyReportRepo.save(hr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                1388,
                4532
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(hr.getID());

        assertEquals(63, result);
    }

    @Test
    void testSchoolScore(){
        String targetDate = "2026-08";

        Property property = new Property(
                "Test-Energy-Score-School",
                90001,
                "Test-School",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        SchoolReport sr = new SchoolReport(
                100000,
                10000,
                1985,
                true,
                false,
                true,
                80,
                1.0f,
                1.0f
        );
        sr.setRelatedPropertyID("Test-Energy-Score-School");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                700000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                20000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-School");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-School");



        property = propertyRepo.save(property);
        sr = energyReportRepo.save(sr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                1046,
                4937
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(sr.getID());

        assertEquals(81, result);
    }

    @Test
    void testMedicalOfficeScore(){
        String targetDate = "2026-08";

        Property property = new Property(
                "Test-Energy-Score-Medical-Office",
                90001,
                "Test-Medical-Office",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        MedicalOfficeReport mor = new MedicalOfficeReport(
                50000,
                3000,
                1985,
                1,
                1,
                100,
                55
        );
        mor.setRelatedPropertyID("Test-Energy-Score-Medical-Office");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                703400.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                42000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Medical-Office");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Medical-Office");



        property = propertyRepo.save(property);
        mor = energyReportRepo.save(mor);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                1074,
                6126
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(mor.getID());

        assertEquals(78, result);
    }

}