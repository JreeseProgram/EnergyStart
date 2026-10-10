
package com.energystart.prod.controller;

import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.service.EnergyReportService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.List;

@RestController
@RequestMapping("/api/energy-reports")
public class EnergyReportController {

    private final EnergyReportService energyReportService;

    // Constructor dependency injection
    public EnergyReportController(
            EnergyReportService energyReportService) {
        this.energyReportService = energyReportService;
    }

    // CREATE - Save a new energy report
    @PostMapping
    public ResponseEntity<EnergyReport> createReport(
            @RequestBody EnergyReport report) {

        EnergyReport createdReport =
                energyReportService.createReport(report);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdReport);
    }

    // READ - Retrieve all energy reports
    @GetMapping
    public ResponseEntity<List<EnergyReport>> getAllReports() {

        return ResponseEntity.ok(
                energyReportService.getAllReports()
        );
    }

    // READ - Retrieve an energy report by ID
    @GetMapping("/{id}")
    public ResponseEntity<EnergyReport> getReportById(
            @PathVariable String id) {

        return energyReportService.getReportById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // UPDATE - Replace an existing energy report
    @PutMapping("/{id}")
    public ResponseEntity<EnergyReport> updateReport(
            @PathVariable String id,
            @RequestBody EnergyReport report) {

        return energyReportService.updateReport(id, report)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // DELETE - Remove an energy report
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(
            @PathVariable String id) {

        if (energyReportService.deleteReport(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleInvalidReport(
            IllegalArgumentException ex) {

        return ResponseEntity
                .badRequest()
                .body(ex.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleInvalidJson(
            HttpMessageNotReadableException ex) {

        return ResponseEntity
                .badRequest()
                .body("Invalid JSON or unsupported reportType.");
    }

}
