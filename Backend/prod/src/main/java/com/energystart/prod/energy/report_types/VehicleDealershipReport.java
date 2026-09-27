package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class VehicleDealershipReport extends EnergyReport {

    private int avgNumVehiclesInInventory;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;

    //Constructors

    public VehicleDealershipReport() { };

    public VehicleDealershipReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                                   int avgNumVehiclesInInventory, int numOfWorkersMainShift,
                                   float percentCooled, float percentHeated) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setAvgNumVehiclesInInventory(avgNumVehiclesInInventory);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
    }

    //Setters and Getters

    public int getAvgNumVehiclesInInventory() {
        return avgNumVehiclesInInventory;
    }

    public void setAvgNumVehiclesInInventory(int avgNumVehiclesInInventory) {
        this.avgNumVehiclesInInventory = avgNumVehiclesInInventory;
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
