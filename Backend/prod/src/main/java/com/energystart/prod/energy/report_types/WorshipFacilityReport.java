package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

/**
 * This report is a child of Energy Report that focuses on Worship Facilities.
 * <p>
 *     Contains additional fields pertinent to its specific energy star score
 *     requirements and a customized regression calc.
 * </p>
 */
public class WorshipFacilityReport extends EnergyReport {

    private int grossFloorAreaForFoodPrep;
    private float percentCooled;
    private float percentHeated;
    private int seatingCapacity;
    private int weeklyOperatingHours;

    //Constructors
    public WorshipFacilityReport(){ };

    /**
     * Typical constructor for this object
     * @param grossFloorArea Total Sqft of the use
     * @param parkingSize Total Sqft of parking
     * @param yearOfConstruction Year the building was made
     * @param grossFloorAreaForFoodPrep Total sqft used for the preparation of food
     * @param percentCooled Percent of the building that is cooled
     * @param percentHeated Percent of the building that is heated
     * @param seatingCapacity Total amount of seats available
     * @param weeklyOperatingHours Total operating hours in a week
     */
    public WorshipFacilityReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                                 int grossFloorAreaForFoodPrep, float percentCooled,
                                 float percentHeated, int seatingCapacity, int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);
        setGrossFloorAreaForFoodPrep(grossFloorAreaForFoodPrep);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
        setSeatingCapacity(seatingCapacity);
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
        float predictedSourceEUI = 68.24f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot / 1000;
        float weeklyOperatingHours = this.getWeeklyOperatingHours();
        float numSeatsPerThousandFt = this.getSeatingCapacity() / squareFootPerThousand;
        float percentAreaForFoodPrep = this.getGrossFloorAreaForFoodPrep() / squareFoot;
        float cooled = cdd * this.getPercentCooled();
        float heated = hdd * this.getPercentHeated();

        if(numSeatsPerThousandFt < 40){numSeatsPerThousandFt = 40f;}
        if(percentAreaForFoodPrep > 0.1){percentAreaForFoodPrep = 0.1f;}

        //Fix FP imprecision
        weeklyOperatingHours = Math.round(weeklyOperatingHours * 100.0f) / 100.0f;
        numSeatsPerThousandFt = Math.round(numSeatsPerThousandFt * 100.0f) / 100.0f;
        percentAreaForFoodPrep = Math.round(percentAreaForFoodPrep * 100000.0f) / 100000.0f;
        cooled = Math.round(cooled * 100.0f) / 100.0f;
        heated = Math.round(heated * 100.0f) / 100.0f;


        predictedSourceEUI += (weeklyOperatingHours - 26.49f) * 0.5107f;
        predictedSourceEUI += (numSeatsPerThousandFt - 47.84f) * 0.7336f;
        predictedSourceEUI += (percentAreaForFoodPrep - .004984f) * 291.9f;
        predictedSourceEUI += (cooled - 1471f) * 0.01249f;
        predictedSourceEUI += (heated - 3243f) * 0.004180f;

        return predictedSourceEUI * sqft;
    }


    //Getters and Setters

    public int getGrossFloorAreaForFoodPrep() {
        return grossFloorAreaForFoodPrep;
    }

    public void setGrossFloorAreaForFoodPrep(int grossFloorAreaForFoodPrep) {
        this.grossFloorAreaForFoodPrep = grossFloorAreaForFoodPrep;
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

    public int getSeatingCapacity() {
        return seatingCapacity;
    }

    public void setSeatingCapacity(int seatingCapacity) {
        this.seatingCapacity = seatingCapacity;
    }

    public int getWeeklyOperatingHours() {
        return weeklyOperatingHours;
    }

    public void setWeeklyOperatingHours(int weeklyOperatingHours) {
        this.weeklyOperatingHours = weeklyOperatingHours;
    }
}
