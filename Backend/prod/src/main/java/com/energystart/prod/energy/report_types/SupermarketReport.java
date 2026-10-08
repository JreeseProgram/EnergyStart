package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.time.LocalDate;
import java.util.List;

public class SupermarketReport extends EnergyReport {

    private int numOfOpenClosedFreezers;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;
    private int weeklyOperatingHours;

    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

    //Constructors

    public SupermarketReport() {}

    public SupermarketReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                             int numOfOpenClosedFreezers, int numOfWorkersMainShift,
                             float percentCooled, float percentHeated, int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setNumOfOpenClosedFreezers(numOfOpenClosedFreezers);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
        setWeeklyOperatingHours(weeklyOperatingHours);
    }
    //Custom Methods
    public float energyStarRegressionCalc(LocalDate startDate, LocalDate endDate) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 162.0f + 252.6f; //standard + supermarket specific added
        float squareFoot = this.getGrossFloorArea();
        float squareFootPerThousand = squareFoot / 1000;

        float weeklyOperatingHours = this.getWeeklyOperatingHours();
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float numCommercialFreezerPerThousandFt = this.getNumOfOpenClosedFreezers() / squareFootPerThousand;

        Property associatedProperty = repo.findById(this.getRelatedPropertyID()).orElse(null);
        Integer[] cddhdd = EnergyReport.retrieveCDDHDD(Integer.parseInt(associatedProperty.getZipcode()), startDate, endDate);
        float cooled = cddhdd[0] * this.getPercentCooled();
        float heated = cddhdd[1] * this.getPercentHeated();

        predictedSourceEUI += (weeklyOperatingHours - 77.93f) * 1.222f;
        predictedSourceEUI += ((numWorkersPer1000ft - 0.8353f) * 39.28f)
                + ((numWorkersPer1000ft - 0.8353f) * 81.23f); //this is added d/t supermarket calcs being mixed with retail
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

    public int getNumOfOpenClosedFreezers() {
        return numOfOpenClosedFreezers;
    }

    public void setNumOfOpenClosedFreezers(int numOfOpenClosedFreezers) {
        this.numOfOpenClosedFreezers = numOfOpenClosedFreezers;
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
