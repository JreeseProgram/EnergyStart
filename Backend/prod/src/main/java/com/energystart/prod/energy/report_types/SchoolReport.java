package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

/**
 * This report is a child of Energy Report that focuses on Schools.
 * <p>
 *     Contains additional fields pertinent to its specific energy star score
 *     requirements and a customized regression calc.
 * </p>
 */
public class SchoolReport extends EnergyReport {

    private boolean doesWorkWeekend = false;
    private boolean hasCookingFacilities = false;
    private boolean isHighSchool = false;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;

    //Constructors
    public SchoolReport() {};

    /**
     * This is the typical constructor for this object
     * @param grossFloorArea Total Sqft of the building use
     * @param parkingSize Total Sqft of parking
     * @param yearOfConstruction Year the building was made
     * @param doesWorkWeekend Flag indicating if the school operates on the weekends
     * @param hasCookingFacilities Flag indicating if the school has facilities to cook
     * @param isHighSchool Flag indicating if it's a high school
     * @param numOfWorkersMainShift Total amount of workers on the primary shift
     * @param percentCooled Percent of the building that is cooled
     * @param percentHeated Percent of the building that is heated
     */
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
        float predictedSourceEUI = 101.7f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot / 1000;
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float hasCooking = (this.isHasCookingFacilities()) ? 8.182f : 0.0f;
        float openWeekend = (this.isDoesWorkWeekend()) ? 15.66f : 0.0f;
        float isHighSchool = (this.isHighSchool()) ? 14.08f : 0.0f;
        float cooled = cdd * this.getPercentCooled();
        float heated = hdd * this.getPercentHeated();

        //FP Precision fix
        numWorkersPer1000ft = Math.round(numWorkersPer1000ft * 100.0f) / 100.0f;
        cooled = Math.round(cooled * 100.0f) / 100.0f;
        heated = Math.round(heated * 100.0f) / 100.0f;


        predictedSourceEUI += (numWorkersPer1000ft - 0.7967f) * 25.61f;
        predictedSourceEUI += hasCooking;
        predictedSourceEUI += isHighSchool;
        predictedSourceEUI += openWeekend;
        predictedSourceEUI += (cooled - 1472f) * 0.02059f;
        predictedSourceEUI += (heated - 3597f) * 0.008370f;

        return  predictedSourceEUI * sqft;
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
