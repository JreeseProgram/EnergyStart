
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


}
