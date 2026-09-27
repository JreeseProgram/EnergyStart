package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class WholesaleClubReport extends EnergyReport {

    private boolean hasExteriorEntrance = false;
    private boolean isSingleStore = false;
    private int numOfOpenClosedFreezers;
    private int numOfWalkInFreezers;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;
    private int weeklyOperatingHours;

    //Constructors

    public WholesaleClubReport(){ };

    public WholesaleClubReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                               boolean hasExteriorEntrance, boolean isSingleStore,
                               int numOfOpenClosedFreezers, int numOfWalkInFreezers,
                               int numOfWorkersMainShift, float percentCooled, float percentHeated,
                               int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setHasExteriorEntrance(hasExteriorEntrance);
        setSingleStore(isSingleStore);
        setNumOfOpenClosedFreezers(numOfOpenClosedFreezers);
        setNumOfWalkInFreezers(numOfWalkInFreezers);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
        setWeeklyOperatingHours(weeklyOperatingHours);

    }

    //Setters and Getters

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

    public int getNumOfWalkInFreezers() {
        return numOfWalkInFreezers;
    }

    public void setNumOfWalkInFreezers(int numOfWalkInFreezers) {
        this.numOfWalkInFreezers = numOfWalkInFreezers;
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
