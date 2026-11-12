package com.energystart.prod.service;

import com.energystart.prod.dto.FrontendLinkingDTO;
import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyMeterReading;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterReadingRepo;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.EnergyReportRepo;
import com.energystart.prod.repos.PropertyRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.server.ResponseStatusException;

import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class AltPropertyService {
    private final EnergyMeterRepo energyMeterRepo;
    private final EnergyReportRepo energyReportRepo;
    private final EnergyMeterReadingRepo energyMeterReadingRepo;
    private final PropertyRepo propertyRepo;
    private final WorkOsUserService workOsUserService;

    public AltPropertyService(EnergyMeterRepo energyMeterRepo,
                              EnergyReportRepo energyReportRepo,
                              EnergyMeterReadingRepo energyMeterReadingRepo,
                              PropertyRepo propertyRepo,
                              WorkOsUserService workOsUserService) {
        this.energyMeterRepo = energyMeterRepo;
        this.energyReportRepo = energyReportRepo;
        this.energyMeterReadingRepo = energyMeterReadingRepo;
        this.propertyRepo = propertyRepo;
        this.workOsUserService = workOsUserService;
    }

    //GET request
    public FrontendLinkingDTO.Property getProperty(String id, YearMonth startDate, YearMonth endDate, String userId) {
        FrontendLinkingDTO.Property property;
        Property dbProperty = propertyRepo.findById(id).get();

        requireUser(userId);
        verifyUser(userId, dbProperty);

        List<EnergyReport>  energyReports = energyReportRepo.findAllByRelatedPropertyID(dbProperty.getId());
        List<EnergyMeter> energyMeters = energyMeterRepo.findAllByAssociatedPropertyID(dbProperty.getId());
        List<EnergyMeterReading> energyMeterReadings = new ArrayList<>();

        List<String> allMeterIDs = energyMeters.stream()
                .map(EnergyMeter::getID)
                .toList();
        energyMeterReadings.addAll(
                energyMeterReadingRepo.findAllByAssociatedMeterIDInAndDateBetween(
                        allMeterIDs,
                        startDate.toString(),
                        endDate.toString()
                )
        );

        String largestType = "None";
        int largestValue = 0;
        int totalSqft = 0;
        for (EnergyReport energyReport : energyReports) {
            totalSqft += energyReport.getGrossFloorArea();

            if(energyReport.getGrossFloorArea() > largestValue) {
                largestType = energyReport.getClass().getSimpleName();
                largestValue = energyReport.getGrossFloorArea();
            }
        }

        if(!(((float)largestValue/totalSqft)>0.5) ){
            largestType = "None";
        }

        int energyScore = 0;
        long months = ChronoUnit.MONTHS.between(startDate, endDate) + 1; //+1 makes it inclusive
        if (months >= 12 && !largestType.equals("None")) {
            Integer[] cddhdd = EnergyReport.retrieveCDDHDD(dbProperty.getZipcode(),startDate.atDay(1),endDate.atEndOfMonth());
            energyScore = dbProperty.calculateEnergyScore(
                    energyReportRepo,
                    energyMeterRepo,
                    energyMeterReadingRepo,
                    startDate.toString(),
                    endDate.toString(),
                    cddhdd[0],
                    cddhdd[1]
            );

        }
        float siteEUI = 0f;
        float sourceEUI = 0f;
        float energyUse = 0f;
        for (EnergyMeterReading energyMeterReading : energyMeterReadings) {
            siteEUI += energyMeterReading.getSiteEUI();
            sourceEUI += energyMeterReading.getSourceEUI();
            energyUse += energyMeterReading.getMeterKBtu();
        }

        property = new FrontendLinkingDTO.Property(
                dbProperty.getId(),
                dbProperty.getId(),
                dbProperty.getCity(),
                energyScore,
                dbProperty.getPropertyName(),
                dbProperty.getNotes(),
                dbProperty.getAuthorizedUserIds(),
                EnergyReport.consistentName(largestType),
                dbProperty.getState(),
                dbProperty.getStreetAddress(),
                dbProperty.getZipcode().toString(),
                (startDate.toString() + " " + endDate.toString()),
                siteEUI,
                sourceEUI,
                energyUse,
                totalSqft
        );
        return property;
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
