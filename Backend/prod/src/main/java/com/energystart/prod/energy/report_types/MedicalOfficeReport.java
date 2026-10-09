package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.time.LocalDate;
import java.util.List;

public class MedicalOfficeReport extends EnergyReport {

    private int numOfMRIMachines;
    private int numOfSurgicalBeds;
    private int numOfWorkersMainShift;
    private int weeklyOperatingHours;

    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

    //Constructors
    public MedicalOfficeReport() {}

    public MedicalOfficeReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                               int numOfMRIMachines, int numOfSurgicalBeds, int numOfWorkersMainShift,
                               int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setNumOfMRIMachines(numOfMRIMachines);
        setNumOfSurgicalBeds(numOfSurgicalBeds);
        setNumOfWorkersMainShift(numOfWorkersMainShift);
        setWeeklyOperatingHours(weeklyOperatingHours);
    }

    //Custom Methods

    public float energyStarRegressionCalc(LocalDate startDate, LocalDate endDate) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 250.9f; //standard
        float squareFoot = this.getGrossFloorArea();
        float squareFootPerThousand = squareFoot / 1000;

        float numMRIPerThousandFt = this.getNumOfMRIMachines()/squareFootPerThousand;
        float numBedsPerThousandFt = this.getNumOfSurgicalBeds()/squareFootPerThousand;
        float numWorkersPerThousandFt = this.getNumOfWorkersMainShift()/squareFootPerThousand;
        float weeklyHours = this.getWeeklyOperatingHours();

        Property associatedProperty = repo.findById(this.getRelatedPropertyID()).orElse(null);
        Integer[] cddhdd = EnergyReport.retrieveCDDHDD(Integer.parseInt(associatedProperty.getZipcode()), startDate, endDate);
        float cooled = cddhdd[0];
        float heated = cddhdd[1];

        if(squareFoot > 100000) {squareFoot = 100000;}

        predictedSourceEUI += (squareFoot - 84175f) * 0.0005471f;
        predictedSourceEUI += (numMRIPerThousandFt - 0.003156f) * 3469f;
        predictedSourceEUI += (numBedsPerThousandFt - 0.009331f) * 1536f;
        predictedSourceEUI += (numWorkersPerThousandFt - 2.080f) * 19.51f;
        predictedSourceEUI += (weeklyHours - 62.10f) * 0.5281f;
        predictedSourceEUI += (cooled - 1754f) * 0.01926f;
        predictedSourceEUI += (heated - 3983f) * 0.004240f;

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

    public int getNumOfMRIMachines() {
        return numOfMRIMachines;
    }

    public void setNumOfMRIMachines(int numOfMRIMachines) {
        this.numOfMRIMachines = numOfMRIMachines;
    }

    public int getNumOfSurgicalBeds() {
        return numOfSurgicalBeds;
    }

    public void setNumOfSurgicalBeds(int numOfSurgicalBeds) {
        this.numOfSurgicalBeds = numOfSurgicalBeds;
    }

    public int getNumOfWorkersMainShift() {
        return numOfWorkersMainShift;
    }

    public void setNumOfWorkersMainShift(int numOfWorkersMainShift) {
        this.numOfWorkersMainShift = numOfWorkersMainShift;
    }

    public int getWeeklyOperatingHours() {
        return weeklyOperatingHours;
    }

    public void setWeeklyOperatingHours(int weeklyOperatingHours) {
        this.weeklyOperatingHours = weeklyOperatingHours;
    }
}
