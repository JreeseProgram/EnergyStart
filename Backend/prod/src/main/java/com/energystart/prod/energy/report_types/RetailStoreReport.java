package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

public class RetailStoreReport extends EnergyReport {

    private boolean hasExteriorEntrance = false;
    private boolean isSingleStore = false;
    private int numOfFreezers;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;
    private int weeklyOperatingHours;

    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

    //Constructors

    public RetailStoreReport() {}

    public RetailStoreReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                             boolean hasExteriorEntrance, boolean isSingleStore,
                             int numOfFreezers,  int numOfWorkersMainShift,
                             float percentCooled, float percentHeated, int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setHasExteriorEntrance(hasExteriorEntrance);
        setSingleStore(isSingleStore);
        setNumOfFreezers(numOfFreezers);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
        setWeeklyOperatingHours(weeklyOperatingHours);
    }

    public float energyStarRegressionCalc(float cdd, float hdd, int sqft) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 162.0f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot / 1000;
        float weeklyOperatingHours = this.getWeeklyOperatingHours();
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float numCommercialFreezerPerThousandFt = (this.getNumOfFreezers() / squareFootPerThousand);
        float cooled = (float) Math.log(cdd) * this.getPercentCooled();
        float heated = (float) Math.log (hdd) * this.getPercentHeated();

        //FP imprecision fix numWorkersPerThousandFt = Math.round(numWorkersPerThousandFt * 100.0f) / 100.0f;
        weeklyOperatingHours = Math.round(weeklyOperatingHours * 100.0f) / 100.0f;
        numWorkersPer1000ft = Math.round(numWorkersPer1000ft * 100.0f) / 100.0f;
        numCommercialFreezerPerThousandFt = Math.round(numCommercialFreezerPerThousandFt * 100.0f) / 100.0f;
        cooled = Math.round(cooled * 1000.0f) / 1000.0f;
        heated = Math.round(heated * 1000.0f) / 1000.0f;

        predictedSourceEUI += (weeklyOperatingHours - 77.93f) * 1.222f;
        predictedSourceEUI += (numWorkersPer1000ft - 0.8353f) * 39.28f;
        predictedSourceEUI += (numCommercialFreezerPerThousandFt - 0.2631f) * 56.88f;
        predictedSourceEUI += (cooled - 5.606f) * 5.698f;
        predictedSourceEUI += (heated - 6.911f) * 6.493f;

        return predictedSourceEUI * sqft;

    }

    //Getters and Setters

    public boolean isHasExteriorEntrance() {
        return hasExteriorEntrance;
    }

    public void setHasExteriorEntrance(boolean hasExteriorEntrance) {
        this.hasExteriorEntrance = hasExteriorEntrance;
    }

    public boolean isSingleStore() {
        return isSingleStore;
    }

    public void setSingleStore(boolean singleStore) {
        isSingleStore = singleStore;
    }

    public int getNumOfFreezers() {
        return numOfFreezers;
    }

    public void setNumOfFreezers(int numOfOpenClosedFreezers) {
        this.numOfFreezers = numOfOpenClosedFreezers;
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

    public int getWeeklyOperatingHours() {
        return weeklyOperatingHours;
    }

    public void setWeeklyOperatingHours(int weeklyOperatingHours) {
        this.weeklyOperatingHours = weeklyOperatingHours;
    }
}
