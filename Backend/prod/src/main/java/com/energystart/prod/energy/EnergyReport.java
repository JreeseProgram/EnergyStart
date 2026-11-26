package com.energystart.prod.energy;

import com.energystart.prod.repos.EnergyMeterRepo;
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
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

//NOTE: due to abstraction issues, this will not be abstract. Instead, NEVER MAKE A REAL ENERGY REPORT OBJECT;
//Only use its children

/**
 * This contains the basis of which all other energy reports are based from, with all common
 * information and a helper function
 * <p>
 *     This should <b>NEVER</b> be instantiated. It's not abstract due to issues pertaining to the differences of
 *     Data center sub type, and instead has a special overloaded method for it.
 * </p>
 */

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
    private int grossFloorArea;
    private int parkingSize;
    private int yearOfConstruction;

    //Constructors
    public EnergyReport() {}

    /**
     * This is the primary constructor for the Object
     * @param grossFloorArea Total area in SqFt
     * @param parkingSize Total Area of the area dedicated to parking
     * @param yearOfConstruction When the building was built
     */
    public EnergyReport(int grossFloorArea, int parkingSize, int yearOfConstruction) {
        setGrossFloorArea(grossFloorArea);
        setParkingSize(parkingSize);
        setYearOfConstruction(yearOfConstruction);
    }

    /**
     * All args constructor
     */
    public EnergyReport(String ID, String relatedPropertyID,
                        int grossFloorArea, int parkingSize, int yearOfConstruction) {
        setID(ID);
        setRelatedPropertyID(relatedPropertyID);
        setGrossFloorArea(grossFloorArea);
        setParkingSize(parkingSize);
        setYearOfConstruction(yearOfConstruction);
    }

    //Custom Methods

    /**
     * This takes a string that should be a simple class name and returns it in our
     * formatting for each type of building use
     * @param input Should be a simple class name
     * @return Properly formatted version of the class
     */
    public static String consistentName(String input){
        return switch (input) {
            case "BankBranchReport" -> "BANK_BRANCH";
            case "ConvenienceStoreReport" -> "CONVENIENCE_STORE";
            case "CourtHouseReport" -> "COURT_HOUSE";
            case "DataCenterReport" -> "DATA_CENTER";
            case "DistributionCenterReport" -> "DISTRIBUTION_CENTER";
            case "FinancialOfficeReport" -> "FINANCIAL_OFFICE";
            case "HospitalReport" -> "HOSPITAL";
            case "HotelReport" -> "HOTEL";
            case "MedicalOfficeReport" -> "MEDICAL_OFFICE";
            case "MultifamilyHousingReport" -> "MULTIFAMILY_HOUSING";
            case "OfficeReport" -> "OFFICE";
            case "RetailStoreReport" -> "RETAIL_STORE";
            case "SchoolReport" -> "SCHOOL";
            case "SeniorLivingCommunityReport" -> "SENIOR_LIVING";
            case "SupermarketReport" -> "SUPERMARKET";
            case "VehicleDealershipReport" -> "VEHICLE_DEALERSHIP";
            case "WarehouseRefrigeratedReport" -> "WAREHOUSE_REFRIGERATED";
            case "WarehouseReport" -> "WAREHOUSE";
            case "WholesaleClubReport" -> "WHOLESALE_CLUB";
            case "WorshipFacilityReport" -> "WORSHIP_FACILITY";
            default -> "None";
        };
    }


    /**
     * This is the format used for all Energy reports (except data center)
     * @param cdd Cooling Degree Days
     * @param hdd Heating Degree Days
     * @param sqft Total Square foot
     * @return see the child classes for more information
     */
    public float energyStarRegressionCalc(float cdd, float hdd, int sqft) {
        return -1;
    }

    /**
     * This is the specific overload for Data Center Regression
     * @return see the child class for more information
     */
    public float energyStarRegressionCalc() {
        return -1;
    }


    /**
     * This uses Zippopotam.us and open-meteo to retrieve information on the temperatures
     * and allows to calculate the Cooling Degree Days and Heating Degree Days.
     * @param zipcode Provide the 5 digit zipcode for the request
     * @param startDate Start date for query (YYYY-MM-DD LocalDate)
     * @param endDate End date for query (YYYY-MM-DD LocalDate)
     * @return Index 0 is CDD, Index 1 is HDD
    */
    public static Integer[] retrieveCDDHDD(int zipcode, LocalDate startDate, LocalDate endDate) {
        Integer[] result = new Integer[] {-1,-1};
        try {
            double cdd = 0.0;
            double hdd = 0.0;
            double latitude = 0.0;
            double longitude = 0.0;

            //Must convert Zipcode to Coordinates for open-mateo
            //Can be easily updated via country code if scope changes
            String zipURL = "https://api.zippopotam.us/us/" + zipcode;
            URL zipContainer = URI.create(zipURL).toURL();
            HttpURLConnection zipCon = (HttpURLConnection) zipContainer.openConnection();
            zipCon.setRequestMethod("GET");

            if(zipCon.getResponseCode() != 200) {
                System.out.println("Zip code retrieval failed: "
                        + zipCon.getResponseMessage());
                return result;
            }

            BufferedReader zipReader = new BufferedReader(
                    new InputStreamReader(zipCon.getInputStream(), StandardCharsets.UTF_8));
            Gson gson = new Gson();
            JsonObject zipJson = gson.fromJson(zipReader, JsonObject.class);
            zipReader.close();
            zipCon.disconnect();

            longitude = zipJson.getAsJsonArray("places")
                    .get(0)
                    .getAsJsonObject()
                    .get("longitude")
                    .getAsDouble();
            latitude = zipJson.getAsJsonArray("places")
                    .get(0)
                    .getAsJsonObject()
                    .get("latitude")
                    .getAsDouble();

            //Structured URL for temperature data
            String queryURL = "https://archive-api.open-meteo.com/v1/archive"
                    + "?latitude=" + latitude
                    + "&longitude=" + longitude
                    + "&start_date=" + startDate
                    + "&end_date=" + endDate
                    + "&timezone=auto"
                    + "&daily=temperature_2m_max,temperature_2m_min"
                    + "&temperature_unit=fahrenheit";
            //Connect and Retrieve info
            URL url = URI.create(queryURL).toURL();
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            if(connection.getResponseCode() != 200){
                System.out.println("Unexpected Response code: " + connection.getResponseMessage());
                return result;
            }

            BufferedReader weatherReader = new BufferedReader(
                    new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8));

            JsonObject weatherJson = gson.fromJson(weatherReader, JsonObject.class);
            weatherReader.close();
            connection.disconnect();

            //Extract Data and compute a mean for each day
            JsonObject dailyWeather = weatherJson.getAsJsonObject("daily");
            JsonArray maxTemps = dailyWeather.getAsJsonArray("temperature_2m_max");
            JsonArray minTemps = dailyWeather.getAsJsonArray("temperature_2m_min");

            for (int i = 0; i < maxTemps.size(); i++) {
                if(maxTemps.get(i).isJsonNull() || minTemps.get(i).isJsonNull()) {
                    continue;
                }
                double maxTemp = maxTemps.get(i).getAsDouble();
                double minTemp = minTemps.get(i).getAsDouble();

                double meanTemp = (maxTemp + minTemp) / 2;

                if(meanTemp > 65.0) {
                    cdd += (meanTemp - 65.0);
                } else {
                    hdd += (65.0 - meanTemp);
                }

            }

            result[0] = (int) Math.round(cdd);
            result[1] = (int) Math.round(hdd);

        }catch (Exception e){
            e.printStackTrace();
            return result;
        }
        return result;
    }

    //Getters and Setters


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
