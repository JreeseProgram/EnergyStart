
package com.energystart.prod.mapper;

import com.energystart.prod.dto.buildinguse.BuildingUseType;
import com.energystart.prod.dto.buildinguse.types.OfficeBuildingUseDTO;
import com.energystart.prod.energy.report_types.OfficeReport;

import com.energystart.prod.dto.buildinguse.types.BankBranchBuildingUseDTO;
import com.energystart.prod.energy.report_types.BankBranchReport;

import com.energystart.prod.dto.buildinguse.types.CourtHouseBuildingUseDTO;
import com.energystart.prod.energy.report_types.CourtHouseReport;

import com.energystart.prod.dto.buildinguse.types.FinancialOfficeBuildingUseDTO;
import com.energystart.prod.energy.report_types.FinancialOfficeReport;

import com.energystart.prod.dto.buildinguse.types.HospitalBuildingUseDTO;
import com.energystart.prod.energy.report_types.HospitalReport;

import com.energystart.prod.dto.buildinguse.types.MedicalOfficeBuildingUseDTO;
import com.energystart.prod.energy.report_types.MedicalOfficeReport;

import com.energystart.prod.dto.buildinguse.types.ConvenienceStoreBuildingUseDTO;
import com.energystart.prod.energy.report_types.ConvenienceStoreReport;

import com.energystart.prod.dto.buildinguse.types.DistributionCenterBuildingUseDTO;
import com.energystart.prod.energy.report_types.DistributionCenterReport;

import com.energystart.prod.dto.buildinguse.types.HotelBuildingUseDTO;
import com.energystart.prod.energy.report_types.HotelReport;

import com.energystart.prod.dto.buildinguse.types.MultifamilyHousingBuildingUseDTO;
import com.energystart.prod.energy.report_types.MultifamilyHousingReport;

import com.energystart.prod.dto.buildinguse.types.RetailStoreBuildingUseDTO;
import com.energystart.prod.energy.report_types.RetailStoreReport;

import com.energystart.prod.dto.buildinguse.types.SchoolBuildingUseDTO;
import com.energystart.prod.energy.report_types.SchoolReport;

import com.energystart.prod.dto.buildinguse.types.SeniorLivingBuildingUseDTO;
import com.energystart.prod.energy.report_types.SeniorLivingCommunityReport;

