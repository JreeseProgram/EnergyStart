package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

public class WorshipFacilityReport extends EnergyReport {

    private int grossFloorAreaForFoodPrep;
    private float percentCooled;
    private float percentHeated;
    private int seatingCapacity;
    private int weeklyOperatingHours;

    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

    //Constructors
    public WorshipFacilityReport(){ };

    public WorshipFacilityReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                                 int grossFloorAreaForFoodPrep, float percentCooled,
                                 float percentHeated, int seatingCapacity, int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);
        setGrossFloorAreaForFoodPrep(grossFloorAreaForFoodPrep);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
        setSeatingCapacity(seatingCapacity);
        setWeeklyOperatingHours(weeklyOperatingHours);
    }
    //Custom Methods

    public float energyStarRegressionCalc(float cdd, float hdd, int sqft) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 68.24f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot / 1000;
        float weeklyOperatingHours = this.getWeeklyOperatingHours();
        float numSeatsPerThousandFt = this.getSeatingCapacity() / squareFootPerThousand;
        float percentAreaForFoodPrep = this.getGrossFloorAreaForFoodPrep() / squareFoot;
        float cooled = cdd * this.getPercentCooled();
        float heated = hdd * this.getPercentHeated();

        if(numSeatsPerThousandFt < 40){numSeatsPerThousandFt = 40f;}
        if(percentAreaForFoodPrep > 0.1){percentAreaForFoodPrep = 0.1f;}

        //Fix FP imprecision
        weeklyOperatingHours = Math.round(weeklyOperatingHours * 100.0f) / 100.0f;
        numSeatsPerThousandFt = Math.round(numSeatsPerThousandFt * 100.0f) / 100.0f;
        percentAreaForFoodPrep = Math.round(percentAreaForFoodPrep * 100000.0f) / 100000.0f;
        cooled = Math.round(cooled * 100.0f) / 100.0f;
        heated = Math.round(heated * 100.0f) / 100.0f;


        predictedSourceEUI += (weeklyOperatingHours - 26.49f) * 0.5107f;
        predictedSourceEUI += (numSeatsPerThousandFt - 47.84f) * 0.7336f;
        predictedSourceEUI += (percentAreaForFoodPrep - .004984f) * 291.9f;
        predictedSourceEUI += (cooled - 1471f) * 0.01249f;
        predictedSourceEUI += (heated - 3243f) * 0.004180f;

        return predictedSourceEUI * sqft;
    }


    //Getters and Setters

    public int getGrossFloorAreaForFoodPrep() {
        return grossFloorAreaForFoodPrep;
    }

    public void setGrossFloorAreaForFoodPrep(int grossFloorAreaForFoodPrep) {
        this.grossFloorAreaForFoodPrep = grossFloorAreaForFoodPrep;
    }

    public float getPercentCooled() {
        return percentCooled;
    }

    public void setPercentCooled(float percentCooled) {
        this.percentCooled = percentCooled;
    }

    public float getPercentHeated() {
        return percentHeated;
    }

    public void setPercentHeated(float percentHeated) {
        this.percentHeated = percentHeated;
    }

    public int getSeatingCapacity() {
        return seatingCapacity;
    }

    public void setSeatingCapacity(int seatingCapacity) {
        this.seatingCapacity = seatingCapacity;
    }

    public int getWeeklyOperatingHours() {
        return weeklyOperatingHours;
    }

    public void setWeeklyOperatingHours(int weeklyOperatingHours) {
        this.weeklyOperatingHours = weeklyOperatingHours;
    }
}
