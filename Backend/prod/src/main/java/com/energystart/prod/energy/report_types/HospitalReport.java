package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class HospitalReport extends EnergyReport {

    private int numOfFullTimeWorkers;
    private int numOfMRIMachines;
    private int numOfStaffedBeds;

    //Constructors

    public HospitalReport() {}

    public HospitalReport(int grossFloorArea, int parkingSize, int yearOfConstruction, int numOfFullTimeWorkers,
                          int numOfMRIMachines, int numOfStaffedBeds) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setNumOfFullTimeWorkers(numOfFullTimeWorkers);
        setNumOfMRIMachines(numOfMRIMachines);
        setNumOfStaffedBeds(numOfStaffedBeds);
    }

    //Getters and Setters

    public int getNumOfFullTimeWorkers() {
        return numOfFullTimeWorkers;
    }

    public void setNumOfFullTimeWorkers(int numOfFullTimeWorkers) {
        this.numOfFullTimeWorkers = numOfFullTimeWorkers;
    }

    public int getNumOfMRIMachines() {
        return numOfMRIMachines;
    }

    public void setNumOfMRIMachines(int numOfMRIMachines) {
        this.numOfMRIMachines = numOfMRIMachines;
    }

    public int getNumOfStaffedBeds() {
        return numOfStaffedBeds;
    }

    public void setNumOfStaffedBeds(int numOfStaffedBeds) {
        this.numOfStaffedBeds = numOfStaffedBeds;
    }
}
