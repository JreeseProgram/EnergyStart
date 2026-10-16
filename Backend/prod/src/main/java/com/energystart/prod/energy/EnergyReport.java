package com.energystart.prod.energy;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.energystart.prod.energy.report_types.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@Document("EnergyReports")
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "reportType"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = BankBranchReport.class, name = "BANK_BRANCH"),
        @JsonSubTypes.Type(value = ConvenienceStoreReport.class, name = "CONVENIENCE_STORE"),
        @JsonSubTypes.Type(value = CourtHouseReport.class, name = "COURT_HOUSE"),
        @JsonSubTypes.Type(value = DataCenterReport.class, name = "DATA_CENTER"),
        @JsonSubTypes.Type(value = DistributionCenterReport.class, name = "DISTRIBUTION_CENTER"),
        @JsonSubTypes.Type(value = FinancialOfficeReport.class, name = "FINANCIAL_OFFICE"),
        @JsonSubTypes.Type(value = HospitalReport.class, name = "HOSPITAL"),
        @JsonSubTypes.Type(value = HotelReport.class, name = "HOTEL"),
        @JsonSubTypes.Type(value = MedicalOfficeReport.class, name = "MEDICAL_OFFICE"),
        @JsonSubTypes.Type(value = MultifamilyHousingReport.class, name = "MULTIFAMILY_HOUSING"),
        @JsonSubTypes.Type(value = OfficeReport.class, name = "OFFICE"),
        @JsonSubTypes.Type(value = RetailStoreReport.class, name = "RETAIL_STORE"),
        @JsonSubTypes.Type(value = SchoolReport.class, name = "SCHOOL"),
        @JsonSubTypes.Type(value = SeniorLivingCommunityReport.class, name = "SENIOR_LIVING_COMMUNITY"),
        @JsonSubTypes.Type(value = SupermarketReport.class, name = "SUPERMARKET"),
        @JsonSubTypes.Type(value = VehicleDealershipReport.class, name = "VEHICLE_DEALERSHIP"),
        @JsonSubTypes.Type(value = WarehouseRefrigeratedReport.class, name = "WAREHOUSE_REFRIGERATED"),
        @JsonSubTypes.Type(value = WarehouseReport.class, name = "WAREHOUSE"),
        @JsonSubTypes.Type(value = WholesaleClubReport.class, name = "WHOLESALE_CLUB"),
        @JsonSubTypes.Type(value = WorshipFacilityReport.class, name = "WORSHIP_FACILITY")
})
public class EnergyReport {

    @Id
    private String ID;
    private String relatedPropertyID;

    // Low-rise: 1–4 stories; mid-rise: 5–9; high-rise: 10 or more.
    public enum BUILDING_HEIGHT_TYPES {
        lowRise,
        midRise,
        highRise
    }

    private List<EnergyMeter> energyMeters;
    private float energyScore;
    private int grossFloorArea;
    private int parkingSize;
    private int yearOfConstruction;

    public EnergyReport() {
    }

    public EnergyReport(
            int grossFloorArea, int parkingSize, int yearOfConstruction) {
        setGrossFloorArea(grossFloorArea);
        setParkingSize(parkingSize);
        setYearOfConstruction(yearOfConstruction);
    }

    public EnergyReport(
            String ID, String relatedPropertyID,
            List<EnergyMeter> energyMeters, float energyScore,
            int grossFloorArea, int parkingSize, int yearOfConstruction) {
        setID(ID);
        setRelatedPropertyID(relatedPropertyID);
        setEnergyMeters(energyMeters);
        setEnergyScore(energyScore);
        setGrossFloorArea(grossFloorArea);
        setParkingSize(parkingSize);
        setYearOfConstruction(yearOfConstruction);
    }

    public void addEnergyMeter(EnergyMeter newMeter) {
        energyMeters.add(newMeter);
    }

    public float calcEnergyScore() {
        return -1f;
    }

