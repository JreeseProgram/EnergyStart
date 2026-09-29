package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class BankBranchReport extends EnergyReport {

    private int numOfWorkersMainShift;
    private int numOfComputers;
    private float percentCooled;
    private int weeklyOperatingHours;

    //Constructors

    public BankBranchReport() {}

    public BankBranchReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                            int numOfWorkersMainShift, int numOfComputers, float percentCooled,
                            int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);
        this.numOfWorkersMainShift = numOfWorkersMainShift;
        this.numOfComputers = numOfComputers;
        this.percentCooled = percentCooled;
        this.weeklyOperatingHours = weeklyOperatingHours;
    }

    //Getters and Setters

    public int getNumOfWorkersMainShift() {
        return numOfWorkersMainShift;
    }

    public void setNumOfWorkersMainShift(int numOfWorkersMainShift) {
        this.numOfWorkersMainShift = numOfWorkersMainShift;
    }

    public int getNumOfComputers() {
        return numOfComputers;
    }

    public void setNumOfComputers(int numOfComputers) {
        this.numOfComputers = numOfComputers;
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
