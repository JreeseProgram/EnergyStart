package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class SchoolReport extends EnergyReport {

    private boolean doesWorkWeekend = false;
    private boolean hasCookingFacilities = false;
    private boolean isHighSchool = false;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;

    //Constructors
    public SchoolReport() {};

    public SchoolReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                        boolean doesWorkWeekend, boolean hasCookingFacilities,
                        boolean isHighSchool, int numOfWorkersMainShift, float percentCooled,
                        float percentHeated) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setDoesWorkWeekend(doesWorkWeekend);
        setHasCookingFacilities(hasCookingFacilities);
        setHighSchool(isHighSchool);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
    }

    //Getters and Setters

    public boolean isDoesWorkWeekend() {
        return doesWorkWeekend;
    }

    public void setDoesWorkWeekend(boolean doesWorkWeekend) {
        this.doesWorkWeekend = doesWorkWeekend;
    }

    public boolean isHasCookingFacilities() {
        return hasCookingFacilities;
    }

    public void setHasCookingFacilities(boolean hasCookingFacilities) {
        this.hasCookingFacilities = hasCookingFacilities;
    }

    public boolean isHighSchool() {
        return isHighSchool;
    }

    public void setHighSchool(boolean highSchool) {
        isHighSchool = highSchool;
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
}
