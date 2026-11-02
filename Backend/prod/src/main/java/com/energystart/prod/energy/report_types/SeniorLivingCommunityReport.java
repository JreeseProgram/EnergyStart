package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

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

    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

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

    //Custom Methods


    public float energyStarRegressionCalc(float cdd, float hdd, int sqft) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 219.4f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot / 1000;
        float numUnitsPerThousandFt = this.getNumOfResidentialUnits() / squareFootPerThousand;
        float percentCapacity = (float) this.getAvgNumResidents() / this.getMaxResidentCapacity();
        float numLiftsPerThousandFt = this.getNumOfResidentialLifts() / squareFootPerThousand;
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float numComputerPer1000ft = this.getNumOfComputers() / squareFootPerThousand;
        float numCommRefrigerationPerThousandFt = this.getNumCommercialFreezer() / squareFootPerThousand;
        float numCommWashingMachinePerThousandFt = this.getNumOfCommercialWashingMachines() / squareFootPerThousand;
        float numResidentWashingMachinePerThousandFt = this.getNumOfResidentialWashingMachines() / squareFootPerThousand;
        float cooled = cdd * this.getPercentCooled();
        float heated = hdd * this.getPercentHeated();

        if(numResidentWashingMachinePerThousandFt > 0.16f){numResidentWashingMachinePerThousandFt = 0.16f;}

        //FP precision fix
        numUnitsPerThousandFt = Math.round(numUnitsPerThousandFt * 1000.0f) / 1000.0f;
        percentCapacity = Math.round(percentCapacity * 10000.0f) / 10000.0f;
        numLiftsPerThousandFt = Math.round(numLiftsPerThousandFt * 100000.0f) / 100000.0f;
        numWorkersPer1000ft = Math.round(numWorkersPer1000ft * 1000.0f) / 1000.0f;
        numComputerPer1000ft = Math.round(numComputerPer1000ft * 10000.0f) / 10000.0f;
        numCommRefrigerationPerThousandFt = Math.round(numCommRefrigerationPerThousandFt * 10000.0f) / 10000.0f;
        numCommWashingMachinePerThousandFt = Math.round(numCommWashingMachinePerThousandFt * 100000.0f) / 100000.0f;
        numResidentWashingMachinePerThousandFt = Math.round(numResidentWashingMachinePerThousandFt * 100.0f) / 100.0f;
        cooled = Math.round(cooled * 100.0f) / 100.0f;
        heated = Math.round(heated * 100.0f) / 100.0f;


        predictedSourceEUI += (numUnitsPerThousandFt - 1.582f) * 17.43f;
        predictedSourceEUI += ((percentCapacity * 100) - 87.61f) * 0.7962f;
        predictedSourceEUI += (numLiftsPerThousandFt - 0.06915f) * 253.9f;
        predictedSourceEUI += (numWorkersPer1000ft - 0.9370f) * 30.36f;
        predictedSourceEUI += (numComputerPer1000ft - 0.3636f) * 75.03f;
        predictedSourceEUI += (numCommRefrigerationPerThousandFt - 0.09045f) * 224.0f;
        predictedSourceEUI += (numCommWashingMachinePerThousandFt - 0.04317f) * 334.9f;
        predictedSourceEUI += (numResidentWashingMachinePerThousandFt - 0.05842f) * 207.6f;
        predictedSourceEUI += (cooled - 1184f) * 0.01456f;
        predictedSourceEUI += (heated - 4524f) * 0.005431f;

        return predictedSourceEUI * sqft;
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
