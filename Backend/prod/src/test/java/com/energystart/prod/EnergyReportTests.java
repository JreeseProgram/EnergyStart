package com.energystart.prod;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyMeterReadings;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.report_types.*;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterReadingsRepo;
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
    @Autowired
    EnergyMeterReadingsRepo meterReadingsRepo;

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

        String targetDate = "1900-08";

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
        String targetDate = "1900-08";

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
        String targetDate = "1900-08";

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
        String targetDate = "1900-08";

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
        String targetDate = "1900-08";

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
        String targetDate = "1900-08";

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

    @Test
    void testMultiFamilyHousingScore(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Multi-Family-Housing",
                90001,
                "Test-Multi-Family-Housing",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        MultifamilyHousingReport mfhr = new MultifamilyHousingReport(
                120000,
                30000,
                1985,
                200,
                100,
                0,
                440,
                300
        );
        mfhr.setRelatedPropertyID("Test-Energy-Score-Multi-Family-Housing");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                2100000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                800.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Multi-Family-Housing");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Multi-Family-Housing");



        property = propertyRepo.save(property);
        mfhr = energyReportRepo.save(mfhr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                1287,
                4710
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(mfhr.getID());

        assertEquals(63, result);
    }

    @Test
    void testOfficeScore(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-office",
                90001,
                "Test-office",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        OfficeReport or = new OfficeReport(
                200000,
                30000,
                1985,
                300,
                300,
                1.0f,
                80
        );
        or.setRelatedPropertyID("Test-Energy-Score-office");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                3500000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                4000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-office");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-office");



        property = propertyRepo.save(property);
        or = energyReportRepo.save(or);

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
        energyReportRepo.deleteById(or.getID());

        assertEquals(57, result);
    }

    @Test
    void testCourthouseScore(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Courthouse",
                90001,
                "Test-Courthouse",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        CourtHouseReport cr = new CourtHouseReport(
                200000,
                30000,
                1985,
                300,
                300,
                1.0f,
                80
        );
        cr.setRelatedPropertyID("Test-Energy-Score-Courthouse");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                3500000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                4000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Courthouse");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Courthouse");



        property = propertyRepo.save(property);
        cr = energyReportRepo.save(cr);

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
        energyReportRepo.deleteById(cr.getID());

        assertEquals(57, result);
    }

    @Test
    void testBankBranchGT50000Score(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Bank-Branch",
                90001,
                "Test-Bank-Branch",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        BankBranchReport bbr = new BankBranchReport(
                200000,
                1500,
                1985,
                300,
                300,
                1.0f,
                80

        );
        bbr.setRelatedPropertyID("Test-Energy-Score-Bank-Branch");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                3500000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                4000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Bank-Branch");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Bank-Branch");



        property = propertyRepo.save(property);
        bbr = energyReportRepo.save(bbr);

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
        energyReportRepo.deleteById(bbr.getID());

        assertEquals(57, result);
    }

    @Test
    void testBankBranchLTE50000Score(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Bank-Branch-Small",
                90001,
                "Test-Bank-Branch",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        BankBranchReport bbr = new BankBranchReport(
                49000,
                1500,
                1985,
                300,
                300,
                1.0f,
                80

        );
        bbr.setRelatedPropertyID("Test-Energy-Score-Bank-Branch-Small");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                3500000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                4000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Bank-Branch-Small");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Bank-Branch-Small");



        property = propertyRepo.save(property);
        bbr = energyReportRepo.save(bbr);

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
        energyReportRepo.deleteById(bbr.getID());

        assertEquals(6, result);
    }

    @Test
    void testFinancialOfficeGT50000Score(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Financial-Office",
                90001,
                "Test-Bank-Branch",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        FinancialOfficeReport fr = new FinancialOfficeReport(
                200000,
                1500,
                1985,
                300,
                300,
                1.0f,
                80

        );
        fr.setRelatedPropertyID("Test-Energy-Score-Financial-Office");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                3500000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                4000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Financial-Office");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Financial-Office");



        property = propertyRepo.save(property);
        fr = energyReportRepo.save(fr);

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
        energyReportRepo.deleteById(fr.getID());

        assertEquals(57, result);
    }

    @Test
    void testFinancialOfficeLTE50000Score(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Financial-Office-Small",
                90001,
                "Test-Bank-Branch",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        FinancialOfficeReport fr = new FinancialOfficeReport(
                49000,
                1500,
                1985,
                300,
                300,
                1.0f,
                80

        );
        fr.setRelatedPropertyID("Test-Energy-Score-Financial-Office-Small");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                3500000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                4000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Financial-Office-Small");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Financial-Office-Small");



        property = propertyRepo.save(property);
        fr = energyReportRepo.save(fr);

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
        energyReportRepo.deleteById(fr.getID());

        assertEquals(6, result);
    }

    @Test
    void testRetailScore(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Retail",
                90001,
                "Test-Retail",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        RetailStoreReport rsr = new RetailStoreReport(
                50000,
                1500,
                1985,
                true,
                true,
                7,
                7,
                1.0f,
                1.0f,
                70

        );
        rsr.setRelatedPropertyID("Test-Energy-Score-Retail");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                480000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                200.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Retail");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Retail");



        property = propertyRepo.save(property);
        rsr = energyReportRepo.save(rsr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                2300,
                3850
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(rsr.getID());

        assertEquals(79, result);
    }

    @Test
    void testSupermarketScore(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Supermarket",
                90001,
                "Test-Supermarket",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        SupermarketReport sr = new SupermarketReport(
                50000,
                1500,
                1985,
                7,
                7,
                1.0f,
                1.0f,
                70

        );
        sr.setRelatedPropertyID("Test-Energy-Score-Supermarket");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                960000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                200.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Supermarket");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Supermarket");



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
                2300,
                3850
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(sr.getID());

        assertEquals(89, result);
    }

    @Test
    void testWholesaleScore(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Wholesale",
                90001,
                "Test-Wholesale",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        WholesaleClubReport wr = new WholesaleClubReport(
                50000,
                1500,
                1985,
                true,
                true,
                7,
                7,
                1.0f,
                1.0f,
                70

        );
        wr.setRelatedPropertyID("Test-Energy-Score-Wholesale");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                960000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                200.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Wholesale");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Wholesale");



        property = propertyRepo.save(property);
        wr = energyReportRepo.save(wr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                2300,
                3850
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(wr.getID());

        assertEquals(89, result);
    }

    @Test
    void testSeniorCommunity(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Senior-Living",
                90001,
                "Test-Senior-Living",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        SeniorLivingCommunityReport scr = new SeniorLivingCommunityReport(
                220000,
                15000,
                1985,
                480,
                525,
                85,
                25,
                15,
                14,
                310,
                11,
                260,
                1.0f,
                1.0f

        );
        scr.setRelatedPropertyID("Test-Energy-Score-Senior-Living");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                3070000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                166000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Senior-Living");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Senior-Living");



        property = propertyRepo.save(property);
        scr = energyReportRepo.save(scr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                1300,
                4200
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(scr.getID());

        assertEquals(65, result);
    }

    @Test
    void testVehicleDealershipScore(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Vehicle-Dealership",
                90001,
                "Test-Vehicle-Dealership",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        VehicleDealershipReport vdr = new VehicleDealershipReport(
                50000,
                20000,
                1985,
                250,
                70,
                1.0f,
                1.0f
        );
        vdr.setRelatedPropertyID("Test-Energy-Score-Vehicle-Dealership");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                439625.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                12000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Vehicle-Dealership");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Vehicle-Dealership");



        property = propertyRepo.save(property);
        vdr = energyReportRepo.save(vdr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                3663,
                1904
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(vdr.getID());

        assertEquals(76, result);
    }

    @Test
    void testWarehouseScore(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Warehouse",
                90001,
                "Test-Warehouse",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        WarehouseReport wr = new WarehouseReport(
                125000,
                30000,
                1985,
                90,
                0.10f,
                0.20f,
                1.0f,
                60
        );
        wr.setRelatedPropertyID("Test-Energy-Score-Warehouse");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                850000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                35000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Warehouse");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Warehouse");



        property = propertyRepo.save(property);
        wr = energyReportRepo.save(wr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                1343,
                5806
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(wr.getID());

        assertEquals(58, result);
    }

    @Test
    void testRefrigeratedWarehouseScore(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Refrigerated-Warehouse",
                90001,
                "Test-Refrigerated-Warehouse",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        WarehouseRefrigeratedReport wrr = new WarehouseRefrigeratedReport(
                125000,
                30000,
                1985,
                60,
                90,
                0.10f,
                1.0f,
                0.20f
        );
        wrr.setRelatedPropertyID("Test-Energy-Score-Refrigerated-Warehouse");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                850000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                35000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Refrigerated-Warehouse");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Refrigerated-Warehouse");



        property = propertyRepo.save(property);
        wrr = energyReportRepo.save(wrr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                1343,
                5806
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(wrr.getID());

        assertEquals(58, result);
    }

    @Test
    void testDistributionCenterScore(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Distribution-Center",
                90001,
                "Test-Distribution-Center",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        DistributionCenterReport dcr = new DistributionCenterReport(
                125000,
                30000,
                1985,
                90,
                0.10f,
                0.20f,
                1.0f,
                60
        );
        dcr.setRelatedPropertyID("Test-Energy-Score-Distribution-Center");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                850000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                35000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Distribution-Center");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Distribution-Center");



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
                1343,
                5806
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(dcr.getID());

        assertEquals(58, result);
    }

    @Test
    void testWorshipFacilityScore(){
        String targetDate = "1900-08";

        Property property = new Property(
                "Test-Energy-Score-Worship-Facility",
                90001,
                "Test-Hotel",
                "123 street ave",
                "CityPlace",
                "FL",
                32801,
                "");
        WorshipFacilityReport wfr = new WorshipFacilityReport(
                20000,
                3000,
                1985,
                1000,
                1.0f,
                1.0f,
                300,
                40
        );
        wfr.setRelatedPropertyID("Test-Energy-Score-Worship-Facility");
        EnergyMeter meterElec = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID,
                EnergyMeter.TYPE_OF_MEASURE.kWh,
                targetDate,
                true,
                false,
                85000.0f
        );
        EnergyMeter meterGas = new EnergyMeter(
                EnergyMeter.TYPE_OF_METER.NATURAL_GAS,
                EnergyMeter.TYPE_OF_MEASURE.Therms,
                targetDate,
                true,
                true,
                2000.0f
        );

        meterElec.setAssociatedPropertyID("Test-Energy-Score-Worship-Facility");
        meterGas.setAssociatedPropertyID("Test-Energy-Score-Worship-Facility");



        property = propertyRepo.save(property);
        wfr = energyReportRepo.save(wfr);

        meterElec.calcEUI(energyReportRepo);
        meterGas.calcEUI(energyReportRepo);

        meterElec = meterRepo.save(meterElec);
        meterGas = meterRepo.save(meterGas);

        property.calculateEnergyScore(
                energyReportRepo,
                meterRepo,
                targetDate,
                targetDate,
                1325,
                3558
        );

        int result = property.getEnergyScore();

        propertyRepo.deleteById(property.getId());
        meterRepo.deleteById(meterElec.getID());
        meterRepo.deleteById(meterGas.getID());
        energyReportRepo.deleteById(wfr.getID());

        assertEquals(69, result);
    }

}