
package com.energystart.prod.controller;

import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.service.EnergyReportService;
import com.energystart.prod.service.PropertyService;
import com.energystart.prod.model.Property;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.server.ResponseStatusException;

import com.energystart.prod.dto.buildinguse.BuildingUseDTO;
import com.energystart.prod.mapper.BuildingUseMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/energy-reports")
public class EnergyReportController {

    private final EnergyReportService energyReportService;
    private final PropertyService propertyService;

    // Constructor dependency injection
    public EnergyReportController(
            EnergyReportService energyReportService, PropertyService propertyService) {
        this.energyReportService = energyReportService;
        this.propertyService = propertyService;
    }

    // CREATE - Save a new energy report
    @PostMapping
    public ResponseEntity<EnergyReport> createReport(
            @RequestBody EnergyReport report,
            @AuthenticationPrincipal Jwt jwt) {

        requirePropertyAccess(report, requireUserId(jwt));

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
    public ResponseEntity<List<EnergyReport>> getAllReports(
            @AuthenticationPrincipal Jwt jwt) {
        Set<String> propertyIds = propertyService.getAllProperties(requireUserId(jwt))
                .stream()
                .map(Property::getId)
                .collect(Collectors.toSet());

        return ResponseEntity.ok(energyReportService.getAllReports().stream()
                .filter(report -> propertyIds.contains(report.getRelatedPropertyID()))
                .toList());
    }

    // READ - Retrieve an energy report by ID
    @GetMapping("/{id}")
    public ResponseEntity<EnergyReport> getReportById(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {

        String userId = requireUserId(jwt);
        return energyReportService.getReportById(id)
                .map(report -> {
                    requirePropertyAccess(report, userId);
                    return report;
                })
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }



    // UPDATE - Replace an existing energy report
    @PutMapping("/{id}")
    public ResponseEntity<EnergyReport> updateReport(
            @PathVariable String id,
            @RequestBody EnergyReport report,
            @AuthenticationPrincipal Jwt jwt) {

        requireReportAccess(id, requireUserId(jwt));
        requirePropertyAccess(report, jwt.getSubject());
        return energyReportService.updateReport(id, report)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    // DELETE - Remove an energy report
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {

        requireReportAccess(id, requireUserId(jwt));
        if (energyReportService.deleteReport(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    private void requireReportAccess(String id, String userId) {
        EnergyReport report = energyReportService.getReportById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Energy report not found."));
        requirePropertyAccess(report, userId);
    }

    private void requirePropertyAccess(EnergyReport report, String userId) {
        if (report.getRelatedPropertyID() == null || report.getRelatedPropertyID().isBlank()) {
            throw new IllegalArgumentException("A related property ID is required.");
        }
        propertyService.getPropertyById(report.getRelatedPropertyID(), userId);
    }

    private String requireUserId(Jwt jwt) {
        if (jwt == null || jwt.getSubject() == null || jwt.getSubject().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Authentication is required.");
        }
        return jwt.getSubject();
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