import com.energystart.prod.dto.buildinguse.types.SupermarketBuildingUseDTO;
import com.energystart.prod.energy.report_types.SupermarketReport;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BuildingUseMapperTest {

    private final BuildingUseMapper mapper = new BuildingUseMapper();

    @Test
    void shouldConvertOfficeDTOToOfficeReport() {

        OfficeBuildingUseDTO dto = new OfficeBuildingUseDTO(
                null,
                null,
                "property-123",
                BuildingUseType.OFFICE,
                10000.0,
                500.0,
                2010,
                75,
                30,
                85.0,
                45.0
        );

        OfficeReport report = mapper.toOfficeReport(dto);

        assertEquals("property-123", report.getRelatedPropertyID());
        assertEquals(10000, report.getGrossFloorArea());
        assertEquals(500, report.getParkingSize());
        assertEquals(2010, report.getYearOfConstruction());
        assertEquals(75, report.getNumOfComputers());
        assertEquals(30, report.getNumOfWorkersMainShift());
        assertEquals(85.0f, report.getPercentCooled(), 0.001f);
        assertEquals(45, report.getWeeklyOperatingHours());
    }

    @Test
    void shouldConvertOfficeReportToOfficeDTO() {

        OfficeReport report = new OfficeReport();

        report.setID("report-123");
        report.setRelatedPropertyID("property-123");
        report.setGrossFloorArea(10000);
        report.setParkingSize(500);
        report.setYearOfConstruction(2010);
        report.setNumOfComputers(75);
        report.setNumOfWorkersMainShift(30);
        report.setPercentCooled(85.0f);
        report.setWeeklyOperatingHours(45);

        OfficeBuildingUseDTO dto = mapper.toOfficeDTO(report);

        assertEquals("report-123", dto.id());
        assertEquals("property-123", dto.propertyId());
        assertEquals(BuildingUseType.OFFICE, dto.buildingUseType());
        assertEquals(10000.0, dto.grossFloorArea());
        assertEquals(500.0, dto.parkingSize());
        assertEquals(2010, dto.yearOfConstruction());
        assertEquals(75, dto.numOfComputers());
        assertEquals(30, dto.numOfWorkersMainShift());
        assertEquals(85.0, dto.percentCooled(), 0.001);
        assertEquals(45.0, dto.weeklyOperatingHours());
        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectFractionalFloorArea() {

        OfficeBuildingUseDTO dto = new OfficeBuildingUseDTO(
                null,
                null,
                "property-123",
                BuildingUseType.OFFICE,
                10000.5,
                500.0,
                2010,
                75,
                30,
                85.0,
                45.0
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toOfficeReport(dto)
        );
    }

    @Test
    void shouldRejectIncorrectBuildingUseType() {

        OfficeBuildingUseDTO dto = new OfficeBuildingUseDTO(
                null,
                null,
                "property-123",
                BuildingUseType.HOTEL,
                10000.0,
                500.0,
                2010,
                75,
                30,
                85.0,
                45.0
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toOfficeReport(dto)
        );
    }

    @Test
    void shouldRejectWeeklyHoursAbove168() {

        OfficeBuildingUseDTO dto = new OfficeBuildingUseDTO(
                null,
                null,
                "property-123",
                BuildingUseType.OFFICE,
                10000.0,
                500.0,
                2010,
                75,
                30,
                85.0,
                169.0
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toOfficeReport(dto)
        );
    }



    @Test
    void shouldConvertBankBranchDTOToReport() {

        BankBranchBuildingUseDTO dto = new BankBranchBuildingUseDTO(
                null,
                null,
                "property-456",
                BuildingUseType.BANK_BRANCH,
                8500.0,
                300.0,
                2005,
                12,
                20,
                90.0,
                55.0
        );

        BankBranchReport report = mapper.toBankBranchReport(dto);

        assertEquals("property-456", report.getRelatedPropertyID());
        assertEquals(8500, report.getGrossFloorArea());
        assertEquals(300, report.getParkingSize());
        assertEquals(2005, report.getYearOfConstruction());

        assertEquals(12, report.getNumOfWorkersMainShift());
        assertEquals(20, report.getNumOfComputers());
        assertEquals(90.0f, report.getPercentCooled(), 0.001f);
        assertEquals(55, report.getWeeklyOperatingHours());
    }

    @Test
    void shouldConvertBankBranchReportToDTO() {

        BankBranchReport report = new BankBranchReport();

        report.setID("bank-report-123");
        report.setRelatedPropertyID("property-456");
        report.setGrossFloorArea(8500);
        report.setParkingSize(300);
        report.setYearOfConstruction(2005);
        report.setNumOfWorkersMainShift(12);
        report.setNumOfComputers(20);
        report.setPercentCooled(90.0f);
        report.setWeeklyOperatingHours(55);

        BankBranchBuildingUseDTO dto = mapper.toBankBranchDTO(report);

        assertEquals("bank-report-123", dto.id());
        assertEquals("property-456", dto.propertyId());
        assertEquals(BuildingUseType.BANK_BRANCH, dto.buildingUseType());

        assertEquals(8500.0, dto.grossFloorArea());
        assertEquals(300.0, dto.parkingSize());
        assertEquals(2005, dto.yearOfConstruction());

        assertEquals(12, dto.numOfWorkersMainShift());
        assertEquals(20, dto.numOfComputers());
        assertEquals(90.0, dto.percentCooled(), 0.001);
        assertEquals(55.0, dto.weeklyOperatingHours());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectIncorrectBankBranchType() {

        BankBranchBuildingUseDTO dto = new BankBranchBuildingUseDTO(
                null,
                null,
                "property-456",
                BuildingUseType.OFFICE,
                8500.0,
                300.0,
                2005,
                12,
                20,
                90.0,
                55.0
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toBankBranchReport(dto)
        );
    }



    @Test
    void shouldConvertCourtHouseDTOToReport() {

        CourtHouseBuildingUseDTO dto = new CourtHouseBuildingUseDTO(
                null,
                null,
                "property-789",
                BuildingUseType.COURT_HOUSE,
                12000.0,
                500.0,
                1998,
                45,
                30,
                85.0,
                60.0
        );

        CourtHouseReport report = mapper.toCourtHouseReport(dto);

        assertEquals("property-789", report.getRelatedPropertyID());
        assertEquals(12000, report.getGrossFloorArea());
        assertEquals(500, report.getParkingSize());
        assertEquals(1998, report.getYearOfConstruction());

        assertEquals(45, report.getNumOfComputers());
        assertEquals(30, report.getNumOfWorkersMainShift());
        assertEquals(85.0f, report.getPercentCooled(), 0.001f);
        assertEquals(60, report.getWeeklyOperatingHours());
    }

    @Test
    void shouldConvertCourtHouseReportToDTO() {

        CourtHouseReport report = new CourtHouseReport();

        report.setID("court-report-123");
        report.setRelatedPropertyID("property-789");
        report.setGrossFloorArea(12000);
        report.setParkingSize(500);
        report.setYearOfConstruction(1998);
        report.setNumOfComputers(45);
        report.setNumOfWorkersMainShift(30);
        report.setPercentCooled(85.0f);
        report.setWeeklyOperatingHours(60);

        CourtHouseBuildingUseDTO dto = mapper.toCourtHouseDTO(report);

        assertEquals("court-report-123", dto.id());
        assertEquals("property-789", dto.propertyId());
        assertEquals(BuildingUseType.COURT_HOUSE, dto.buildingUseType());

        assertEquals(12000.0, dto.grossFloorArea());
        assertEquals(500.0, dto.parkingSize());
        assertEquals(1998, dto.yearOfConstruction());

        assertEquals(45, dto.numOfComputers());
        assertEquals(30, dto.numOfWorkersMainShift());
        assertEquals(85.0, dto.percentCooled(), 0.001);
        assertEquals(60.0, dto.weeklyOperatingHours());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectIncorrectCourtHouseType() {

        CourtHouseBuildingUseDTO dto = new CourtHouseBuildingUseDTO(
                null,
                null,
                "property-789",
                BuildingUseType.OFFICE,
                12000.0,
                500.0,
                1998,
                45,
                30,
                85.0,
                60.0
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toCourtHouseReport(dto)
        );
    }

    @Test
    void shouldConvertFinancialOfficeDTOToReport() {

        FinancialOfficeBuildingUseDTO dto =
                new FinancialOfficeBuildingUseDTO(
                        null,
                        null,
                        "property-999",
                        BuildingUseType.FINANCIAL_OFFICE,
                        15000.0,
                        450.0,
                        2010,
                        75,
                        40,
                        95.0,
                        50.0
                );

        FinancialOfficeReport report =
                mapper.toFinancialOfficeReport(dto);

        assertEquals("property-999", report.getRelatedPropertyID());
        assertEquals(15000, report.getGrossFloorArea());
        assertEquals(450, report.getParkingSize());
        assertEquals(2010, report.getYearOfConstruction());

        assertEquals(75, report.getNumOfComputers());
        assertEquals(40, report.getNumOfWorkersMainShift());
        assertEquals(95.0f, report.getPercentCooled(), 0.001f);
        assertEquals(50, report.getWeeklyOperatingHours());
    }

    @Test
    void shouldConvertFinancialOfficeReportToDTO() {

        FinancialOfficeReport report = new FinancialOfficeReport();

        report.setID("financial-report-123");
        report.setRelatedPropertyID("property-999");
        report.setGrossFloorArea(15000);
        report.setParkingSize(450);
        report.setYearOfConstruction(2010);
        report.setNumOfComputers(75);
        report.setNumOfWorkersMainShift(40);
        report.setPercentCooled(95.0f);
        report.setWeeklyOperatingHours(50);

        FinancialOfficeBuildingUseDTO dto =
                mapper.toFinancialOfficeDTO(report);

        assertEquals("financial-report-123", dto.id());
        assertEquals("property-999", dto.propertyId());
        assertEquals(
                BuildingUseType.FINANCIAL_OFFICE,
                dto.buildingUseType()
        );

        assertEquals(15000.0, dto.grossFloorArea());
        assertEquals(450.0, dto.parkingSize());
        assertEquals(2010, dto.yearOfConstruction());

        assertEquals(75, dto.numOfComputers());
        assertEquals(40, dto.numOfWorkersMainShift());
        assertEquals(95.0, dto.percentCooled(), 0.001);
        assertEquals(50.0, dto.weeklyOperatingHours());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectIncorrectFinancialOfficeType() {

        FinancialOfficeBuildingUseDTO dto =
                new FinancialOfficeBuildingUseDTO(
                        null,
                        null,
                        "property-999",
                        BuildingUseType.OFFICE,
                        15000.0,
                        450.0,
                        2010,
                        75,
                        40,
                        95.0,
                        50.0
                );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toFinancialOfficeReport(dto)
        );
    }



    @Test
    void shouldConvertHospitalDTOToReport() {

        HospitalBuildingUseDTO dto = new HospitalBuildingUseDTO(
                null,
                null,
                "property-hospital-001",
                BuildingUseType.HOSPITAL,
                250000.0,
                1200.0,
                2008,
                850,
                4,
                320
        );

        HospitalReport report = mapper.toHospitalReport(dto);

        assertEquals(
                "property-hospital-001",
                report.getRelatedPropertyID()
        );
        assertEquals(250000, report.getGrossFloorArea());
        assertEquals(1200, report.getParkingSize());
        assertEquals(2008, report.getYearOfConstruction());

        assertEquals(850, report.getNumOfFullTimeWorkers());
        assertEquals(4, report.getNumOfMRIMachines());
        assertEquals(320, report.getNumOfStaffedBeds());
    }

    @Test
    void shouldConvertHospitalReportToDTO() {

        HospitalReport report = new HospitalReport();

        report.setID("hospital-report-123");
        report.setRelatedPropertyID("property-hospital-001");
        report.setGrossFloorArea(250000);
        report.setParkingSize(1200);
        report.setYearOfConstruction(2008);
        report.setNumOfFullTimeWorkers(850);
        report.setNumOfMRIMachines(4);
        report.setNumOfStaffedBeds(320);

        HospitalBuildingUseDTO dto = mapper.toHospitalDTO(report);

        assertEquals("hospital-report-123", dto.id());
        assertEquals("property-hospital-001", dto.propertyId());
        assertEquals(
                BuildingUseType.HOSPITAL,
                dto.buildingUseType()
        );

        assertEquals(250000.0, dto.grossFloorArea());
        assertEquals(1200.0, dto.parkingSize());
        assertEquals(2008, dto.yearOfConstruction());

        assertEquals(850, dto.numOfFullTimeWorkers());
        assertEquals(4, dto.numOfMRIMachines());
        assertEquals(320, dto.numOfStaffedBeds());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectIncorrectHospitalType() {

        HospitalBuildingUseDTO dto = new HospitalBuildingUseDTO(
                null,
                null,
                "property-hospital-001",
                BuildingUseType.OFFICE,
                250000.0,
                1200.0,
                2008,
                850,
                4,
                320
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toHospitalReport(dto)
        );
    }



    @Test
    void shouldConvertMedicalOfficeDTOToReport() {

        MedicalOfficeBuildingUseDTO dto =
                new MedicalOfficeBuildingUseDTO(
                        null,
                        null,
                        "property-medical-001",
                        BuildingUseType.MEDICAL_OFFICE,
                        18000.0,
                        400.0,
                        2012,
                        3,
                        8,
                        35,
                        65.0
                );

        MedicalOfficeReport report =
                mapper.toMedicalOfficeReport(dto);

        assertEquals(
                "property-medical-001",
                report.getRelatedPropertyID()
        );
        assertEquals(18000, report.getGrossFloorArea());
        assertEquals(400, report.getParkingSize());
        assertEquals(2012, report.getYearOfConstruction());

        assertEquals(3, report.getNumOfMRIMachines());
        assertEquals(8, report.getNumOfSurgicalBeds());
        assertEquals(35, report.getNumOfWorkersMainShift());
        assertEquals(65, report.getWeeklyOperatingHours());
    }

    @Test
    void shouldConvertMedicalOfficeReportToDTO() {

        MedicalOfficeReport report = new MedicalOfficeReport();

        report.setID("medical-report-123");
        report.setRelatedPropertyID("property-medical-001");
        report.setGrossFloorArea(18000);
        report.setParkingSize(400);
        report.setYearOfConstruction(2012);
        report.setNumOfMRIMachines(3);
        report.setNumOfSurgicalBeds(8);
        report.setNumOfWorkersMainShift(35);
        report.setWeeklyOperatingHours(65);

        MedicalOfficeBuildingUseDTO dto =
                mapper.toMedicalOfficeDTO(report);

        assertEquals("medical-report-123", dto.id());
        assertEquals("property-medical-001", dto.propertyId());
        assertEquals(
                BuildingUseType.MEDICAL_OFFICE,
                dto.buildingUseType()
        );

        assertEquals(18000.0, dto.grossFloorArea());
        assertEquals(400.0, dto.parkingSize());
        assertEquals(2012, dto.yearOfConstruction());

        assertEquals(3, dto.numOfMRIMachines());
        assertEquals(8, dto.numOfSurgicalBeds());
        assertEquals(35, dto.numOfWorkersMainShift());
        assertEquals(65.0, dto.weeklyOperatingHours());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectIncorrectMedicalOfficeType() {

        MedicalOfficeBuildingUseDTO dto =
                new MedicalOfficeBuildingUseDTO(
                        null,
                        null,
                        "property-medical-001",
                        BuildingUseType.OFFICE,
                        18000.0,
                        400.0,
                        2012,
                        3,
                        8,
                        35,
                        65.0
                );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toMedicalOfficeReport(dto)
        );
    }


    @Test
    void shouldConvertConvenienceStoreDTOToReport() {

        ConvenienceStoreBuildingUseDTO dto =
                new ConvenienceStoreBuildingUseDTO(
                        null,
                        null,
                        "property-convenience-001",
                        BuildingUseType.CONVENIENCE_STORE,
                        8847.0,
                        250.0,
                        2015,
                        120.5,
                        35.25,
                        6,
                        12,
                        3,
                        85.0,
                        90.0
                );

        ConvenienceStoreReport report =
                mapper.toConvenienceStoreReport(dto);

        assertEquals(
                "property-convenience-001",
                report.getRelatedPropertyID()
        );

        assertEquals(8847, report.getGrossFloorArea());
        assertEquals(250, report.getParkingSize());
        assertEquals(2015, report.getYearOfConstruction());

        assertEquals(120.5f, report.getAreaOfWalkInFreezer());
        assertEquals(35.25f, report.getLengthOfFreezerUnit());
        assertEquals(6, report.getNumOfCookingEquipment());
        assertEquals(12, report.getNumOfFullTimeWorkers());
        assertEquals(3, report.getNumOfHeatingUnits());
        assertEquals(85.0f, report.getPercentCooled());
        assertEquals(90.0f, report.getPercentHeated());
    }

    @Test
    void shouldConvertConvenienceStoreReportToDTO() {

        ConvenienceStoreReport report =
                new ConvenienceStoreReport();

        report.setID("convenience-report-123");
        report.setRelatedPropertyID("property-convenience-001");
        report.setGrossFloorArea(8847);
        report.setParkingSize(250);
        report.setYearOfConstruction(2015);

        report.setAreaOfWalkInFreezer(120.5f);
        report.setLengthOfFreezerUnit(35.25f);
        report.setNumOfCookingEquipment(6);
        report.setNumOfFullTimeWorkers(12);
        report.setNumOfHeatingUnits(3);
        report.setPercentCooled(85.0f);
        report.setPercentHeated(90.0f);

        ConvenienceStoreBuildingUseDTO dto =
                mapper.toConvenienceStoreDTO(report);

        assertEquals("convenience-report-123", dto.id());
        assertEquals(
                "property-convenience-001",
                dto.propertyId()
        );
        assertEquals(
                BuildingUseType.CONVENIENCE_STORE,
                dto.buildingUseType()
        );

        assertEquals(8847.0, dto.grossFloorArea());
        assertEquals(250.0, dto.parkingSize());
        assertEquals(2015, dto.yearOfConstruction());

        assertEquals(120.5, dto.areaOfWalkInFreezer());
        assertEquals(35.25, dto.lengthOfFreezerUnit());
        assertEquals(6, dto.numOfCookingEquipment());
        assertEquals(12, dto.numOfFullTimeWorkers());
        assertEquals(3, dto.numOfHeatingUnits());
        assertEquals(85.0, dto.percentCooled());
        assertEquals(90.0, dto.percentHeated());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectIncorrectConvenienceStoreType() {

        ConvenienceStoreBuildingUseDTO dto =
                new ConvenienceStoreBuildingUseDTO(
                        null,
                        null,
                        "property-convenience-001",
                        BuildingUseType.OFFICE,
                        8847.0,
                        250.0,
                        2015,
                        120.5,
                        35.25,
                        6,
                        12,
                        3,
                        85.0,
                        90.0
                );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toConvenienceStoreReport(dto)
        );
    }



    @Test
    void shouldConvertDistributionCenterDTOToReport() {

        DistributionCenterBuildingUseDTO dto =
                new DistributionCenterBuildingUseDTO(
                        null,
                        null,
                        "property-distribution-001",
                        BuildingUseType.DISTRIBUTION_CENTER,
                        50000.0,
                        1500.0,
                        2010,
                        40,
                        15.0,
                        65.0,
                        75.0,
                        60.0
                );

        DistributionCenterReport report =
                mapper.toDistributionCenterReport(dto);

        assertEquals(
                "property-distribution-001",
                report.getRelatedPropertyID()
        );

        assertEquals(50000, report.getGrossFloorArea());
        assertEquals(1500, report.getParkingSize());
        assertEquals(2010, report.getYearOfConstruction());

        assertEquals(40, report.getNumOfWorkersMainShift());
        assertEquals(15.0f, report.getPercentColdStorage());
        assertEquals(65.0f, report.getPercentCooled());
        assertEquals(75.0f, report.getPercentHeated());
        assertEquals(60, report.getWeeklyOperatingHours());
    }

    @Test
    void shouldConvertDistributionCenterReportToDTO() {

        DistributionCenterReport report =
                new DistributionCenterReport();

        report.setID("distribution-report-123");
        report.setRelatedPropertyID("property-distribution-001");
        report.setGrossFloorArea(50000);
        report.setParkingSize(1500);
        report.setYearOfConstruction(2010);

        report.setNumOfWorkersMainShift(40);
        report.setPercentColdStorage(15.0f);
        report.setPercentCooled(65.0f);
        report.setPercentHeated(75.0f);
        report.setWeeklyOperatingHours(60);

        DistributionCenterBuildingUseDTO dto =
                mapper.toDistributionCenterDTO(report);

        assertEquals("distribution-report-123", dto.id());
        assertEquals(
                "property-distribution-001",
                dto.propertyId()
        );
        assertEquals(
                BuildingUseType.DISTRIBUTION_CENTER,
                dto.buildingUseType()
        );

        assertEquals(50000.0, dto.grossFloorArea());
        assertEquals(1500.0, dto.parkingSize());
        assertEquals(2010, dto.yearOfConstruction());

        assertEquals(40, dto.numOfWorkersMainShift());
        assertEquals(15.0, dto.percentColdStorage());
        assertEquals(65.0, dto.percentCooled());
        assertEquals(75.0, dto.percentHeated());
        assertEquals(60.0, dto.weeklyOperatingHours());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectIncorrectDistributionCenterType() {

        DistributionCenterBuildingUseDTO dto =
                new DistributionCenterBuildingUseDTO(
                        null,
                        null,
                        "property-distribution-001",
                        BuildingUseType.OFFICE,
                        50000.0,
                        1500.0,
                        2010,
                        40,
                        15.0,
                        65.0,
                        75.0,
                        60.0
                );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toDistributionCenterReport(dto)
        );
    }



    @Test
    void shouldConvertHotelDTOToReport() {

        HotelBuildingUseDTO dto = new HotelBuildingUseDTO(
                null,
                null,
                "property-hotel-001",
                BuildingUseType.HOTEL,
                45000.0,
                1200.0,
                2014,
                true,
                4,
                150,
                35,
                85.0,
                90.0
        );

        HotelReport report = mapper.toHotelReport(dto);

        assertEquals(
                "property-hotel-001",
                report.getRelatedPropertyID()
        );

        assertEquals(45000, report.getGrossFloorArea());
        assertEquals(1200, report.getParkingSize());
        assertEquals(2014, report.getYearOfConstruction());

        assertEquals(true, report.isHasCookingFacilities());
        assertEquals(4, report.getNumCommercialFreezer());
        assertEquals(150, report.getNumOfRooms());
        assertEquals(35, report.getNumOfWorkersMainShift());
        assertEquals(85.0f, report.getPercentCooled());
        assertEquals(90.0f, report.getPercentHeated());
    }

    @Test
    void shouldConvertHotelReportToDTO() {

        HotelReport report = new HotelReport();

        report.setID("hotel-report-123");
        report.setRelatedPropertyID("property-hotel-001");
        report.setGrossFloorArea(45000);
        report.setParkingSize(1200);
        report.setYearOfConstruction(2014);

        report.setHasCookingFacilities(true);
        report.setNumCommercialFreezer(4);
        report.setNumOfRooms(150);
        report.setNumOfWorkersMainShift(35);
        report.setPercentCooled(85.0f);
        report.setPercentHeated(90.0f);

        HotelBuildingUseDTO dto = mapper.toHotelDTO(report);

        assertEquals("hotel-report-123", dto.id());
        assertEquals("property-hotel-001", dto.propertyId());
        assertEquals(BuildingUseType.HOTEL, dto.buildingUseType());

        assertEquals(45000.0, dto.grossFloorArea());
        assertEquals(1200.0, dto.parkingSize());
        assertEquals(2014, dto.yearOfConstruction());

        assertEquals(true, dto.hasCookingFacilities());
        assertEquals(4, dto.numCommercialFreezer());
        assertEquals(150, dto.numOfRooms());
        assertEquals(35, dto.numOfWorkersMainShift());
        assertEquals(85.0, dto.percentCooled());
        assertEquals(90.0, dto.percentHeated());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectIncorrectHotelType() {

        HotelBuildingUseDTO dto = new HotelBuildingUseDTO(
                null,
                null,
                "property-hotel-001",
                BuildingUseType.OFFICE,
                45000.0,
                1200.0,
                2014,
                true,
                4,
                150,
                35,
                85.0,
                90.0
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toHotelReport(dto)
        );
    }



    @Test
    void shouldConvertMultifamilyHousingDTOToReport() {

        MultifamilyHousingBuildingUseDTO dto =
                new MultifamilyHousingBuildingUseDTO(
                        null,
                        null,
                        "property-multifamily-001",
                        BuildingUseType.MULTIFAMILY_HOUSING,
                        75000.0,
                        2000.0,
                        2010,
                        30.0,
                        null,
                        20.0,
                        120,
                        50
                );

        MultifamilyHousingReport report =
                mapper.toMultifamilyHousingReport(dto);

        assertEquals(
                "property-multifamily-001",
                report.getRelatedPropertyID()
        );

        assertEquals(75000, report.getGrossFloorArea());
        assertEquals(2000, report.getParkingSize());
        assertEquals(2010, report.getYearOfConstruction());

        assertEquals(30, report.getLowRiseUnits());
        assertEquals(0, report.getMidRiseUnits());
        assertEquals(20, report.getHighRiseUnits());
        assertEquals(120, report.getNumOfBedrooms());
        assertEquals(50, report.getNumOfResidentialUnits());
    }

    @Test
    void shouldConvertMultifamilyHousingReportToDTO() {

        MultifamilyHousingReport report =
                new MultifamilyHousingReport();

        report.setID("multifamily-report-123");
        report.setRelatedPropertyID("property-multifamily-001");
        report.setGrossFloorArea(75000);
        report.setParkingSize(2000);
        report.setYearOfConstruction(2010);

        report.setLowRiseUnits(30);
        report.setMidRiseUnits(0);
        report.setHighRiseUnits(20);
        report.setNumOfBedrooms(120);
        report.setNumOfResidentialUnits(50);

        MultifamilyHousingBuildingUseDTO dto =
                mapper.toMultifamilyHousingDTO(report);

        assertEquals("multifamily-report-123", dto.id());
        assertEquals(
                "property-multifamily-001",
                dto.propertyId()
        );
        assertEquals(
                BuildingUseType.MULTIFAMILY_HOUSING,
                dto.buildingUseType()
        );

        assertEquals(75000.0, dto.grossFloorArea());
        assertEquals(2000.0, dto.parkingSize());
        assertEquals(2010, dto.yearOfConstruction());

        assertEquals(30.0, dto.lowRiseUnits());
        assertEquals(0.0, dto.midRiseUnits());
        assertEquals(20.0, dto.highRiseUnits());
        assertEquals(120, dto.numOfBedrooms());
        assertEquals(50, dto.numOfResidentialUnits());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectIncorrectMultifamilyHousingType() {

        MultifamilyHousingBuildingUseDTO dto =
                new MultifamilyHousingBuildingUseDTO(
                        null,
                        null,
                        "property-multifamily-001",
                        BuildingUseType.OFFICE,
                        75000.0,
                        2000.0,
                        2010,
                        30.0,
                        0.0,
                        20.0,
                        120,
                        50
                );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toMultifamilyHousingReport(dto)
        );
    }


    @Test
    void shouldConvertRetailStoreDTOToReport() {

        RetailStoreBuildingUseDTO dto =
                new RetailStoreBuildingUseDTO(
                        null,
                        null,
                        "property-retail-001",
                        BuildingUseType.RETAIL_STORE,
                        45000.0,
                        2500.0,
                        2015,
                        true,
                        false,
                        6,
                        25,
                        80.0,
                        65.0,
                        70
                );

        RetailStoreReport report =
                mapper.toRetailStoreReport(dto);

        assertEquals(
                "property-retail-001",
                report.getRelatedPropertyID()
        );

        assertEquals(45000, report.getGrossFloorArea());
        assertEquals(2500, report.getParkingSize());
        assertEquals(2015, report.getYearOfConstruction());

        assertEquals(true, report.isHasExteriorEntrance());
        assertEquals(false, report.isSingleStore());
        assertEquals(6, report.getNumOfFreezers());
        assertEquals(25, report.getNumOfWorkersMainShift());
        assertEquals(80.0f, report.getPercentCooled());
        assertEquals(65.0f, report.getPercentHeated());
        assertEquals(70, report.getWeeklyOperatingHours());
    }

    @Test
    void shouldConvertRetailStoreReportToDTO() {

        RetailStoreReport report = new RetailStoreReport();

        report.setID("retail-report-123");
        report.setRelatedPropertyID("property-retail-001");
        report.setGrossFloorArea(45000);
        report.setParkingSize(2500);
        report.setYearOfConstruction(2015);

        report.setHasExteriorEntrance(true);
        report.setSingleStore(false);
        report.setNumOfFreezers(6);
        report.setNumOfWorkersMainShift(25);
        report.setPercentCooled(80.0f);
        report.setPercentHeated(65.0f);
        report.setWeeklyOperatingHours(70);

        RetailStoreBuildingUseDTO dto =
                mapper.toRetailStoreDTO(report);

        assertEquals("retail-report-123", dto.id());
        assertEquals(
                "property-retail-001",
                dto.propertyId()
        );
        assertEquals(
                BuildingUseType.RETAIL_STORE,
                dto.buildingUseType()
        );

        assertEquals(45000.0, dto.grossFloorArea());
        assertEquals(2500.0, dto.parkingSize());
        assertEquals(2015, dto.yearOfConstruction());

        assertEquals(true, dto.hasExteriorEntrance());
        assertEquals(false, dto.isSingleStore());
        assertEquals(6, dto.numOfFreezers());
        assertEquals(25, dto.numOfWorkersMainShift());
        assertEquals(80.0, dto.percentCooled());
        assertEquals(65.0, dto.percentHeated());
        assertEquals(70, dto.weeklyOperatingHours());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectIncorrectRetailStoreType() {

        RetailStoreBuildingUseDTO dto =
                new RetailStoreBuildingUseDTO(
                        null,
                        null,
                        "property-retail-001",
                        BuildingUseType.OFFICE,
                        45000.0,
                        2500.0,
                        2015,
                        true,
                        false,
                        6,
                        25,
                        80.0,
                        65.0,
                        70
                );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toRetailStoreReport(dto)
        );
    }


    @Test
    void shouldConvertSchoolDTOToReport() {

        SchoolBuildingUseDTO dto = new SchoolBuildingUseDTO(
                null,
                null,
                "property-school-001",
                BuildingUseType.SCHOOL,
                85000.0,
                5000.0,
                2005,
                true,
                true,
                false,
                75,
                85.0,
                70.0
        );

        SchoolReport report = mapper.toSchoolReport(dto);

        assertEquals(
                "property-school-001",
                report.getRelatedPropertyID()
        );

        assertEquals(85000, report.getGrossFloorArea());
        assertEquals(5000, report.getParkingSize());
        assertEquals(2005, report.getYearOfConstruction());

        assertEquals(true, report.isDoesWorkWeekend());
        assertEquals(true, report.isHasCookingFacilities());
        assertEquals(false, report.isHighSchool());
        assertEquals(75, report.getNumOfWorkersMainShift());
        assertEquals(85.0f, report.getPercentCooled());
        assertEquals(70.0f, report.getPercentHeated());
    }

    @Test
    void shouldConvertSchoolReportToDTO() {

        SchoolReport report = new SchoolReport();

        report.setID("school-report-123");
        report.setRelatedPropertyID("property-school-001");
        report.setGrossFloorArea(85000);
        report.setParkingSize(5000);
        report.setYearOfConstruction(2005);

        report.setDoesWorkWeekend(true);
        report.setHasCookingFacilities(true);
        report.setHighSchool(false);
        report.setNumOfWorkersMainShift(75);
        report.setPercentCooled(85.0f);
        report.setPercentHeated(70.0f);

        SchoolBuildingUseDTO dto = mapper.toSchoolDTO(report);

        assertEquals("school-report-123", dto.id());
        assertEquals(
                "property-school-001",
                dto.propertyId()
        );
        assertEquals(BuildingUseType.SCHOOL, dto.buildingUseType());

        assertEquals(85000.0, dto.grossFloorArea());
        assertEquals(5000.0, dto.parkingSize());
        assertEquals(2005, dto.yearOfConstruction());

        assertEquals(true, dto.doesWorkWeekend());
        assertEquals(true, dto.hasCookingFacilities());
        assertEquals(false, dto.isHighSchool());
        assertEquals(75, dto.numOfWorkersMainShift());
        assertEquals(85.0, dto.percentCooled());
        assertEquals(70.0, dto.percentHeated());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectIncorrectSchoolType() {

        SchoolBuildingUseDTO dto = new SchoolBuildingUseDTO(
                null,
                null,
                "property-school-001",
                BuildingUseType.OFFICE,
                85000.0,
                5000.0,
                2005,
                true,
                true,
                false,
                75,
                85.0,
                70.0
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toSchoolReport(dto)
        );
    }



    @Test
    void shouldConvertSeniorLivingDTOToReport() {

        SeniorLivingBuildingUseDTO dto =
                new SeniorLivingBuildingUseDTO(
                        null,
                        null,
                        "property-senior-001",
                        BuildingUseType.SENIOR_LIVING,
                        120000.0,
                        6000.0,
                        2012,
                        150,
                        200,
                        40,
                        5,
                        8,
                        4,
                        100,
                        25,
                        60,
                        85.0,
                        90.0
                );

        SeniorLivingCommunityReport report =
                mapper.toSeniorLivingReport(dto);

        assertEquals(
                "property-senior-001",
                report.getRelatedPropertyID()
        );

        assertEquals(120000, report.getGrossFloorArea());
        assertEquals(6000, report.getParkingSize());
        assertEquals(2012, report.getYearOfConstruction());

        assertEquals(150, report.getAvgNumResidents());
        assertEquals(200, report.getMaxResidentCapacity());
        assertEquals(40, report.getNumOfComputers());
        assertEquals(5, report.getNumCommercialFreezer());
        assertEquals(8, report.getNumOfCommercialWashingMachines());
        assertEquals(4, report.getNumOfResidentialLifts());
        assertEquals(100, report.getNumOfResidentialUnits());
        assertEquals(25, report.getNumOfResidentialWashingMachines());
        assertEquals(60, report.getNumOfWorkersMainShift());
        assertEquals(85.0f, report.getPercentCooled());
        assertEquals(90.0f, report.getPercentHeated());
    }

    @Test
    void shouldConvertSeniorLivingReportToDTO() {

        SeniorLivingCommunityReport report =
                new SeniorLivingCommunityReport();

        report.setID("senior-report-123");
        report.setRelatedPropertyID("property-senior-001");
        report.setGrossFloorArea(120000);
        report.setParkingSize(6000);
        report.setYearOfConstruction(2012);

        report.setAvgNumResidents(150);
        report.setMaxResidentCapacity(200);
        report.setNumOfComputers(40);
        report.setNumCommercialFreezer(5);
        report.setNumOfCommercialWashingMachines(8);
        report.setNumOfResidentialLifts(4);
        report.setNumOfResidentialUnits(100);
        report.setNumOfResidentialWashingMachines(25);
        report.setNumOfWorkersMainShift(60);
        report.setPercentCooled(85.0f);
        report.setPercentHeated(90.0f);

        SeniorLivingBuildingUseDTO dto =
                mapper.toSeniorLivingDTO(report);

        assertEquals("senior-report-123", dto.id());
        assertEquals(
                "property-senior-001",
                dto.propertyId()
        );
        assertEquals(
                BuildingUseType.SENIOR_LIVING,
                dto.buildingUseType()
        );

        assertEquals(120000.0, dto.grossFloorArea());
        assertEquals(6000.0, dto.parkingSize());
        assertEquals(2012, dto.yearOfConstruction());

        assertEquals(150, dto.avgNumResidents());
        assertEquals(200, dto.maxResidentCapacity());
        assertEquals(40, dto.numOfComputers());
        assertEquals(5, dto.numCommercialFreezer());
        assertEquals(8, dto.numOfCommercialWashingMachines());
        assertEquals(4, dto.numOfResidentialLifts());
        assertEquals(100, dto.numOfResidentialUnits());
        assertEquals(25, dto.numOfResidentialWashingMachines());
        assertEquals(60, dto.numOfWorkersMainShift());
        assertEquals(85.0, dto.percentCooled());
        assertEquals(90.0, dto.percentHeated());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectInvalidSeniorLivingCapacity() {

        SeniorLivingBuildingUseDTO dto =
                new SeniorLivingBuildingUseDTO(
                        null,
                        null,
                        "property-senior-001",
                        BuildingUseType.SENIOR_LIVING,
                        120000.0,
                        6000.0,
                        2012,
                        250,
                        200,
                        40,
                        5,
                        8,
                        4,
                        100,
                        25,
                        60,
                        85.0,
                        90.0
                );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toSeniorLivingReport(dto)
        );
    }


    @Test
    void shouldConvertSupermarketDTOToReport() {

        SupermarketBuildingUseDTO dto =
                new SupermarketBuildingUseDTO(
                        null,
                        null,
                        "property-supermarket-001",
                        BuildingUseType.SUPERMARKET,
                        60000.0,
                        4000.0,
                        2016,
                        12,
                        35,
                        85.0,
                        70.0,
                        80.0
                );

        SupermarketReport report =
                mapper.toSupermarketReport(dto);

        assertEquals(
                "property-supermarket-001",
                report.getRelatedPropertyID()
        );

        assertEquals(60000, report.getGrossFloorArea());
        assertEquals(4000, report.getParkingSize());
        assertEquals(2016, report.getYearOfConstruction());

        assertEquals(12, report.getNumOfFreezers());
        assertEquals(35, report.getNumOfWorkersMainShift());
        assertEquals(85.0f, report.getPercentCooled());
        assertEquals(70.0f, report.getPercentHeated());
        assertEquals(80, report.getWeeklyOperatingHours());
    }

    @Test
    void shouldConvertSupermarketReportToDTO() {

        SupermarketReport report = new SupermarketReport();

        report.setID("supermarket-report-123");
        report.setRelatedPropertyID("property-supermarket-001");
        report.setGrossFloorArea(60000);
        report.setParkingSize(4000);
        report.setYearOfConstruction(2016);

        report.setNumOfFreezers(12);
        report.setNumOfWorkersMainShift(35);
        report.setPercentCooled(85.0f);
        report.setPercentHeated(70.0f);
        report.setWeeklyOperatingHours(80);

        SupermarketBuildingUseDTO dto =
                mapper.toSupermarketDTO(report);

        assertEquals("supermarket-report-123", dto.id());
        assertEquals(
                "property-supermarket-001",
                dto.propertyId()
        );
        assertEquals(
                BuildingUseType.SUPERMARKET,
                dto.buildingUseType()
        );

        assertEquals(60000.0, dto.grossFloorArea());
        assertEquals(4000.0, dto.parkingSize());
        assertEquals(2016, dto.yearOfConstruction());

        assertEquals(12, dto.numOfOpenClosedFreezers());
        assertEquals(35, dto.numOfWorkersMainShift());
        assertEquals(85.0, dto.percentCooled());
        assertEquals(70.0, dto.percentHeated());
        assertEquals(80.0, dto.weeklyOperatingHours());

        assertNull(dto.createdAt());
    }

    @Test
    void shouldRejectFractionalSupermarketOperatingHours() {

        SupermarketBuildingUseDTO dto =
                new SupermarketBuildingUseDTO(
                        null,
                        null,
                        "property-supermarket-001",
                        BuildingUseType.SUPERMARKET,
                        60000.0,
                        4000.0,
                        2016,
                        12,
                        35,
                        85.0,
                        70.0,
                        80.5
                );

        assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toSupermarketReport(dto)
        );
    }



}
