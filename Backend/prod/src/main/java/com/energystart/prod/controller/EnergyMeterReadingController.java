
package com.energystart.prod.controller;

import com.energystart.prod.dto.EnergyMeterReadingFieldsDTO;
import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyMeterReading;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.service.EnergyMeterReadingService;
import com.energystart.prod.service.PropertyService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/energy-meter-readings")
public class EnergyMeterReadingController {

    private final EnergyMeterReadingService readingService;
    private final EnergyMeterRepo meterRepo;
    private final PropertyService propertyService;

    public EnergyMeterReadingController(
            EnergyMeterReadingService readingService,
            EnergyMeterRepo meterRepo,
            PropertyService propertyService) {

        this.readingService = readingService;
        this.meterRepo = meterRepo;
        this.propertyService = propertyService;
    }

    // CREATE - Add a reading to a meter
    @PostMapping("/meter/{meterId}")
    public ResponseEntity<EnergyMeterReadingFieldsDTO> createReading(
            @PathVariable String meterId,
            @RequestBody EnergyMeterReadingFieldsDTO dto,
            @AuthenticationPrincipal Jwt jwt) {

        requireMeterAccess(meterId, jwt);
        validateReading(dto);

        EnergyMeterReading reading = new EnergyMeterReading();
        reading.setAssociatedMeterID(meterId);
        applyFields(reading, dto);

        EnergyMeterReading saved = readingService.createReading(reading);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toDTO(saved));
    }

    // READ - All readings belonging to a meter
    @GetMapping("/meter/{meterId}")
    public List<EnergyMeterReadingFieldsDTO> getReadingsByMeter(
            @PathVariable String meterId,
            @AuthenticationPrincipal Jwt jwt) {

        requireMeterAccess(meterId, jwt);

        return readingService.getReadingsByMeterId(meterId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // READ - One reading by ID
    @GetMapping("/{id}")
    public EnergyMeterReadingFieldsDTO getReadingById(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {

        return toDTO(requireReadingAccess(id, jwt));
    }

    // UPDATE - Update a reading
    @PutMapping("/{id}")
    public EnergyMeterReadingFieldsDTO updateReading(
            @PathVariable String id,
            @RequestBody EnergyMeterReadingFieldsDTO dto,
            @AuthenticationPrincipal Jwt jwt) {

        EnergyMeterReading existing = requireReadingAccess(id, jwt);
        validateReading(dto);

        applyFields(existing, dto);

        return readingService.updateReading(id, existing)
                .map(this::toDTO)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Reading not found."));
    }

    // DELETE - Delete a reading
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReading(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {

        requireReadingAccess(id, jwt);

        if (!readingService.deleteReading(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Reading not found.");
        }

        return ResponseEntity.noContent().build();
    }

    // Verify that the authenticated user can access the meter's property.
    private void requireMeterAccess(String meterId, Jwt jwt) {

        String userId = requireUserId(jwt);
        EnergyMeter meter = meterRepo.findByID(meterId);

        if (meter == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Meter not found.");
        }

        propertyService.getPropertyById(
                meter.getAssociatedPropertyID(), userId);
    }

    // Find a reading and verify access to its associated meter.
    private EnergyMeterReading requireReadingAccess(
            String id, Jwt jwt) {

        EnergyMeterReading reading = readingService.getReadingById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Reading not found."));

        requireMeterAccess(reading.getAssociatedMeterID(), jwt);

        return reading;
    }

    private String requireUserId(Jwt jwt) {

        if (jwt == null || jwt.getSubject() == null
                || jwt.getSubject().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication is required.");
        }

        return jwt.getSubject();
    }

    // Check required values before saving.
    private void validateReading(EnergyMeterReadingFieldsDTO dto) {

        if (dto == null || dto.date() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Reading date is required.");
        }

        try {
            YearMonth.parse(dto.date());
        } catch (DateTimeParseException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Reading date must use YYYY-MM format.");
        }

        if (!Float.isFinite(dto.usage())
                || !Float.isFinite(dto.cost())
                || dto.usage() < 0 || dto.cost() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Usage and cost must be finite, nonnegative numbers.");
        }
    }

    // Copy editable DTO fields into the MongoDB model.
    private void applyFields(
            EnergyMeterReading reading,
            EnergyMeterReadingFieldsDTO dto) {

        reading.setDate(dto.date());
        reading.setRawUse(dto.usage());
        reading.setCost(dto.cost());
    }

    // Convert a MongoDB reading into the frontend DTO.
    private EnergyMeterReadingFieldsDTO toDTO(
            EnergyMeterReading reading) {

        return new EnergyMeterReadingFieldsDTO(
                reading.getId(),
                reading.getDate(),
                reading.getRawUse(),
                reading.getCost(),
                null
        );
    }
}
