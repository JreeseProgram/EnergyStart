package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class SeniorLivingCommunityReport extends EnergyReport {

    private int avgNumResidents;
    private int maxResidentCapacity;
    private int numOfComputers;
    private int numCommercialFreezer;
    private int numOfCommercialWashingMachines;
    private int numOfResidentialLifts;
    private int numOfResidentialUnits;
    private int numOfResidentialWashingMachines;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;

    //Constructors

    public SeniorLivingCommunityReport() {};

    public SeniorLivingCommunityReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                                       int avgNumResidents, int maxResidentCapacity, int numOfComputers,
                                       int numCommercialFreezer, int numOfCommercialWashingMachines,
                                       int numOfResidentialLifts, int numOfResidentialUnits,
                                       int numOfResidentialWashingMachines, int numOfWorkersMainShift,
                                       float percentCooled, float percentHeated) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setAvgNumResidents(avgNumResidents);
        setMaxResidentCapacity(maxResidentCapacity);
        setNumOfComputers(numOfComputers);
        setNumCommercialFreezer(numCommercialFreezer);
        setNumOfCommercialWashingMachines(numOfCommercialWashingMachines);
        setNumOfResidentialLifts(numOfResidentialLifts);
        setNumOfResidentialUnits(numOfResidentialUnits);
        setNumOfResidentialWashingMachines(numOfResidentialWashingMachines);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
    }

    //Getters and Setters

    public int getAvgNumResidents() {
        return avgNumResidents;
    }

    public void setAvgNumResidents(int avgNumResidents) {
        this.avgNumResidents = avgNumResidents;
    }

    public int getMaxResidentCapacity() {
        return maxResidentCapacity;
    }

    public void setMaxResidentCapacity(int maxResidentCapacity) {
        this.maxResidentCapacity = maxResidentCapacity;
    }

    public int getNumOfComputers() {
        return numOfComputers;
    }

    public void setNumOfComputers(int numOfComputers) {
        this.numOfComputers = numOfComputers;
    }

    public int getNumCommercialFreezer() {
        return numCommercialFreezer;
    }

    public void setNumCommercialFreezer(int numCommercialFreezer) {
        this.numCommercialFreezer = numCommercialFreezer;
    }

    public int getNumOfCommercialWashingMachines() {
        return numOfCommercialWashingMachines;
    }

    public void setNumOfCommercialWashingMachines(int numOfCommercialWashingMachines) {
        this.numOfCommercialWashingMachines = numOfCommercialWashingMachines;
    }

    public int getNumOfResidentialLifts() {
        return numOfResidentialLifts;
    }

    public void setNumOfResidentialLifts(int numOfResidentialLifts) {
        this.numOfResidentialLifts = numOfResidentialLifts;
    }

    public int getNumOfResidentialUnits() {
        return numOfResidentialUnits;
    }

    public void setNumOfResidentialUnits(int numOfResidentialUnits) {
        this.numOfResidentialUnits = numOfResidentialUnits;
    }

    public int getNumOfResidentialWashingMachines() {
        return numOfResidentialWashingMachines;
    }

    public void setNumOfResidentialWashingMachines(int numOfResidentialWashingMachines) {
        this.numOfResidentialWashingMachines = numOfResidentialWashingMachines;
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
