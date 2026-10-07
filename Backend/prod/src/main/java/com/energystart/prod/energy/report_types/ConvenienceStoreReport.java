package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.time.LocalDate;
import java.util.List;

public class ConvenienceStoreReport extends EnergyReport {

    private float areaOfWalkInFreezer;
    private float lengthOfFreezerUnit;
    private int numOfCookingEquipment;
    private int numOfFullTimeWorkers;
    private int numOfHeatingUnits;
    private float percentCooled;
    private float percentHeated;
    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

    //Constructors

    public ConvenienceStoreReport() {}

    public ConvenienceStoreReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                                  float areaOfWalkInFreezer, float lengthOfFreezerUnit,
                                  int numOfCookingEquipment, int numOfFullTimeWorkers,
                                  int numOfHeatingUnits, float percentCooled, float percentHeated) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setAreaOfWalkInFreezer(areaOfWalkInFreezer);
        setLengthOfFreezerUnit(lengthOfFreezerUnit);
        setNumOfCookingEquipment(numOfCookingEquipment);
        setNumOfFullTimeWorkers(numOfFullTimeWorkers);
        setNumOfHeatingUnits(numOfHeatingUnits);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
    }
    // Custom Methods
    public float energyStarRegressionCalc(LocalDate startDate, LocalDate endDate) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 938.5f; //standard
        float squareFoot = this.getGrossFloorArea();
        float squareFootPerThousand = squareFoot/1000;
        float numWorkersPerThousandFt = this.getNumOfFullTimeWorkers()/squareFootPerThousand;
        float numCookingPerThousandFt = this.getNumOfCookingEquipment()/squareFootPerThousand;
        float numHeatingPerThousandFt = this.getNumOfHeatingUnits()/squareFootPerThousand;
        float lenOpenCloseFreezerPerThousandFt = this.getLengthOfFreezerUnit()/squareFootPerThousand;
        float percentWalkinFreezer = this.getAreaOfWalkInFreezer()/squareFoot;
        Property associatedProperty = repo.findById(this.getRelatedPropertyID()).orElse(null);
        Integer[] cddhdd = EnergyReport.retrieveCDDHDD(Integer.parseInt(associatedProperty.getZipcode()), startDate, endDate);
        float cooled = cddhdd[0] * this.getPercentCooled();
        float heated = cddhdd[1] * this.getPercentHeated();

        predictedSourceEUI += (numWorkersPerThousandFt - 2.843f) * 66.65f;
        predictedSourceEUI += (numCookingPerThousandFt - 0.6083f) * 243.6f;
        predictedSourceEUI += (numHeatingPerThousandFt - 0.8391f) * 300.4f;
        predictedSourceEUI += (lenOpenCloseFreezerPerThousandFt - 14.04f) * 19.14f;
        predictedSourceEUI += (percentWalkinFreezer - 0.1214f) * 1002f;
        predictedSourceEUI += (cooled - 1177f) * 0.05873f;
        predictedSourceEUI += (heated - 5765f) * 0.02592f;

        //Energy Efficiency Ratio
        List<EnergyMeter> meters = meterRepo.findByAssociatedReportIDAndDateBetween(this.getID(),startDate,endDate);
        float sourceEUI = 0;
        for(EnergyMeter meter: meters){
            sourceEUI += meter.getSourceEUI();
        }
        float EER = sourceEUI / predictedSourceEUI;
        return EnergyStarLookupTable.getScore(EER, this);
    }

    //Getters and Setters

    public float getAreaOfWalkInFreezer() {
        return areaOfWalkInFreezer;
    }

    public void setAreaOfWalkInFreezer(float areaOfWalkInFreezer) {
        this.areaOfWalkInFreezer = areaOfWalkInFreezer;
    }

    public float getLengthOfFreezerUnit() {
        return lengthOfFreezerUnit;
    }

    public void setLengthOfFreezerUnit(float lengthOfFreezerUnit) {
        this.lengthOfFreezerUnit = lengthOfFreezerUnit;
    }

    public int getNumOfCookingEquipment() {
        return numOfCookingEquipment;
    }

    public void setNumOfCookingEquipment(int numOfCookingEquipment) {
        this.numOfCookingEquipment = numOfCookingEquipment;
    }

    public int getNumOfFullTimeWorkers() {
        return numOfFullTimeWorkers;
    }

    public void setNumOfFullTimeWorkers(int numOfFullTimeWorkers) {
        this.numOfFullTimeWorkers = numOfFullTimeWorkers;
    }

    public int getNumOfHeatingUnits() {
        return numOfHeatingUnits;
    }

    public void setNumOfHeatingUnits(int numOfHeatingUnits) {
        this.numOfHeatingUnits = numOfHeatingUnits;
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
