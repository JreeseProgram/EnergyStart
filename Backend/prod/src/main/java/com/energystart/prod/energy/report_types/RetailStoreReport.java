package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class RetailStoreReport extends EnergyReport {

    private boolean hasExteriorEntrance = false;
    private boolean isSingleStore = false;
    private int numOfOpenClosedFreezers;
    private int numWalkInFreezers;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;
    private int weeklyOperatingHours;

    //Constructors

    public RetailStoreReport() {}

    public RetailStoreReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                             boolean hasExteriorEntrance, boolean isSingleStore,
                             int numOfOpenClosedFreezers, int numWalkInFreezers, int numOfWorkersMainShift,
                             float percentCooled, float percentHeated, int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setHasExteriorEntrance(hasExteriorEntrance);
        setSingleStore(isSingleStore);
        setNumOfOpenClosedFreezers(numOfOpenClosedFreezers);
        setNumWalkInFreezers(numWalkInFreezers);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
        setWeeklyOperatingHours(weeklyOperatingHours);
    }

    //Getters and Setters

    public boolean isHasExteriorEntrance() {
        return hasExteriorEntrance;
    }

    public void setHasExteriorEntrance(boolean hasExteriorEntrance) {
        this.hasExteriorEntrance = hasExteriorEntrance;
    }

    public boolean isSingleStore() {
        return isSingleStore;
    }

    public void setSingleStore(boolean singleStore) {
        isSingleStore = singleStore;
    }

    public int getNumOfOpenClosedFreezers() {
        return numOfOpenClosedFreezers;
    }

    public void setNumOfOpenClosedFreezers(int numOfOpenClosedFreezers) {
        this.numOfOpenClosedFreezers = numOfOpenClosedFreezers;
    }

    public int getNumWalkInFreezers() {
        return numWalkInFreezers;
    }

    public void setNumWalkInFreezers(int numWalkInFreezers) {
        this.numWalkInFreezers = numWalkInFreezers;
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
