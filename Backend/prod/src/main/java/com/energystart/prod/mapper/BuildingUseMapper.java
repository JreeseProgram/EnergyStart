
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


import org.springframework.stereotype.Component;

@Component
public class BuildingUseMapper {

    // Convert a frontend-facing Office DTO into an OfficeReport.
    public OfficeReport toOfficeReport(OfficeBuildingUseDTO dto) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Office building use cannot be null."
            );
        }

        if (dto.buildingUseType() != BuildingUseType.OFFICE) {
            throw new IllegalArgumentException(
                    "Building use type must be OFFICE."
            );
        }

        OfficeReport report = new OfficeReport();

        report.setRelatedPropertyID(dto.propertyId());

        report.setGrossFloorArea(
                requireWholeNumber(dto.grossFloorArea(), "grossFloorArea")
        );

        report.setParkingSize(
                requireWholeNumber(dto.parkingSize(), "parkingSize")
        );

        if (dto.yearOfConstruction() == null) {
            throw new IllegalArgumentException(
                    "yearOfConstruction is required."
            );
        }
        report.setYearOfConstruction(dto.yearOfConstruction());

        report.setNumOfComputers(
                requireNonnegativeInteger(dto.numOfComputers(), "numOfComputers")
        );

        report.setNumOfWorkersMainShift(
                requireNonnegativeInteger(
                        dto.numOfWorkersMainShift(),
                        "numOfWorkersMainShift"
                )
        );

        report.setPercentCooled(
                requirePercentage(dto.percentCooled(), "percentCooled")
        );

        int weeklyHours = requireWholeNumber(
                dto.weeklyOperatingHours(),
                "weeklyOperatingHours"
        );

        if (weeklyHours > 168) {
            throw new IllegalArgumentException(
                    "weeklyOperatingHours cannot exceed 168."
            );
        }

        report.setWeeklyOperatingHours(weeklyHours);

        return report;
    }

    // Convert an existing OfficeReport into a frontend-facing DTO.
    public OfficeBuildingUseDTO toOfficeDTO(OfficeReport report) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Office report cannot be null."
            );
        }

        return new OfficeBuildingUseDTO(
                report.getID(),
                null, // EnergyReport does not currently store createdAt.
                report.getRelatedPropertyID(),
                BuildingUseType.OFFICE,

                (double) report.getGrossFloorArea(),
                (double) report.getParkingSize(),
                report.getYearOfConstruction(),

                report.getNumOfComputers(),
                report.getNumOfWorkersMainShift(),
                (double) report.getPercentCooled(),
                (double) report.getWeeklyOperatingHours()
        );
    }

    private int requireWholeNumber(Double value, String fieldName) {

        if (value == null ||
                !Double.isFinite(value) ||
                value < 0 ||
                value > Integer.MAX_VALUE ||
                Math.rint(value) != value) {

            throw new IllegalArgumentException(
                    fieldName + " must be a nonnegative whole number " +
                            "within the Java integer range."
            );
        }

        return value.intValue();
    }

    private int requireNonnegativeInteger(Integer value, String fieldName) {

        if (value == null || value < 0) {
            throw new IllegalArgumentException(
                    fieldName + " must be a nonnegative integer."
            );
        }

        return value;
    }

    private float requirePercentage(Double value, String fieldName) {

        if (value == null ||
                !Double.isFinite(value) ||
                value < 0 ||
                value > 100) {

            throw new IllegalArgumentException(
                    fieldName + " must be between 0 and 100."
            );
        }

        return value.floatValue();
    }

    private float requireNonnegativeFloat(Double value, String fieldName) {

        if (value == null
                || !Double.isFinite(value)
                || value < 0
                || value > Float.MAX_VALUE) {

            throw new IllegalArgumentException(
                    fieldName + " must be a finite, nonnegative number."
            );
        }

        return value.floatValue();
    }


    /**
     * Converts a Bank Branch DTO into the backend BankBranchReport.
     */
    public BankBranchReport toBankBranchReport(
            BankBranchBuildingUseDTO dto) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Bank Branch building use cannot be null."
            );
        }

        if (dto.buildingUseType() != BuildingUseType.BANK_BRANCH) {
            throw new IllegalArgumentException(
                    "Building use type must be BANK_BRANCH."
            );
        }

        BankBranchReport report = new BankBranchReport();

        // Common building-use fields
        report.setRelatedPropertyID(dto.propertyId());

        report.setGrossFloorArea(
                requireWholeNumber(
                        dto.grossFloorArea(),
                        "grossFloorArea"
                )
        );

        report.setParkingSize(
                requireWholeNumber(
                        dto.parkingSize(),
                        "parkingSize"
                )
        );

        if (dto.yearOfConstruction() == null) {
            throw new IllegalArgumentException(
                    "yearOfConstruction is required."
            );
        }

        report.setYearOfConstruction(dto.yearOfConstruction());

        // Bank Branch-specific fields
        report.setNumOfWorkersMainShift(
                requireNonnegativeInteger(
                        dto.numOfWorkersMainShift(),
                        "numOfWorkersMainShift"
                )
        );

        report.setNumOfComputers(
                requireNonnegativeInteger(
                        dto.numOfComputers(),
                        "numOfComputers"
                )
        );

        report.setPercentCooled(
                requirePercentage(
                        dto.percentCooled(),
                        "percentCooled"
                )
        );

        int weeklyHours = requireWholeNumber(
                dto.weeklyOperatingHours(),
                "weeklyOperatingHours"
        );

        if (weeklyHours > 168) {
            throw new IllegalArgumentException(
                    "weeklyOperatingHours cannot exceed 168."
            );
        }

        report.setWeeklyOperatingHours(weeklyHours);

        return report;
    }

    /**
     * Converts a backend BankBranchReport into a frontend DTO.
     */
    public BankBranchBuildingUseDTO toBankBranchDTO(
            BankBranchReport report) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Bank Branch report cannot be null."
            );
        }

        return new BankBranchBuildingUseDTO(
                report.getID(),
                null, // createdAt is not persisted yet.
                report.getRelatedPropertyID(),
                BuildingUseType.BANK_BRANCH,

                (double) report.getGrossFloorArea(),
                (double) report.getParkingSize(),
                report.getYearOfConstruction(),

                report.getNumOfWorkersMainShift(),
                report.getNumOfComputers(),
                (double) report.getPercentCooled(),
                (double) report.getWeeklyOperatingHours()
        );
    }



    /**
     * Converts a Court House DTO received from the frontend
     * into the backend CourtHouseReport entity.
     */
    public CourtHouseReport toCourtHouseReport(CourtHouseBuildingUseDTO dto) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Court House building use cannot be null."
            );
        }

        if (dto.buildingUseType() != BuildingUseType.COURT_HOUSE) {
            throw new IllegalArgumentException(
                    "Building use type must be COURT_HOUSE."
            );
        }

        CourtHouseReport report = new CourtHouseReport();

        // Common fields inherited from EnergyReport
        report.setRelatedPropertyID(dto.propertyId());
        report.setGrossFloorArea(
                requireWholeNumber(dto.grossFloorArea(), "grossFloorArea")
        );
        report.setParkingSize(
                requireWholeNumber(dto.parkingSize(), "parkingSize")
        );

        if (dto.yearOfConstruction() == null) {
            throw new IllegalArgumentException(
                    "yearOfConstruction is required."
            );
        }

        report.setYearOfConstruction(dto.yearOfConstruction());

        // Court House-specific fields
        report.setNumOfComputers(
                requireNonnegativeInteger(
                        dto.numOfComputers(),
                        "numOfComputers"
                )
        );

        report.setNumOfWorkersMainShift(
                requireNonnegativeInteger(
                        dto.numOfWorkersMainShift(),
                        "numOfWorkersMainShift"
                )
        );

        report.setPercentCooled(
                requirePercentage(
                        dto.percentCooled(),
                        "percentCooled"
                )
        );

        int weeklyHours = requireWholeNumber(
                dto.weeklyOperatingHours(),
                "weeklyOperatingHours"
        );

        if (weeklyHours > 168) {
            throw new IllegalArgumentException(
                    "weeklyOperatingHours cannot exceed 168."
            );
        }

        report.setWeeklyOperatingHours(weeklyHours);

        return report;
    }

    /**
     * Converts a backend CourtHouseReport entity
     * into the DTO expected by the frontend.
     */
    public CourtHouseBuildingUseDTO toCourtHouseDTO(CourtHouseReport report) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Court House report cannot be null."
            );
        }

        return new CourtHouseBuildingUseDTO(
                report.getID(),
                null,
                report.getRelatedPropertyID(),
                BuildingUseType.COURT_HOUSE,

                (double) report.getGrossFloorArea(),
                (double) report.getParkingSize(),
                report.getYearOfConstruction(),

                report.getNumOfComputers(),
                report.getNumOfWorkersMainShift(),
                (double) report.getPercentCooled(),
                (double) report.getWeeklyOperatingHours()
        );
    }



    /**
     * Converts a Financial Office DTO into a backend report.
     */
    public FinancialOfficeReport toFinancialOfficeReport(
            FinancialOfficeBuildingUseDTO dto
    ) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Financial Office building use cannot be null."
            );
        }

        if (dto.buildingUseType() != BuildingUseType.FINANCIAL_OFFICE) {
            throw new IllegalArgumentException(
                    "Building use type must be FINANCIAL_OFFICE."
            );
        }

        FinancialOfficeReport report = new FinancialOfficeReport();

        // Common EnergyReport fields
        report.setRelatedPropertyID(dto.propertyId());

        report.setGrossFloorArea(
                requireWholeNumber(dto.grossFloorArea(), "grossFloorArea")
        );

        report.setParkingSize(
                requireWholeNumber(dto.parkingSize(), "parkingSize")
        );

        if (dto.yearOfConstruction() == null) {
            throw new IllegalArgumentException(
                    "yearOfConstruction is required."
            );
        }

        report.setYearOfConstruction(dto.yearOfConstruction());

        // Financial Office-specific fields
        report.setNumOfComputers(
                requireNonnegativeInteger(
                        dto.numOfComputers(),
                        "numOfComputers"
                )
        );

        report.setNumOfWorkersMainShift(
                requireNonnegativeInteger(
                        dto.numOfWorkersMainShift(),
                        "numOfWorkersMainShift"
                )
        );

        report.setPercentCooled(
                requirePercentage(
                        dto.percentCooled(),
                        "percentCooled"
                )
        );

        int weeklyHours = requireWholeNumber(
                dto.weeklyOperatingHours(),
                "weeklyOperatingHours"
        );

        if (weeklyHours > 168) {
            throw new IllegalArgumentException(
                    "weeklyOperatingHours cannot exceed 168."
            );
        }

        report.setWeeklyOperatingHours(weeklyHours);

        return report;
    }

    /**
     * Converts a backend FinancialOfficeReport
     * into the frontend-facing DTO.
     */
    public FinancialOfficeBuildingUseDTO toFinancialOfficeDTO(
            FinancialOfficeReport report
    ) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Financial Office report cannot be null."
            );
        }

        return new FinancialOfficeBuildingUseDTO(
                report.getID(),
                null,
                report.getRelatedPropertyID(),
                BuildingUseType.FINANCIAL_OFFICE,

                (double) report.getGrossFloorArea(),
                (double) report.getParkingSize(),
                report.getYearOfConstruction(),

                report.getNumOfComputers(),
                report.getNumOfWorkersMainShift(),
                (double) report.getPercentCooled(),
                (double) report.getWeeklyOperatingHours()
        );
    }



    /**
     * Converts a Hospital DTO into the backend HospitalReport.
     */
    public HospitalReport toHospitalReport(HospitalBuildingUseDTO dto) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Hospital building use cannot be null."
            );
        }

        if (dto.buildingUseType() != BuildingUseType.HOSPITAL) {
            throw new IllegalArgumentException(
                    "Building use type must be HOSPITAL."
            );
        }

        HospitalReport report = new HospitalReport();

        // Common EnergyReport fields
        report.setRelatedPropertyID(dto.propertyId());

        report.setGrossFloorArea(
                requireWholeNumber(dto.grossFloorArea(), "grossFloorArea")
        );

        report.setParkingSize(
                requireWholeNumber(dto.parkingSize(), "parkingSize")
        );

        if (dto.yearOfConstruction() == null) {
            throw new IllegalArgumentException(
                    "yearOfConstruction is required."
            );
        }

        report.setYearOfConstruction(dto.yearOfConstruction());

        // Hospital-specific fields
        report.setNumOfFullTimeWorkers(
                requireNonnegativeInteger(
                        dto.numOfFullTimeWorkers(),
                        "numOfFullTimeWorkers"
                )
        );

        report.setNumOfMRIMachines(
                requireNonnegativeInteger(
                        dto.numOfMRIMachines(),
                        "numOfMRIMachines"
                )
        );

        report.setNumOfStaffedBeds(
                requireNonnegativeInteger(
                        dto.numOfStaffedBeds(),
                        "numOfStaffedBeds"
                )
        );

        return report;
    }

    /**
     * Converts a backend HospitalReport into a frontend DTO.
     */
    public HospitalBuildingUseDTO toHospitalDTO(HospitalReport report) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Hospital report cannot be null."
            );
        }

        return new HospitalBuildingUseDTO(
                report.getID(),
                null,
                report.getRelatedPropertyID(),
                BuildingUseType.HOSPITAL,

                (double) report.getGrossFloorArea(),
                (double) report.getParkingSize(),
                report.getYearOfConstruction(),

                report.getNumOfFullTimeWorkers(),
                report.getNumOfMRIMachines(),
                report.getNumOfStaffedBeds()
        );
    }



    /**
     * Converts a Medical Office DTO into a backend MedicalOfficeReport.
     */
    public MedicalOfficeReport toMedicalOfficeReport(
            MedicalOfficeBuildingUseDTO dto
    ) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Medical Office building use cannot be null."
            );
        }

        if (dto.buildingUseType() != BuildingUseType.MEDICAL_OFFICE) {
            throw new IllegalArgumentException(
                    "Building use type must be MEDICAL_OFFICE."
            );
        }

        MedicalOfficeReport report = new MedicalOfficeReport();

        // Common EnergyReport fields
        report.setRelatedPropertyID(dto.propertyId());

        report.setGrossFloorArea(
                requireWholeNumber(dto.grossFloorArea(), "grossFloorArea")
        );

        report.setParkingSize(
                requireWholeNumber(dto.parkingSize(), "parkingSize")
        );

        if (dto.yearOfConstruction() == null) {
            throw new IllegalArgumentException(
                    "yearOfConstruction is required."
            );
        }

        report.setYearOfConstruction(dto.yearOfConstruction());

        // Medical Office-specific fields
        report.setNumOfMRIMachines(
                requireNonnegativeInteger(
                        dto.numOfMRIMachines(),
                        "numOfMRIMachines"
                )
        );

        report.setNumOfSurgicalBeds(
                requireNonnegativeInteger(
                        dto.numOfSurgicalBeds(),
                        "numOfSurgicalBeds"
                )
        );

        report.setNumOfWorkersMainShift(
                requireNonnegativeInteger(
                        dto.numOfWorkersMainShift(),
                        "numOfWorkersMainShift"
                )
        );

        int weeklyHours = requireWholeNumber(
                dto.weeklyOperatingHours(),
                "weeklyOperatingHours"
        );

        if (weeklyHours > 168) {
            throw new IllegalArgumentException(
                    "weeklyOperatingHours cannot exceed 168."
            );
        }

        report.setWeeklyOperatingHours(weeklyHours);

        return report;
    }

    /**
     * Converts a backend MedicalOfficeReport
     * into the frontend-facing DTO.
     */
    public MedicalOfficeBuildingUseDTO toMedicalOfficeDTO(
            MedicalOfficeReport report
    ) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Medical Office report cannot be null."
            );
        }

        return new MedicalOfficeBuildingUseDTO(
                report.getID(),
                null,
                report.getRelatedPropertyID(),
                BuildingUseType.MEDICAL_OFFICE,

                (double) report.getGrossFloorArea(),
                (double) report.getParkingSize(),
                report.getYearOfConstruction(),

                report.getNumOfMRIMachines(),
                report.getNumOfSurgicalBeds(),
                report.getNumOfWorkersMainShift(),
                (double) report.getWeeklyOperatingHours()
        );
    }



    /**
     * Converts a Convenience Store DTO into a backend report.
     */
    public ConvenienceStoreReport toConvenienceStoreReport(
            ConvenienceStoreBuildingUseDTO dto
    ) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Convenience Store building use cannot be null."
            );
        }

        if (dto.buildingUseType() != BuildingUseType.CONVENIENCE_STORE) {
            throw new IllegalArgumentException(
                    "Building use type must be CONVENIENCE_STORE."
            );
        }

        ConvenienceStoreReport report = new ConvenienceStoreReport();

        // Common EnergyReport fields
        report.setRelatedPropertyID(dto.propertyId());

        report.setGrossFloorArea(
                requireWholeNumber(dto.grossFloorArea(), "grossFloorArea")
        );

        report.setParkingSize(
                requireWholeNumber(dto.parkingSize(), "parkingSize")
        );

        if (dto.yearOfConstruction() == null) {
            throw new IllegalArgumentException(
                    "yearOfConstruction is required."
            );
        }

        report.setYearOfConstruction(dto.yearOfConstruction());

        // Convenience Store-specific fields
        report.setAreaOfWalkInFreezer(
                requireNonnegativeFloat(
                        dto.areaOfWalkInFreezer(),
                        "areaOfWalkInFreezer"
                )
        );

        report.setLengthOfFreezerUnit(
                requireNonnegativeFloat(
                        dto.lengthOfFreezerUnit(),
                        "lengthOfFreezerUnit"
                )
        );

        report.setNumOfCookingEquipment(
                requireNonnegativeInteger(
                        dto.numOfCookingEquipment(),
                        "numOfCookingEquipment"
                )
        );

        report.setNumOfFullTimeWorkers(
                requireNonnegativeInteger(
                        dto.numOfFullTimeWorkers(),
                        "numOfFullTimeWorkers"
                )
        );

        report.setNumOfHeatingUnits(
                requireNonnegativeInteger(
                        dto.numOfHeatingUnits(),
                        "numOfHeatingUnits"
                )
        );

        report.setPercentCooled(
                requirePercentage(dto.percentCooled(), "percentCooled")
        );

        report.setPercentHeated(
                requirePercentage(dto.percentHeated(), "percentHeated")
        );

        return report;
    }

    /**
     * Converts a backend Convenience Store report into a DTO.
     */
    public ConvenienceStoreBuildingUseDTO toConvenienceStoreDTO(
            ConvenienceStoreReport report
    ) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Convenience Store report cannot be null."
            );
        }

        return new ConvenienceStoreBuildingUseDTO(
                report.getID(),
                null,
                report.getRelatedPropertyID(),
                BuildingUseType.CONVENIENCE_STORE,

                (double) report.getGrossFloorArea(),
                (double) report.getParkingSize(),
                report.getYearOfConstruction(),

                (double) report.getAreaOfWalkInFreezer(),
                (double) report.getLengthOfFreezerUnit(),
                report.getNumOfCookingEquipment(),
                report.getNumOfFullTimeWorkers(),
                report.getNumOfHeatingUnits(),
                (double) report.getPercentCooled(),
                (double) report.getPercentHeated()
        );
    }



    /**
     * Converts a Distribution Center DTO into a backend report.
     */
    public DistributionCenterReport toDistributionCenterReport(
            DistributionCenterBuildingUseDTO dto
    ) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Distribution Center building use cannot be null."
            );
        }

        if (dto.buildingUseType() != BuildingUseType.DISTRIBUTION_CENTER) {
            throw new IllegalArgumentException(
                    "Building use type must be DISTRIBUTION_CENTER."
            );
        }

        DistributionCenterReport report = new DistributionCenterReport();

        // Common EnergyReport fields
        report.setRelatedPropertyID(dto.propertyId());

        report.setGrossFloorArea(
                requireWholeNumber(dto.grossFloorArea(), "grossFloorArea")
        );

        report.setParkingSize(
                requireWholeNumber(dto.parkingSize(), "parkingSize")
        );

        if (dto.yearOfConstruction() == null) {
            throw new IllegalArgumentException(
                    "yearOfConstruction is required."
            );
        }

        report.setYearOfConstruction(dto.yearOfConstruction());

        // Distribution Center-specific fields
        report.setNumOfWorkersMainShift(
                requireNonnegativeInteger(
                        dto.numOfWorkersMainShift(),
                        "numOfWorkersMainShift"
                )
        );

        report.setPercentColdStorage(
                requirePercentage(
                        dto.percentColdStorage(),
                        "percentColdStorage"
                )
        );

        report.setPercentCooled(
                requirePercentage(
                        dto.percentCooled(),
                        "percentCooled"
                )
        );

        report.setPercentHeated(
                requirePercentage(
                        dto.percentHeated(),
                        "percentHeated"
                )
        );

        int weeklyHours = requireWholeNumber(
                dto.weeklyOperatingHours(),
                "weeklyOperatingHours"
        );

        if (weeklyHours > 168) {
            throw new IllegalArgumentException(
                    "weeklyOperatingHours cannot exceed 168."
            );
        }

        report.setWeeklyOperatingHours(weeklyHours);

        return report;
    }

    /**
     * Converts a backend Distribution Center report into a DTO.
     */
    public DistributionCenterBuildingUseDTO toDistributionCenterDTO(
            DistributionCenterReport report
    ) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Distribution Center report cannot be null."
            );
        }

        return new DistributionCenterBuildingUseDTO(
                report.getID(),
                null,
                report.getRelatedPropertyID(),
                BuildingUseType.DISTRIBUTION_CENTER,

                (double) report.getGrossFloorArea(),
                (double) report.getParkingSize(),
                report.getYearOfConstruction(),

                report.getNumOfWorkersMainShift(),
                (double) report.getPercentColdStorage(),
                (double) report.getPercentCooled(),
                (double) report.getPercentHeated(),
                (double) report.getWeeklyOperatingHours()
        );
    }



    /**
     * Converts a Hotel DTO into a backend HotelReport.
     */
    public HotelReport toHotelReport(HotelBuildingUseDTO dto) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Hotel building use cannot be null."
            );
        }

        if (dto.buildingUseType() != BuildingUseType.HOTEL) {
            throw new IllegalArgumentException(
                    "Building use type must be HOTEL."
            );
        }

        HotelReport report = new HotelReport();

        // Common EnergyReport fields
        report.setRelatedPropertyID(dto.propertyId());

        report.setGrossFloorArea(
                requireWholeNumber(dto.grossFloorArea(), "grossFloorArea")
        );

        report.setParkingSize(
                requireWholeNumber(dto.parkingSize(), "parkingSize")
        );

        if (dto.yearOfConstruction() == null) {
            throw new IllegalArgumentException(
                    "yearOfConstruction is required."
            );
        }

        report.setYearOfConstruction(dto.yearOfConstruction());

        // Hotel-specific fields
        if (dto.hasCookingFacilities() == null) {
            throw new IllegalArgumentException(
                    "hasCookingFacilities is required."
            );
        }

        report.setHasCookingFacilities(dto.hasCookingFacilities());

        report.setNumCommercialFreezer(
                requireNonnegativeInteger(
                        dto.numCommercialFreezer(),
                        "numCommercialFreezer"
                )
        );

        report.setNumOfRooms(
                requireNonnegativeInteger(
                        dto.numOfRooms(),
                        "numOfRooms"
                )
        );

        report.setNumOfWorkersMainShift(
                requireNonnegativeInteger(
                        dto.numOfWorkersMainShift(),
                        "numOfWorkersMainShift"
                )
        );

        report.setPercentCooled(
                requirePercentage(
                        dto.percentCooled(),
                        "percentCooled"
                )
        );

        report.setPercentHeated(
                requirePercentage(
                        dto.percentHeated(),
                        "percentHeated"
                )
        );

        return report;
    }

    /**
     * Converts a backend HotelReport into a frontend-facing DTO.
     */
    public HotelBuildingUseDTO toHotelDTO(HotelReport report) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Hotel report cannot be null."
            );
        }

        return new HotelBuildingUseDTO(
                report.getID(),
                null,
                report.getRelatedPropertyID(),
                BuildingUseType.HOTEL,

                (double) report.getGrossFloorArea(),
                (double) report.getParkingSize(),
                report.getYearOfConstruction(),

                report.isHasCookingFacilities(),
                report.getNumCommercialFreezer(),
                report.getNumOfRooms(),
                report.getNumOfWorkersMainShift(),
                (double) report.getPercentCooled(),
                (double) report.getPercentHeated()
        );
    }



    /**
     * Converts a Multifamily Housing DTO into a backend report.
     */
    public MultifamilyHousingReport toMultifamilyHousingReport(
            MultifamilyHousingBuildingUseDTO dto
    ) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Multifamily Housing building use cannot be null."
            );
        }

        if (dto.buildingUseType() != BuildingUseType.MULTIFAMILY_HOUSING) {
            throw new IllegalArgumentException(
                    "Building use type must be MULTIFAMILY_HOUSING."
            );
        }

        MultifamilyHousingReport report =
                new MultifamilyHousingReport();

        // Common EnergyReport fields
        report.setRelatedPropertyID(dto.propertyId());

        report.setGrossFloorArea(
                requireWholeNumber(dto.grossFloorArea(), "grossFloorArea")
        );

        report.setParkingSize(
                requireWholeNumber(dto.parkingSize(), "parkingSize")
        );

        if (dto.yearOfConstruction() == null) {
            throw new IllegalArgumentException(
                    "yearOfConstruction is required."
            );
        }

        report.setYearOfConstruction(dto.yearOfConstruction());

        // Optional rise-unit counts
        int lowRise = dto.lowRiseUnits() == null
                ? 0
                : requireWholeNumber(dto.lowRiseUnits(), "lowRiseUnits");

        int midRise = dto.midRiseUnits() == null
                ? 0
                : requireWholeNumber(dto.midRiseUnits(), "midRiseUnits");

        int highRise = dto.highRiseUnits() == null
                ? 0
                : requireWholeNumber(dto.highRiseUnits(), "highRiseUnits");

        // Prevent division by zero in the regression calculation.
        if ((long) lowRise + midRise + highRise == 0) {
            throw new IllegalArgumentException(
                    "At least one rise-unit count must be greater than zero."
            );
        }

        report.setLowRiseUnits(lowRise);
        report.setMidRiseUnits(midRise);
        report.setHighRiseUnits(highRise);

        report.setNumOfBedrooms(
                requireNonnegativeInteger(
                        dto.numOfBedrooms(),
                        "numOfBedrooms"
                )
        );

        report.setNumOfResidentialUnits(
                requireNonnegativeInteger(
                        dto.numOfResidentialUnits(),
                        "numOfResidentialUnits"
                )
        );

        return report;
    }

    /**
     * Converts a backend Multifamily Housing report into a DTO.
     */
    public MultifamilyHousingBuildingUseDTO toMultifamilyHousingDTO(
            MultifamilyHousingReport report
    ) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Multifamily Housing report cannot be null."
            );
        }

        return new MultifamilyHousingBuildingUseDTO(
                report.getID(),
                null,
                report.getRelatedPropertyID(),
                BuildingUseType.MULTIFAMILY_HOUSING,

                (double) report.getGrossFloorArea(),
                (double) report.getParkingSize(),
                report.getYearOfConstruction(),

                (double) report.getLowRiseUnits(),
                (double) report.getMidRiseUnits(),
                (double) report.getHighRiseUnits(),
                report.getNumOfBedrooms(),
                report.getNumOfResidentialUnits()
        );
    }


    /**
     * Converts a Retail Store DTO into a backend RetailStoreReport.
     */
    public RetailStoreReport toRetailStoreReport(
            RetailStoreBuildingUseDTO dto
    ) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Retail Store building use cannot be null."
            );
        }

        if (dto.buildingUseType() != BuildingUseType.RETAIL_STORE) {
            throw new IllegalArgumentException(
                    "Building use type must be RETAIL_STORE."
            );
        }

        RetailStoreReport report = new RetailStoreReport();

        // Common EnergyReport fields
        report.setRelatedPropertyID(dto.propertyId());

        report.setGrossFloorArea(
                requireWholeNumber(dto.grossFloorArea(), "grossFloorArea")
        );

        report.setParkingSize(
                requireWholeNumber(dto.parkingSize(), "parkingSize")
        );

        if (dto.yearOfConstruction() == null) {
            throw new IllegalArgumentException(
                    "yearOfConstruction is required."
            );
        }

        report.setYearOfConstruction(dto.yearOfConstruction());

        // Retail Store-specific fields
        if (dto.hasExteriorEntrance() == null) {
            throw new IllegalArgumentException(
                    "hasExteriorEntrance is required."
            );
        }

        report.setHasExteriorEntrance(dto.hasExteriorEntrance());

        if (dto.isSingleStore() == null) {
            throw new IllegalArgumentException(
                    "isSingleStore is required."
            );
        }

        report.setSingleStore(dto.isSingleStore());

        report.setNumOfFreezers(
                requireNonnegativeInteger(
                        dto.numOfFreezers(),
                        "numOfFreezers"
                )
        );

        report.setNumOfWorkersMainShift(
                requireNonnegativeInteger(
                        dto.numOfWorkersMainShift(),
                        "numOfWorkersMainShift"
                )
        );

        report.setPercentCooled(
                requirePercentage(
                        dto.percentCooled(),
                        "percentCooled"
                )
        );

        report.setPercentHeated(
                requirePercentage(
                        dto.percentHeated(),
                        "percentHeated"
                )
        );

        int weeklyHours = requireNonnegativeInteger(
                dto.weeklyOperatingHours(),
                "weeklyOperatingHours"
        );

        if (weeklyHours > 168) {
            throw new IllegalArgumentException(
                    "weeklyOperatingHours cannot exceed 168."
            );
        }

        report.setWeeklyOperatingHours(weeklyHours);

        return report;
    }

    /**
     * Converts a backend RetailStoreReport into a Retail Store DTO.
     */
    public RetailStoreBuildingUseDTO toRetailStoreDTO(
            RetailStoreReport report
    ) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Retail Store report cannot be null."
            );
        }

        return new RetailStoreBuildingUseDTO(
                report.getID(),
                null,
                report.getRelatedPropertyID(),
                BuildingUseType.RETAIL_STORE,

                (double) report.getGrossFloorArea(),
                (double) report.getParkingSize(),
                report.getYearOfConstruction(),

                report.isHasExteriorEntrance(),
                report.isSingleStore(),
                report.getNumOfFreezers(),
                report.getNumOfWorkersMainShift(),
                (double) report.getPercentCooled(),
                (double) report.getPercentHeated(),
                report.getWeeklyOperatingHours()
        );
    }


}
