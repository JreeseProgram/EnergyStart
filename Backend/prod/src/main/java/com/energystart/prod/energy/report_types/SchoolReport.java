package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.time.LocalDate;
import java.util.List;

public class SchoolReport extends EnergyReport {

    private boolean doesWorkWeekend = false;
    private boolean hasCookingFacilities = false;
    private boolean isHighSchool = false;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;

    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

    //Constructors
    public SchoolReport() {};

    public SchoolReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                        boolean doesWorkWeekend, boolean hasCookingFacilities,
                        boolean isHighSchool, int numOfWorkersMainShift, float percentCooled,
                        float percentHeated) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setDoesWorkWeekend(doesWorkWeekend);
        setHasCookingFacilities(hasCookingFacilities);
        setHighSchool(isHighSchool);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
    }
    //Custom Methods

    public float energyStarRegressionCalc(LocalDate startDate, LocalDate endDate) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 101.7f; //standard
        float squareFoot = this.getGrossFloorArea();
        float squareFootPerThousand = squareFoot / 1000;

        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float hasCooking = (this.isHasCookingFacilities()) ? 8.182f : 0.0f;
        float openWeekend = (this.isDoesWorkWeekend()) ? 15.66f : 0.0f;
        float isHighSchool = (this.isHighSchool()) ? 14.08f : 0.0f;


        Property associatedProperty = repo.findById(this.getRelatedPropertyID()).orElse(null);
        Integer[] cddhdd = EnergyReport.retrieveCDDHDD(associatedProperty.getZipcode(), startDate, endDate);
        float cooled = cddhdd[0] * this.getPercentCooled();
        float heated = cddhdd[1] * this.getPercentHeated();


        predictedSourceEUI += (numWorkersPer1000ft - 0.7967f) * 25.61f;
        predictedSourceEUI += hasCooking;
        predictedSourceEUI += isHighSchool;
        predictedSourceEUI += openWeekend;
        predictedSourceEUI += (cooled - 1472f) * 0.02059f;
        predictedSourceEUI += (heated - 3597f) * 0.008370f;

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

    public boolean isDoesWorkWeekend() {
        return doesWorkWeekend;
    }

    public void setDoesWorkWeekend(boolean doesWorkWeekend) {
        this.doesWorkWeekend = doesWorkWeekend;
    }

    public boolean isHasCookingFacilities() {
        return hasCookingFacilities;
    }

    public void setHasCookingFacilities(boolean hasCookingFacilities) {
        this.hasCookingFacilities = hasCookingFacilities;
    }

    public boolean isHighSchool() {
        return isHighSchool;
    }

    public void setHighSchool(boolean highSchool) {
        isHighSchool = highSchool;
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
