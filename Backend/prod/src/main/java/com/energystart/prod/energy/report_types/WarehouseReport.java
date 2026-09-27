package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class WarehouseReport extends EnergyReport {

    private int numOfWorkersMainShift;
    private float percentColdStorage;
    private float percentCooled;
    private float percentHeated;
    private int weeklyOperatingHours;

    //Constructors
    public WarehouseReport(){ };

    public WarehouseReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                           int numOfWorkersMainShift, float percentColdStorage,
                           float percentCooled, float percentHeated, int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentColdStorage(percentColdStorage);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
        setWeeklyOperatingHours(weeklyOperatingHours);
    }

    //Getters and Setters

    public int getNumOfWorkersMainShift() {
        return numOfWorkersMainShift;
    }

    public void setNumOfWorkersMainShift(int numOfWorkersMainShift) {
        this.numOfWorkersMainShift = numOfWorkersMainShift;
    }

    public float getPercentColdStorage() {
        return percentColdStorage;
    }

    public void setPercentColdStorage(float percentColdStorage) {
        this.percentColdStorage = percentColdStorage;
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
