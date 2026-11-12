package com.energystart.prod.service;

import com.energystart.prod.dto.FrontendLinkingDTO;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterReadingRepo;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.EnergyReportRepo;
import com.energystart.prod.repos.PropertyRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PortfolioPerformanceService {
    private final EnergyMeterRepo energyMeterRepo;
    private final EnergyReportRepo energyReportRepo;
    private final EnergyMeterReadingRepo energyMeterReadingRepo;
    private final PropertyRepo propertyRepo;
    private final WorkOsUserService workOsUserService;

    public PortfolioPerformanceService(EnergyMeterRepo energyMeterRepo, EnergyReportRepo energyReportRepo,
                                       EnergyMeterReadingRepo energyMeterReadingRepo, PropertyRepo propertyRepo,
                                       WorkOsUserService workOsUserService) {
        this.energyMeterRepo = energyMeterRepo;
        this.energyReportRepo = energyReportRepo;
        this.energyMeterReadingRepo = energyMeterReadingRepo;
        this.propertyRepo = propertyRepo;
        this.workOsUserService = workOsUserService;
    }

    public FrontendLinkingDTO.PortfolioPerformanceInput getPortfolioPerformanceInput(String userID) {
        requireUser(userID);

        List<String> propertyIds = propertyRepo.findByAuthorizedUserIdsContaining(userID)
                .stream()
                .map(Property::getId)
                .toList();


        return new FrontendLinkingDTO.PortfolioPerformanceInput(
                propertyIds,
                LocalDateTime.now()
        );

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
