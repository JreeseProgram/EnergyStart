
package com.energystart.prod.service;

import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.repos.EnergyReportRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnergyReportService {

    private final EnergyReportRepo energyReportRepo;

    // Constructor dependency injection
    public EnergyReportService(EnergyReportRepo energyReportRepo) {
        this.energyReportRepo = energyReportRepo;
    }

    // CREATE - Save a new energy report
    public EnergyReport createReport(EnergyReport report) {

        validateReport(report);

        report.setID(null);

        return energyReportRepo.save(report);
    }

    // READ - Retrieve all energy reports
    public List<EnergyReport> getAllReports() {
        return energyReportRepo.findAll();
    }

    // READ - Retrieve an energy report by ID
    public Optional<EnergyReport> getReportById(String id) {
        return energyReportRepo.findById(id);
    }

    // UPDATE - Replace an existing energy report

    public Optional<EnergyReport> updateReport(
            String id, EnergyReport report) {

        Optional<EnergyReport> existingReport =
                energyReportRepo.findById(id);

        if (existingReport.isEmpty()) {
            return Optional.empty();
        }

        // Verify that the report type has not changed
        if (!existingReport.get().getClass().equals(report.getClass())) {
            throw new IllegalArgumentException(
                    "Cannot change the energy report type."
            );
        }

        // Validate the replacement report
        validateReport(report);

        // Preserve the existing MongoDB document ID
        report.setID(id);

        EnergyReport updatedReport = energyReportRepo.save(report);

        return Optional.of(updatedReport);
    }


    // DELETE - Remove an energy report
    public boolean deleteReport(String id) {

        if (!energyReportRepo.existsById(id)) {
            return false;
        }

        energyReportRepo.deleteById(id);
        return true;
    }


    private void validateReport(EnergyReport report) {

        if (report == null) {
            throw new IllegalArgumentException(
                    "Energy report cannot be null."
            );
        }

        if (report.getRelatedPropertyID() == null ||
                report.getRelatedPropertyID().isBlank()) {
            throw new IllegalArgumentException(
                    "A related property ID is required."
            );
        }

        if (report.getGrossFloorArea() <= 0) {
            throw new IllegalArgumentException(
                    "Gross floor area must be greater than zero."
            );
        }

        if (report.getParkingSize() < 0) {
            throw new IllegalArgumentException(
                    "Parking size cannot be negative."
            );
        }

        int currentYear = java.time.Year.now().getValue();

        if (report.getYearOfConstruction() < 1800 ||
                report.getYearOfConstruction() > currentYear) {
            throw new IllegalArgumentException(
                    "Year of construction must be between 1800 and "
                            + currentYear + "."
            );
        }
    }


}
