package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class MedicalOfficeReport extends EnergyReport {

    private int numOfMRIMachines;
    private int numOfSurgicalBeds;
    private int numOfWorkersMainShift;
    private int weeklyOperatingHours;

    //Constructors
    public MedicalOfficeReport() {}

    public MedicalOfficeReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                               int numOfMRIMachines, int numOfSurgicalBeds, int numOfWorkersMainShift,
                               int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setNumOfMRIMachines(numOfMRIMachines);
        setNumOfSurgicalBeds(numOfSurgicalBeds);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setWeeklyOperatingHours(weeklyOperatingHours);
    }

    //Getters and Setters

    public int getNumOfMRIMachines() {
        return numOfMRIMachines;
    }

    public void setNumOfMRIMachines(int numOfMRIMachines) {
        this.numOfMRIMachines = numOfMRIMachines;
    }

    public int getNumOfSurgicalBeds() {
        return numOfSurgicalBeds;
    }

    public void setNumOfSurgicalBeds(int numOfSurgicalBeds) {
        this.numOfSurgicalBeds = numOfSurgicalBeds;
    }

    public int getNumOfWorkersMainShift() {
        return numOfWorkersMainShift;
    }

    public void setNumOfWorkersMainShift(int numOfWorkersMainShift) {
        this.numOfWorkersMainShift = numOfWorkersMainShift;
    }

    public int getWeeklyOperatingHours() {
        return weeklyOperatingHours;
    }

    public void setWeeklyOperatingHours(int weeklyOperatingHours) {
        this.weeklyOperatingHours = weeklyOperatingHours;
    }
}
