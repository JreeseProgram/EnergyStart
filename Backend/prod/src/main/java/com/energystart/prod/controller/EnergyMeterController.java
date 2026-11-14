
package com.energystart.prod.controller;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.service.EnergyMeterService;

import com.energystart.prod.dto.EnergyMeterDTO;
import com.energystart.prod.mapper.EnergyMeterMapper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.converter.HttpMessageNotReadableException;

import java.util.List;

@RestController
@RequestMapping("/api/energy-meters")
public class EnergyMeterController {

    private final EnergyMeterService energyMeterService;
    private final EnergyMeterMapper energyMeterMapper;


    // Constructor dependency injection
    public EnergyMeterController(
            EnergyMeterService energyMeterService,
            EnergyMeterMapper energyMeterMapper) {

        this.energyMeterService = energyMeterService;
        this.energyMeterMapper = energyMeterMapper;
    }

    // CREATE - Save a new energy meter
    @PostMapping
    public ResponseEntity<EnergyMeter> createMeter(
            @RequestBody EnergyMeter meter) {

        EnergyMeter createdMeter =
                energyMeterService.createMeter(meter);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdMeter);
    }


    // CREATE - Save a new energy meter using the frontend DTO
    @PostMapping("/dto")
    public ResponseEntity<EnergyMeterDTO> createMeterDTO(
            @RequestBody EnergyMeterDTO dto) {

        EnergyMeter meter = energyMeterMapper.toEnergyMeter(dto);

        EnergyMeter createdMeter =
                energyMeterService.createMeter(meter);

        EnergyMeterDTO response =
                energyMeterMapper.toEnergyMeterDTO(createdMeter);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // READ - Retrieve all energy meters
    @GetMapping
    public ResponseEntity<List<EnergyMeter>> getAllMeters() {

        return ResponseEntity.ok(
                energyMeterService.getAllMeters()
        );
    }


    // READ - Retrieve all energy meters as frontend DTOs
    @GetMapping("/dto")
    public ResponseEntity<List<EnergyMeterDTO>> getAllMeterDTOs() {

        List<EnergyMeterDTO> meters =
                energyMeterService.getAllMeters()
                        .stream()
                        .map(energyMeterMapper::toEnergyMeterDTO)
                        .toList();

        return ResponseEntity.ok(meters);
    }


    // READ - Retrieve an energy meter by ID
    @GetMapping("/{id}")
    public ResponseEntity<EnergyMeter> getMeterById(
            @PathVariable String id) {

        return energyMeterService.getMeterById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }


    // READ - Retrieve one energy meter as a frontend DTO
    @GetMapping("/dto/{id}")
    public ResponseEntity<EnergyMeterDTO> getMeterDTOById(
            @PathVariable String id) {

        return energyMeterService.getMeterById(id)
                .map(energyMeterMapper::toEnergyMeterDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }


    // UPDATE - Replace an existing energy meter
    @PutMapping("/{id}")
    public ResponseEntity<EnergyMeter> updateMeter(
            @PathVariable String id,
            @RequestBody EnergyMeter meter) {

        return energyMeterService.updateMeter(id, meter)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }


    // UPDATE - Replace an existing energy meter using the frontend DTO
    @PutMapping("/dto/{id}")
    public ResponseEntity<EnergyMeterDTO> updateMeterDTO(
            @PathVariable String id,
            @RequestBody EnergyMeterDTO dto) {

        EnergyMeter meter = energyMeterMapper.toEnergyMeter(dto);

        return energyMeterService.updateMeter(id, meter)
                .map(energyMeterMapper::toEnergyMeterDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }


    // DELETE - Remove an energy meter
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeter(
            @PathVariable String id) {

        if (energyMeterService.deleteMeter(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }


    // DELETE - Remove an energy meter using the DTO endpoint
    @DeleteMapping("/dto/{id}")
    public ResponseEntity<Void> deleteMeterDTO(
            @PathVariable String id) {

        if (energyMeterService.deleteMeter(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }


    // Handle invalid meter information
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleInvalidMeter(
            IllegalArgumentException ex) {

        return ResponseEntity
                .badRequest()
                .body(ex.getMessage());
    }

    // Handle malformed JSON or invalid enum values
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleInvalidJson(
            HttpMessageNotReadableException ex) {

        return ResponseEntity
                .badRequest()
                .body("Invalid JSON or unsupported meter type or unit.");
    }
}
