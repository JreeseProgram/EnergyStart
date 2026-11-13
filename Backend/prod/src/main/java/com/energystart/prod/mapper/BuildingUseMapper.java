
package com.energystart.prod.mapper;

import com.energystart.prod.dto.buildinguse.BuildingUseType;
import com.energystart.prod.dto.buildinguse.types.OfficeBuildingUseDTO;
import com.energystart.prod.energy.report_types.OfficeReport;
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
}
