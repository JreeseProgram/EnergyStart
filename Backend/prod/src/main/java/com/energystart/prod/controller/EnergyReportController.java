
package com.energystart.prod.controller;

import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.service.EnergyReportService;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.mapper.BuildingUseMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.List;

@RestController
@RequestMapping("/api/energy-reports")
public class EnergyReportController {

    private final EnergyReportService energyReportService;
    private final BuildingUseMapper buildingUseMapper;

    // Constructor dependency injection
    public EnergyReportController(
            EnergyReportService energyReportService,
            BuildingUseMapper buildingUseMapper) {

        this.energyReportService = energyReportService;
        this.buildingUseMapper = buildingUseMapper;
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


    // CREATE - Save a new energy report using a frontend BuildingUse DTO
    @PostMapping("/building-uses")
    public ResponseEntity<EnergyReport> createBuildingUse(
            @RequestBody BuildingUseDTO dto) {

        // Convert the frontend DTO into the correct EnergyReport subclass
        EnergyReport report = buildingUseMapper.toEnergyReport(dto);

        // Reuse the existing service to validate and save the report
        EnergyReport createdReport =
                energyReportService.createReport(report);

        // Return HTTP 201 Created with the saved report
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdReport);
    }


    // UPDATE - Update an existing energy report using a BuildingUse DTO
    @PutMapping("/building-uses/{id}")
    public ResponseEntity<BuildingUseDTO> updateBuildingUse(
            @PathVariable String id,
            @RequestBody BuildingUseDTO dto) {

        // Convert the frontend DTO into the correct EnergyReport subclass
        EnergyReport report = buildingUseMapper.toEnergyReport(dto);

        // Reuse the existing service to validate and update the report
        return energyReportService.updateReport(id, report)
                .map(buildingUseMapper::toBuildingUseDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }



    // READ - Retrieve all energy reports as frontend BuildingUse DTOs
    @GetMapping("/building-uses")
    public ResponseEntity<List<BuildingUseDTO>> getAllBuildingUses() {

        List<BuildingUseDTO> buildingUses =
                energyReportService.getAllReports()
                        .stream()
                        .map(buildingUseMapper::toBuildingUseDTO)
                        .toList();

        return ResponseEntity.ok(buildingUses);
    }


    // READ - Retrieve one energy report as a frontend BuildingUse DTO
    @GetMapping("/building-uses/{id}")
    public ResponseEntity<BuildingUseDTO> getBuildingUseById(
            @PathVariable String id) {

        return energyReportService.getReportById(id)
                .map(buildingUseMapper::toBuildingUseDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
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


    // DELETE - Delete an existing BuildingUse report
    @DeleteMapping("/building-uses/{id}")
    public ResponseEntity<Void> deleteBuildingUse(
            @PathVariable String id) {

        boolean deleted = energyReportService.deleteReport(id);

        if (deleted) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }


}
