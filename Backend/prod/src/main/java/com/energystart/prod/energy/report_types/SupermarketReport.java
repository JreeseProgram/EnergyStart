package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class SupermarketReport extends EnergyReport {

    private int numOfOpenClosedFreezers;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;
    private int weeklyOperatingHours;

    //Constructors

    public SupermarketReport() {}

    public SupermarketReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                             int numOfOpenClosedFreezers, int numOfWorkersMainShift,
                             float percentCooled, float percentHeated, int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setNumOfOpenClosedFreezers(numOfOpenClosedFreezers);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
        setWeeklyOperatingHours(weeklyOperatingHours);
    }

    //Getters and Setters

    public int getNumOfOpenClosedFreezers() {
        return numOfOpenClosedFreezers;
    }

    public void setNumOfOpenClosedFreezers(int numOfOpenClosedFreezers) {
        this.numOfOpenClosedFreezers = numOfOpenClosedFreezers;
    }

    public int getNumOfWorkersMainShift() {
        return numOfWorkersMainShift;
    }

    public void setNumOfWorkersMainShift(int numOfWorkersMainShift) {
        this.numOfWorkersMainShift = numOfWorkersMainShift;
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

    public int getWeeklyOperatingHours() {
        return weeklyOperatingHours;
    }

    public void setWeeklyOperatingHours(int weeklyOperatingHours) {
        this.weeklyOperatingHours = weeklyOperatingHours;
    }
}
