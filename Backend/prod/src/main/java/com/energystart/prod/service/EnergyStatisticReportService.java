package com.energystart.prod.service;

import com.energystart.prod.dto.FrontendLinkingDTO;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterReadingRepo;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.EnergyReportRepo;
import com.energystart.prod.repos.PropertyRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class EnergyStatisticReportService {

    private final EnergyMeterRepo energyMeterRepo;
    private final EnergyReportRepo energyReportRepo;
    private final EnergyMeterReadingRepo energyMeterReadingRepo;
    private final PropertyRepo propertyRepo;
    private final WorkOsUserService workOsUserService;

    public EnergyStatisticReportService(EnergyMeterRepo energyMeterRepo, EnergyReportRepo energyReportRepo,
                                        EnergyMeterReadingRepo energyMeterReadingRepo, PropertyRepo propertyRepo,
                                        WorkOsUserService workOsUserService) {
        this.energyMeterRepo = energyMeterRepo;
        this.energyReportRepo = energyReportRepo;
        this.energyMeterReadingRepo = energyMeterReadingRepo;
        this.propertyRepo = propertyRepo;
        this.workOsUserService = workOsUserService;
    }

    public FrontendLinkingDTO.EnergyReport getEnergyReport(
            String propId,
            YearMonth startDate,
            YearMonth endDate,
            String userId) {

        requireUser(userId);
        Property property = propertyRepo.findById(propId).orElse(null);
        if  (property == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Could not find property with id " + propId);
        }
        verifyUser(userId, property);

        String id = UUID.randomUUID().toString();
        String propertyId = property.getId();
        LocalDateTime startDateTime = LocalDateTime.now();


        //Determine if We send Energy Score or EUI
        long months = ChronoUnit.MONTHS.between(startDate, endDate) + 1; //+1 makes it inclusive
        if (months >= 12) {

        }
        else{
            
        }

    }

    private void requireUser(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "You must be logged in to do this action");
        }
    }

    private void verifyUser(String userId, Property property){
        List<String> users = property.getAuthorizedUserIds();

        if (!users.contains(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You do not have access to this, Ask the owner for access"
            );
        }
    }
}
