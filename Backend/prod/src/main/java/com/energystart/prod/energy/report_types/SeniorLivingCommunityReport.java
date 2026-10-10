package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.time.LocalDate;
import java.util.List;

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


    public float energyStarRegressionCalc(LocalDate startDate, LocalDate endDate) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 219.4f; //standard
        float squareFoot = this.getGrossFloorArea();
        float squareFootPerThousand = squareFoot / 1000;

        float numUnitsPerThousandFt = this.getNumOfResidentialUnits() / squareFootPerThousand;
        float percentCapacity = (float) this.getAvgNumResidents() / this.getMaxResidentCapacity();
        float numLiftsPerThousandFt = this.getNumOfResidentialLifts() / squareFootPerThousand;
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float numComputerPer1000ft = this.getNumOfComputers() / squareFootPerThousand;
        float numCommRefrigerationPerThousandFt = this.getNumCommercialFreezer() / squareFootPerThousand;
        float numCommWashingMachinePerThousandFt = this.getNumOfCommercialWashingMachines() / squareFootPerThousand;
        float numResidentWashingMachinePerThousandFt = this.getNumOfResidentialWashingMachines() / squareFootPerThousand;

        Property associatedProperty = repo.findById(this.getRelatedPropertyID()).orElse(null);
        Integer[] cddhdd = EnergyReport.retrieveCDDHDD(associatedProperty.getZipcode(), startDate, endDate);
        float cooled = cddhdd[0] * this.getPercentCooled();
        float heated = cddhdd[1] * this.getPercentHeated();

        if(numResidentWashingMachinePerThousandFt > 0.16f){numResidentWashingMachinePerThousandFt = 0.16f;}

        predictedSourceEUI += (numUnitsPerThousandFt - 1.582f) * 17.43f;
        predictedSourceEUI += (percentCapacity - 0.8761f) * 0.7962f;
        predictedSourceEUI += (numLiftsPerThousandFt - 0.06915f) * 253.9f;
        predictedSourceEUI += (numWorkersPer1000ft - 0.9370f) * 30.36f;
        predictedSourceEUI += (numComputerPer1000ft - 0.3636f) * 75.03f;
        predictedSourceEUI += (numCommRefrigerationPerThousandFt - 0.09045f) * 224.0f;
        predictedSourceEUI += (numCommWashingMachinePerThousandFt - 0.04317f) * 334.9f;
        predictedSourceEUI += (numResidentWashingMachinePerThousandFt - 0.05842f) * 207.6f;
        predictedSourceEUI += (cooled - 1184f) * 0.01456f;
        predictedSourceEUI += (heated - 4524f) * 0.005431f;

        //Energy Efficiency Ratio

        List<EnergyMeter> meters = meterRepo.findByAssociatedReportIDAndDateBetween(this.getID(), startDate, endDate);
        float sourceEUI = 0;
        for (EnergyMeter meter : meters) {
            sourceEUI += meter.getSourceEUI();
        }
        float EER = sourceEUI / predictedSourceEUI;
        float score = EnergyStarLookupTable.getScore(EER, this);
        setEnergyScore(score);
        return score;
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
