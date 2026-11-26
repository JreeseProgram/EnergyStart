package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

/**
 * This report is a child of Energy Report that focuses on Hospitals.
 * <p>
 *     Contains additional fields pertinent to its specific energy star score
 *     requirements and a customized regression calc.
 * </p>
 */

public class HospitalReport extends EnergyReport {

    private int numOfFullTimeWorkers;
    private int numOfMRIMachines;
    private int numOfStaffedBeds;

    //Constructors

    public HospitalReport() {}

    /**
     * Typical constructor of this object
     * @param grossFloorArea Total Sqft of the building use
     * @param parkingSize Total Sqft of parking
     * @param yearOfConstruction Year the building was built
     * @param numOfFullTimeWorkers Total number of full time equivalent workers
     * @param numOfMRIMachines Total amount of MRI machines present
     * @param numOfStaffedBeds Number of beds that are staffed
     */
    public HospitalReport(int grossFloorArea, int parkingSize, int yearOfConstruction, int numOfFullTimeWorkers,
                          int numOfMRIMachines, int numOfStaffedBeds) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setNumOfFullTimeWorkers(numOfFullTimeWorkers);
        setNumOfMRIMachines(numOfMRIMachines);
        setNumOfStaffedBeds(numOfStaffedBeds);
    }

    //Custom Methods

    /**
     * This takes cooling degree days, heating degree days, and the total SqFt of the use
     * to calculate the Estimated Building EUI, then converts itself back to Source kBtu instead of EUI
     * to simplify the EER calculations
     * @param cdd Cooling Degree Days
     * @param hdd Heating Degree Days
     * @param sqft Total Square foot
     * @return Predicted kBtu as float
     */
    public float energyStarRegressionCalc(float cdd, float hdd, int sqft) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 433.6f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot / 1000f;
        float numWorkersPerThousandFt = this.getNumOfFullTimeWorkers()/squareFootPerThousand;
        float numBedsPerThousandFt = this.getNumOfStaffedBeds()/squareFootPerThousand;
        float numMRIPerThousandFt = (float) this.getNumOfMRIMachines()/squareFootPerThousand;
        float cooled = cdd;
        float heated = hdd;

        //FP Precision Fix
        numWorkersPerThousandFt = Math.round(numWorkersPerThousandFt * 100.0f) / 100.0f;
        numBedsPerThousandFt = Math.round(numBedsPerThousandFt * 100.0f) / 100.0f;
        numMRIPerThousandFt = Math.round(numMRIPerThousandFt * 100000.0f) / 100000.0f;
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
