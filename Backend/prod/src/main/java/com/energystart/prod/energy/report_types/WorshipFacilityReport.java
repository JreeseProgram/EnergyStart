package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class WorshipFacilityReport extends EnergyReport {

    private int grossFloorAreaForFoodPrep;
    private float percentCooled;
    private float percentHeated;
    private int seatingCapacity;
    private int weeklyOperatingHours;

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
