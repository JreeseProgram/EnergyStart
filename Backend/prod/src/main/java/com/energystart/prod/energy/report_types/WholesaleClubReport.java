package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.time.LocalDate;

public class WholesaleClubReport extends EnergyReport {

    private boolean hasExteriorEntrance = false;
    private boolean isSingleStore = false;
    private int numOfOpenClosedFreezers;
    private int numOfWalkInFreezers;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;
    private int weeklyOperatingHours;

    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

    //Constructors

    public WholesaleClubReport(){ };

    public WholesaleClubReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                               boolean hasExteriorEntrance, boolean isSingleStore,
                               int numOfOpenClosedFreezers, int numOfWalkInFreezers,
                               int numOfWorkersMainShift, float percentCooled, float percentHeated,
                               int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setHasExteriorEntrance(hasExteriorEntrance);
        setSingleStore(isSingleStore);
        setNumOfOpenClosedFreezers(numOfOpenClosedFreezers);
        setNumOfWalkInFreezers(numOfWalkInFreezers);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
        setWeeklyOperatingHours(weeklyOperatingHours);

    }

    //Custom Methods

    public float energyStarRegressionCalc(float cdd, float hdd) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 162.0f + 252.6f; //standard + supermarket specific added
        float squareFoot = this.getGrossFloorArea();
        float squareFootPerThousand = squareFoot / 1000;
        float weeklyOperatingHours = this.getWeeklyOperatingHours();
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float numCommercialFreezerPerThousandFt = this.getNumOfOpenClosedFreezers() / squareFootPerThousand;
        float cooled = cdd * this.getPercentCooled();
        float heated = hdd * this.getPercentHeated();

        predictedSourceEUI += (weeklyOperatingHours - 77.93f) * 1.222f;
        predictedSourceEUI += ((numWorkersPer1000ft - 0.8353f) * 39.28f)
                + ((numWorkersPer1000ft - 0.8353f) * 81.23f); //this is added d/t supermarket calcs being mixed with retail
        predictedSourceEUI += (numCommercialFreezerPerThousandFt - 0.2631f) * 56.88f;
        predictedSourceEUI += (cooled - 5.606f) * 5.698f;
        predictedSourceEUI += (heated - 6.911f) * 6.493f;

        return predictedSourceEUI * this.getGrossFloorArea();
    }

    //Setters and Getters

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

    public int getNumOfOpenClosedFreezers() {
        return numOfOpenClosedFreezers;
    }

    public void setNumOfOpenClosedFreezers(int numOfOpenClosedFreezers) {
        this.numOfOpenClosedFreezers = numOfOpenClosedFreezers;
    }

    public int getNumOfWalkInFreezers() {
        return numOfWalkInFreezers;
    }

    public void setNumOfWalkInFreezers(int numOfWalkInFreezers) {
        this.numOfWalkInFreezers = numOfWalkInFreezers;
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
