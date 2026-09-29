package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class WarehouseRefrigeratedReport extends EnergyReport {

    private int weeklyOperatingHours;
    private int numOfWorkersMainShift;
    private float percentColdStorage;
    private float percentHeated;
    private float percentCooled;

    //Constructors

    public WarehouseRefrigeratedReport(){ };

    public WarehouseRefrigeratedReport(int grossFloorArea, int parkingSize,
                                       int yearOfConstruction, int weeklyOperatingHours,
                                       int numOfWorkersMainShift, float percentColdStorage,
                                       float percentHeated, float percentCooled) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setWeeklyOperatingHours(weeklyOperatingHours);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentColdStorage(percentColdStorage);
        setPercentHeated(percentHeated);
        setPercentCooled(percentCooled);
    }

    //Getters and Setters

    public int getWeeklyOperatingHours() {
        return weeklyOperatingHours;
    }

    public void setWeeklyOperatingHours(int weeklyOperatingHours) {
        this.weeklyOperatingHours = weeklyOperatingHours;
    }

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

    public float getPercentHeated() {
        return percentHeated;
    }

    public void setPercentHeated(float percentHeated) {
        this.percentHeated = percentHeated;
    }

    public float getPercentCooled() {
        return percentCooled;
    }

    public void setPercentCooled(float percentCooled) {
        this.percentCooled = percentCooled;
    }
}
