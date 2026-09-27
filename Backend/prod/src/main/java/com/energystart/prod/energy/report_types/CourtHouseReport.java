package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class CourtHouseReport extends EnergyReport {

    private int numOfComputers;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private int weeklyOperatingHours;

    //Constructors

    public CourtHouseReport() {}

    public CourtHouseReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                            int numOfComputers, int numOfWorkersMainShift, float percentCooled,
                            int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setNumOfComputers(numOfComputers);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentCooled(percentCooled);
        setWeeklyOperatingHours(weeklyOperatingHours);
    }

    //Getters and Setters

    public int getNumOfComputers() {
        return numOfComputers;
    }

    public void setNumOfComputers(int numOfComputers) {
        this.numOfComputers = numOfComputers;
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

    public int getWeeklyOperatingHours() {
        return weeklyOperatingHours;
    }

    public void setWeeklyOperatingHours(int weeklyOperatingHours) {
        this.weeklyOperatingHours = weeklyOperatingHours;
    }
}
