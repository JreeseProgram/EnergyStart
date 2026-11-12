package com.energystart.prod.dto;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class FrontendLinkingDTO {

    public record EnergyReport(
            String id,
            String PropertyId,
            String startMonth,
            String endMonth,
            LocalDateTime generatedAt,
            float aggregateSiteEUI,
            float aggregateSourceEUI,
            int energyScore,
            List<String> disqualifiers,
            PropertySnapshot propertySnapshot,
            Snapshot snapshot

    ){
        public record PropertySnapshot(
                String name,
                String streetAddress,
                String city,
                String state,
                String zip
        ){}
        public record Snapshot(
                String version,
                LocalDateTime asOf,
                int floorAreaSqFt,
                List<PortfolioMonthlyPerformance> monthlyPerformance
        ){}
    }

    public record PortfolioMonthlyPerformance(
            String month,
            float siteEnergyKbtu,
            float sourceEnergyKbtu
    ){}

    public record PortfolioPerformanceInput(
            List<String> propertyIds,
            LocalDateTime asOf
    ){}

    public record PortfolioPropertyPerformance(
            String propertyId,
            int floorAreaSqft,
            int meterCount,
            int currentMeterCount,
            boolean reportReady,
            List<PortfolioMonthlyPerformance> monthlyPerformance
    ){}

    public record PortfolioPerformance(
            boolean simulated,
            LocalDateTime asOf,
            List<PortfolioPropertyPerformance> properties
    ){}

    public record Property(
            String id,
            String humanReadablePropertyId,
            String city,
            int energyStarScore,
            String name,
            String notes,
            List<String> authUsers,
            String propertyType,
            String state,
            String streetAddress,
            String zip,
            String reportingYear,
            float siteEui,
            float sourceEui,
            float energyUse,
            int grossFloorArea
    ){}
}
