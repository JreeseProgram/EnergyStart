package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

/**
 * This report is a child of Energy Report that focuses on Medical Offices.
 * <p>
 *     Contains additional fields pertinent to its specific energy star score
 *     requirements and a customized regression calc.
 * </p>
 */
public class MedicalOfficeReport extends EnergyReport {

    private int numOfMRIMachines;
    private int numOfSurgicalBeds;
    private int numOfWorkersMainShift;
    private int weeklyOperatingHours;

    //Constructors
    public MedicalOfficeReport() {}

    /**
     * Typical constructor for this object
     * @param grossFloorArea Total Sqft of the building use
     * @param parkingSize Total sqft of the parking
     * @param yearOfConstruction Year the building was made
     * @param numOfMRIMachines Total amount of MRI machines in the building use
     * @param numOfSurgicalBeds Total amount of surgical beds
     * @param numOfWorkersMainShift Total number of workers on the primary shift
     * @param weeklyOperatingHours Total number of operating hours in a week
     */
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
        float predictedSourceEUI = 250.9f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot / 1000;
        float numMRIPerThousandFt = this.getNumOfMRIMachines()/squareFootPerThousand;
        float numBedsPerThousandFt = this.getNumOfSurgicalBeds()/squareFootPerThousand;
        float numWorkersPerThousandFt = this.getNumOfWorkersMainShift()/squareFootPerThousand;
        float weeklyHours = this.getWeeklyOperatingHours();
        float cooled = cdd;
        float heated = hdd;

        if(squareFoot > 100000) {squareFoot = 100000;}

        //FP Precision Fix
        numMRIPerThousandFt = Math.round(numMRIPerThousandFt * 100.0f) / 100.0f;
        numBedsPerThousandFt = Math.round(numBedsPerThousandFt * 100.0f) / 100.0f;
        numWorkersPerThousandFt = Math.round(numWorkersPerThousandFt * 100.0f) / 100.0f;
        weeklyHours = Math.round(weeklyHours * 100.0f) / 100.0f;
        cooled = Math.round(cooled * 100.0f) / 100.0f;
        heated = Math.round(heated * 100.0f) / 100.0f;

        predictedSourceEUI += (squareFoot - 84175f) * 0.0005471f;
        predictedSourceEUI += (numMRIPerThousandFt - 0.003156f) * 3469f;
        predictedSourceEUI += (numBedsPerThousandFt - 0.009331f) * 1536f;
        predictedSourceEUI += (numWorkersPerThousandFt - 2.080f) * 19.51f;
        predictedSourceEUI += (weeklyHours - 62.10f) * 0.5281f;
        predictedSourceEUI += (cooled - 1754f) * 0.01926f;
        predictedSourceEUI += (heated - 3983f) * 0.004240f;

        return predictedSourceEUI * sqft;
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
