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
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

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

        List<EnergyMeter> energyMeters = energyMeterRepo.findAllByAssociatedPropertyID(propertyId);


        List<String> meterIDs = energyMeters.stream()
                .map(EnergyMeter::getID)
                .toList();

        List<EnergyMeterReading> meterReadings = energyMeterReadingRepo.findAllByAssociatedMeterIDInAndDateBetween(
                meterIDs,
                startDate.toString(),
                endDate.toString()
        );

        List<FrontendLinkingDTO.PortfolioMonthlyPerformance> allPerformance = new ArrayList<>();
        float aggregateSiteEUI = 0f;
        float aggregateSourceEUI = 0f;
        //Creates an organized map that is easy to iterate
        Map<String, List<EnergyMeterReading>> readingSortedByMonth = meterReadings.stream()
                .collect(Collectors.groupingBy(EnergyMeterReading::getDate));

        for (YearMonth current = startDate; !current.isAfter(endDate); current = current.plusMonths(1)) {
            float siteEnergy = (float) readingSortedByMonth.getOrDefault(current.toString(),List.of()).stream()
                    .mapToDouble(EnergyMeterReading::getSiteEUI)
                    .sum();
            float sourceEnergy = (float) readingSortedByMonth.getOrDefault(current.toString(),List.of()).stream()
                    .mapToDouble(EnergyMeterReading::getSourceEUI)
                    .sum();

            aggregateSiteEUI += siteEnergy;
            aggregateSourceEUI += sourceEnergy;

            allPerformance.add(new FrontendLinkingDTO.PortfolioMonthlyPerformance(
                    current.toString(),
                    siteEnergy,
                    sourceEnergy
            ));
        }


        //Determine if We send Energy Score or EUI
        int energyScore = 0;
        long months = ChronoUnit.MONTHS.between(startDate, endDate) + 1; //+1 makes it inclusive
        List<String> disqualifiers = new ArrayList<>();
        Map<String, Long> readingCounts = meterReadings.stream()
                .collect(Collectors.groupingBy(
                        EnergyMeterReading::getAssociatedMeterID,
                        Collectors.counting()
                ));

        for (EnergyMeter meter : energyMeters){
            long count = readingCounts.getOrDefault(meter.getID(), 0L);

            if(!meter.isDelivered() && count < months){
                disqualifiers.add(String.format(
                        "%s does not have data for every month",
                        meter.getMeterName()
                        )
                );
            }
        }
        if (months >= 12 && disqualifiers.isEmpty()) {
            Integer[] cddhdd = EnergyReport.retrieveCDDHDD(
                    property.getZipcode(),
                    startDate.atDay(1),
                    endDate.atEndOfMonth());
            energyScore = property.calculateEnergyScore(
                    energyReportRepo,
                    energyMeterRepo,
                    energyMeterReadingRepo,
                    startDate.toString(),
                    endDate.toString(),
                    cddhdd[0],
                    cddhdd[1]
            );

        }
        else{
            disqualifiers.add("Query was for less than 12 months; Energy star score requires 12 months of data");
        }

        int totalSqft = energyReportRepo.findAllByRelatedPropertyID(propertyId).stream()
                .mapToInt(EnergyReport::getGrossFloorArea)
                .sum();

        return new FrontendLinkingDTO.EnergyReport(
                id,
                propertyId,
                startDate.toString(),
                endDate.toString(),
                LocalDateTime.now(),
                aggregateSiteEUI,
                aggregateSourceEUI,
                energyScore,
                disqualifiers,
                new FrontendLinkingDTO.EnergyReport.PropertySnapshot(
                        property.getPropertyName(),
                        property.getStreetAddress(),
                        property.getCity(),
                        property.getState(),
                        property.getZipcode().toString()
                ),
                new FrontendLinkingDTO.EnergyReport.Snapshot(
                        "portfolio-prototype-v1",
                        LocalDateTime.now(),
                        totalSqft,
                        allPerformance
                )
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
