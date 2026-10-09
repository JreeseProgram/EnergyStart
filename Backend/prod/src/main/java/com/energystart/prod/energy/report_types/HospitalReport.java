package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.time.LocalDate;
import java.util.List;

public class HospitalReport extends EnergyReport {

    private int numOfFullTimeWorkers;
    private int numOfMRIMachines;
    private int numOfStaffedBeds;

    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

    //Constructors

    public HospitalReport() {}

    public HospitalReport(int grossFloorArea, int parkingSize, int yearOfConstruction, int numOfFullTimeWorkers,
                          int numOfMRIMachines, int numOfStaffedBeds) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setNumOfFullTimeWorkers(numOfFullTimeWorkers);
        setNumOfMRIMachines(numOfMRIMachines);
        setNumOfStaffedBeds(numOfStaffedBeds);
    }

    //Custom Methods

    public float energyStarRegressionCalc(LocalDate startDate, LocalDate endDate) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 433.6f; //standard
        float squareFoot = this.getGrossFloorArea();
        float squareFootPerThousand = squareFoot / 1000;
        float numWorkersPerThousandFt = this.getNumOfFullTimeWorkers()/squareFootPerThousand;
        float numBedsPerThousandFt = this.getNumOfStaffedBeds()/squareFootPerThousand;
        float numMRIPerThousandFt = this.getNumOfMRIMachines()/squareFootPerThousand;


        Property associatedProperty = repo.findById(this.getRelatedPropertyID()).orElse(null);
        Integer[] cddhdd = EnergyReport.retrieveCDDHDD(Integer.parseInt(associatedProperty.getZipcode()), startDate, endDate);
        float cooled = cddhdd[0];
        float heated = cddhdd[1];

        predictedSourceEUI += (numWorkersPerThousandFt - 2.534f) * 21.55f;
        predictedSourceEUI += (numBedsPerThousandFt - 0.4084f) * 106.1f;
        predictedSourceEUI += (numMRIPerThousandFt - 0.003221f) * 7673f;
        predictedSourceEUI += (cooled - 1569f) * 0.01825f;
        predictedSourceEUI += (heated - 3860f) * 0.001752f;

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

    public int getNumOfFullTimeWorkers() {
        return numOfFullTimeWorkers;
    }

    public void setNumOfFullTimeWorkers(int numOfFullTimeWorkers) {
        this.numOfFullTimeWorkers = numOfFullTimeWorkers;
    }

    public int getNumOfMRIMachines() {
        return numOfMRIMachines;
    }

    public void setNumOfMRIMachines(int numOfMRIMachines) {
        this.numOfMRIMachines = numOfMRIMachines;
    }

    public int getNumOfStaffedBeds() {
        return numOfStaffedBeds;
    }

    public void setNumOfStaffedBeds(int numOfStaffedBeds) {
        this.numOfStaffedBeds = numOfStaffedBeds;
    }
}
