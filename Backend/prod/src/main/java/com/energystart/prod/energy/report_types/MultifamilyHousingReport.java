package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.time.LocalDate;
import java.util.List;

public class MultifamilyHousingReport extends EnergyReport {

    private BUILDING_HEIGHT_TYPES BuildingType;
    private int numOfBedrooms;
    private int numOfResidentialUnits;

    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

    //Constructors

    public MultifamilyHousingReport() {}

    public MultifamilyHousingReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                                    BUILDING_HEIGHT_TYPES buildingType, int numOfBedrooms,
                                    int numOfResidentialUnits) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setBuildingType(buildingType);
        setNumOfBedrooms(numOfBedrooms);
        setNumOfResidentialUnits(numOfResidentialUnits);
    }

    //Custom Methods
    public float energyStarRegressionCalc(LocalDate startDate, LocalDate endDate, float cdd, float hdd) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 130.7f; //standard
        float squareFoot = this.getGrossFloorArea();
        float squareFootPerThousand = squareFoot / 1000;
        float unitsPerThousandFt = this.getNumOfResidentialUnits() / squareFootPerThousand;
        float bedroomsPerUnit = (float) this.getNumOfBedrooms() / this.getNumOfResidentialUnits();
        float hasLowRise = (getBuildingType().equals(BUILDING_HEIGHT_TYPES.lowRise)) ? 0.6667f : 0f;
        float cooled = cdd;
        float heated = hdd;

        predictedSourceEUI += (unitsPerThousandFt - 1.215f) * 48.01f;
        predictedSourceEUI += (bedroomsPerUnit - 1.238f) * 22.64f;
        predictedSourceEUI += hasLowRise;
        predictedSourceEUI += (cooled - 1364f) * 0.01406f;
        predictedSourceEUI += (heated - 4233f) * 0.008989f;

        return predictedSourceEUI * this.getGrossFloorArea();
    }


    //Getters and Setters

    public BUILDING_HEIGHT_TYPES getBuildingType() {
        return BuildingType;
    }

    public void setBuildingType(BUILDING_HEIGHT_TYPES buildingType) {
        BuildingType = buildingType;
    }

    public int getNumOfBedrooms() {
        return numOfBedrooms;
    }

    public void setNumOfBedrooms(int numOfBedrooms) {
        this.numOfBedrooms = numOfBedrooms;
    }

    public int getNumOfResidentialUnits() {
        return numOfResidentialUnits;
    }

    public void setNumOfResidentialUnits(int numOfResidentialUnits) {
        this.numOfResidentialUnits = numOfResidentialUnits;
    }
}
