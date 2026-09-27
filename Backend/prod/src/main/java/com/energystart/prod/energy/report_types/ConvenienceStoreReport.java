package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class ConvenienceStoreReport extends EnergyReport {

    private float areaOfWalkInFreezer;
    private float lengthOfFreezerUnit;
    private int numOfCookingEquipment;
    private int numOfFullTimeWorkers;
    private int numOfHeatingUnits;
    private float percentCooled;
    private float percentHeated;

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
