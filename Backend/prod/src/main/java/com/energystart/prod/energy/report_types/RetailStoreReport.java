package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.time.LocalDate;
import java.util.List;

public class RetailStoreReport extends EnergyReport {

    private boolean hasExteriorEntrance = false;
    private boolean isSingleStore = false;
    private int numOfOpenClosedFreezers;
    private int numWalkInFreezers;
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
                             int numOfOpenClosedFreezers, int numWalkInFreezers, int numOfWorkersMainShift,
                             float percentCooled, float percentHeated, int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setHasExteriorEntrance(hasExteriorEntrance);
        setSingleStore(isSingleStore);
        setNumOfOpenClosedFreezers(numOfOpenClosedFreezers);
        setNumWalkInFreezers(numWalkInFreezers);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
        setWeeklyOperatingHours(weeklyOperatingHours);
    }

    public float energyStarRegressionCalc(LocalDate startDate, LocalDate endDate) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 162.0f; //standard
        float squareFoot = this.getGrossFloorArea();
        float squareFootPerThousand = squareFoot / 1000;

        float weeklyOperatingHours = this.getWeeklyOperatingHours();
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float numCommercialFreezerPerThousandFt =
                (this.getNumOfOpenClosedFreezers() + this.getNumWalkInFreezers()) / squareFootPerThousand;

        Property associatedProperty = repo.findById(this.getRelatedPropertyID()).orElse(null);
        Integer[] cddhdd = EnergyReport.retrieveCDDHDD(associatedProperty.getZipcode(), startDate, endDate);
        float cooled = cddhdd[0] * this.getPercentCooled();
        float heated = cddhdd[1] * this.getPercentHeated();

        predictedSourceEUI += (weeklyOperatingHours - 77.93f) * 1.222f;
        predictedSourceEUI += (numWorkersPer1000ft - 0.8353f) * 39.28f;
        predictedSourceEUI += (numCommercialFreezerPerThousandFt - 0.2631f) * 56.88f;
        predictedSourceEUI += (cooled - 5.606f) * 5.698f;
        predictedSourceEUI += (heated - 6.911f) * 6.493f;

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

    public int getNumWalkInFreezers() {
        return numWalkInFreezers;
    }

    public void setNumWalkInFreezers(int numWalkInFreezers) {
        this.numWalkInFreezers = numWalkInFreezers;
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