    /**
     * Retrieves temperatures for the ZIP code and requested dates.
     * Returns CDD at index 0 and HDD at index 1, or {-1, -1} on failure.
     */
    public static Integer[] retrieveCDDHDD(
            int zipcode, LocalDate startDate, LocalDate endDate) {
        try {
            JsonObject zipJson = readJson(
                    "https://api.zippopotam.us/us/" + zipcode);

            JsonObject place = zipJson.getAsJsonArray("places")
                    .get(0).getAsJsonObject();

            double longitude = place.get("longitude").getAsDouble();
            double latitude = place.get("latitude").getAsDouble();

            String weatherUrl =
                    "https://archive-api.open-meteo.com/v1/archive"
                    + "?latitude=" + latitude
                    + "&longitude=" + longitude
                    + "&start_date=" + startDate
                    + "&end_date=" + endDate
                    + "&timezone=auto"
                    + "&daily=temperature_2m_max,temperature_2m_min"
                    + "&temperature_unit=fahrenheit";

            JsonObject daily = readJson(weatherUrl)
                    .getAsJsonObject("daily");

            return calculateDegreeDays(
                    daily.getAsJsonArray("temperature_2m_max"),
                    daily.getAsJsonArray("temperature_2m_min"));

        } catch (Exception exception) {
            exception.printStackTrace();
            return new Integer[] {-1, -1};
        }
    }

    /**
     * Calculates degree days from daily Fahrenheit temperatures.
     * Keeping this separate lets tests use fixed data without internet access.
     */
    public static Integer[] calculateDegreeDays(
            JsonArray maxTemps, JsonArray minTemps) {

        if (maxTemps == null || minTemps == null
                || maxTemps.size() != minTemps.size()) {
            throw new IllegalArgumentException(
                    "Maximum and minimum temperatures must have matching lengths.");
        }

        double cdd = 0.0;
        double hdd = 0.0;

        for (int i = 0; i < maxTemps.size(); i++) {
            if (maxTemps.get(i).isJsonNull()
                    || minTemps.get(i).isJsonNull()) {
                continue;
            }

            double meanTemp = (
                    maxTemps.get(i).getAsDouble()
                    + minTemps.get(i).getAsDouble()) / 2.0;

            if (meanTemp > 65.0) {
                cdd += meanTemp - 65.0;
            } else {
                hdd += 65.0 - meanTemp;
            }
        }

        // Preserve the existing behavior: round after summing all days.
        return new Integer[] {
                (int) Math.round(cdd),
                (int) Math.round(hdd)
        };
    }

    private static JsonObject readJson(String url) throws Exception {
        HttpURLConnection connection =
                (HttpURLConnection) URI.create(url).toURL().openConnection();

        connection.setRequestMethod("GET");
        connection.setConnectTimeout(5000);
        connection.setReadTimeout(10000);

        try {
            if (connection.getResponseCode() != 200) {
                throw new java.io.IOException(
                        "Unexpected response code: "
                                + connection.getResponseCode());
            }

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(
                            connection.getInputStream(),
                            StandardCharsets.UTF_8))) {
                return new Gson().fromJson(reader, JsonObject.class);
            }
        } finally {
            connection.disconnect();
        }
    }

    public String getID() {
        return ID;
    }

    public void setID(String ID) {
        this.ID = ID;
    }

    public String getRelatedPropertyID() {
        return relatedPropertyID;
    }

    public void setRelatedPropertyID(String relatedPropertyID) {
        this.relatedPropertyID = relatedPropertyID;
    }

    public List<EnergyMeter> getEnergyMeters() {
        return energyMeters;
    }

    public void setEnergyMeters(List<EnergyMeter> energyMeters) {
        this.energyMeters = energyMeters;
    }

    public float getEnergyScore() {
        return energyScore;
    }

    public void setEnergyScore(float energyScore) {
        this.energyScore = energyScore;
    }

    public int getGrossFloorArea() {
        return grossFloorArea;
    }

    public void setGrossFloorArea(int grossFloorArea) {
        this.grossFloorArea = grossFloorArea;
    }

    public int getParkingSize() {
        return parkingSize;
    }

    public void setParkingSize(int parkingSize) {
        this.parkingSize = parkingSize;
    }

    public int getYearOfConstruction() {
        return yearOfConstruction;
    }

    public void setYearOfConstruction(int yearOfConstruction) {
        this.yearOfConstruction = yearOfConstruction;
    }
}
