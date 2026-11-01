package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;


public class WarehouseReport extends EnergyReport {

    private int numOfWorkersMainShift;
    private float percentColdStorage;
    private float percentCooled;
    private float percentHeated;
    private int weeklyOperatingHours;

    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

    //Constructors
    public WarehouseReport(){ };

    public WarehouseReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                           int numOfWorkersMainShift, float percentColdStorage,
                           float percentCooled, float percentHeated, int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentColdStorage(percentColdStorage);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
        setWeeklyOperatingHours(weeklyOperatingHours);
    }

    //Custom Methods

    public float energyStarRegressionCalc(float cdd, float hdd, int sqft) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 69.62f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot/1000;
        float weeklyOperatingHours = this.getWeeklyOperatingHours();
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float percentColdStorage = this.getPercentColdStorage();
        float cooled = cdd * (this.getPercentCooled()+ percentColdStorage);
        float heated = hdd * this.getPercentHeated();

        //FP imprecision fix:
        weeklyOperatingHours = Math.round(weeklyOperatingHours * 100.0f) / 100.0f;
        numWorkersPer1000ft = Math.round(numWorkersPer1000ft * 100.0f) / 100.0f;
        percentColdStorage = Math.round(percentColdStorage * 100.0f) / 100.0f;
        cooled = Math.round(cooled * 100.0f) / 100.0f;
        heated = Math.round(heated * 100.0f) / 100.0f;

        predictedSourceEUI += (weeklyOperatingHours - 59.25f) * 0.1943f;
        predictedSourceEUI += (numWorkersPer1000ft - 0.8502f) * 25.83f;
        predictedSourceEUI += (percentColdStorage - 0.007669f) * 239.3f;
        predictedSourceEUI += (cooled - 552.1f) * 0.01209f;
        predictedSourceEUI += (heated - 1602f) * 0.009370f;

        return predictedSourceEUI * sqft;
    }

    //Getters and Setters

    public int getNumOfWorkersMainShift() {
        return numOfWorkersMainShift;
    }

    public void setNumOfWorkersMainShift(int numOfWorkersMainShift) {
        this.numOfWorkersMainShift = numOfWorkersMainShift;
    }

    public float getPercentColdStorage() {
        return percentColdStorage;
    }

    public void setPercentColdStorage(float percentColdStorage) {
        this.percentColdStorage = percentColdStorage;
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

    public int getWeeklyOperatingHours() {
        return weeklyOperatingHours;
    }

    public void setWeeklyOperatingHours(int weeklyOperatingHours) {
        this.weeklyOperatingHours = weeklyOperatingHours;
    }
}
