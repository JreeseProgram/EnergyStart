package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

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

    public float energyStarRegressionCalc(float cdd, float hdd, int sqft) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 433.6f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot / 1000;
        float numWorkersPerThousandFt = this.getNumOfFullTimeWorkers()/squareFootPerThousand;
        float numBedsPerThousandFt = this.getNumOfStaffedBeds()/squareFootPerThousand;
        float numMRIPerThousandFt = this.getNumOfMRIMachines()/squareFootPerThousand;
        float cooled = cdd;
        float heated = hdd;

        //FP Precision Fix
        numWorkersPerThousandFt = Math.round(numWorkersPerThousandFt * 100.0f) / 100.0f;
        numBedsPerThousandFt = Math.round(numBedsPerThousandFt * 100.0f) / 100.0f;
        numMRIPerThousandFt = Math.round(numMRIPerThousandFt * 100.0f) / 100.0f;
        cooled = Math.round(cooled * 100.0f) / 100.0f;
        heated = Math.round(heated * 100.0f) / 100.0f;

        predictedSourceEUI += (numWorkersPerThousandFt - 2.534f) * 21.55f;
        predictedSourceEUI += (numBedsPerThousandFt - 0.4084f) * 106.1f;
        predictedSourceEUI += (numMRIPerThousandFt - 0.003221f) * 7673f;
        predictedSourceEUI += (cooled - 1569f) * 0.01825f;
        predictedSourceEUI += (heated - 3860f) * 0.001752f;

        return predictedSourceEUI * sqft;
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
