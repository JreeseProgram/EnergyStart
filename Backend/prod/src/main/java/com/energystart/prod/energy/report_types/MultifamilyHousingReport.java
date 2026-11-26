package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

/**
 * This report is a child of Energy Report that focuses on Multifamily Housing.
 * <p>
 *     Contains additional fields pertinent to its specific energy star score
 *     requirements and a customized regression calc.
 * </p>
 */
public class MultifamilyHousingReport extends EnergyReport {

    private int lowRiseUnits; //1-4 stories
    private int midRiseUnits; //5-9 stories
    private int highRiseUnits; //10+ stories
    private int numOfBedrooms;
    private int numOfResidentialUnits;

    //Constructors

    public MultifamilyHousingReport() {}

    /**
     * Typical constructor for this object
     * @param grossFloorArea Total Sqft of this object
     * @param parkingSize Total sqft of parking
     * @param yearOfConstruction Year the building was made
     * @param lowRiseUnits Total amount of low rise units (1-4 stories)
     * @param midRiseUnits Total amount of mid rise units (5-9 stories)
     * @param highRiseUnits Total amount of high rise unites (10+ stories)
     * @param numOfBedrooms Total number of bedrooms
     * @param numOfResidentialUnits Total number of residential units
     */
    public MultifamilyHousingReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                                    int lowRiseUnits, int midRiseUnits, int highRiseUnits, int numOfBedrooms,
                                    int numOfResidentialUnits) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setLowRiseUnits(lowRiseUnits);
        setMidRiseUnits(midRiseUnits);
        setHighRiseUnits(highRiseUnits);
        setNumOfBedrooms(numOfBedrooms);
        setNumOfResidentialUnits(numOfResidentialUnits);
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
        float predictedSourceEUI = 130.7f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot / 1000;
        float unitsPerThousandFt = this.getNumOfResidentialUnits() / squareFootPerThousand;
        float bedroomsPerUnit = (float) this.getNumOfBedrooms() / this.getNumOfResidentialUnits();
        float lowRisePercent = (float) this.getLowRiseUnits()
                / (float) (this.getLowRiseUnits() + this.getMidRiseUnits() + this.getHighRiseUnits());
        float cooled = cdd;
        float heated = hdd;

        //FP Precision Fix Math.round(numWorkersPerThousandFt * 100.0f) / 100.0f;
        unitsPerThousandFt = Math.round(unitsPerThousandFt * 100.0f) / 100.0f;
        bedroomsPerUnit = Math.round(bedroomsPerUnit * 100.0f) / 100.0f;
        lowRisePercent = Math.round(lowRisePercent * 100.0f) / 100.0f;
        cooled = Math.round(cooled * 100.0f) / 100.0f;
        heated = Math.round(heated * 100.0f) / 100.0f;

        predictedSourceEUI += (unitsPerThousandFt - 1.215f) * 48.01f;
        predictedSourceEUI += (bedroomsPerUnit - 1.238f) * 22.64f;
        predictedSourceEUI += lowRisePercent * -19.00f;
        predictedSourceEUI += (cooled - 1364f) * 0.01406f;
        predictedSourceEUI += (heated - 4233f) * 0.008989f;

        return predictedSourceEUI * sqft;
    }


    //Getters and Setters


    public int getLowRiseUnits() {
        return lowRiseUnits;
    }

    public void setLowRiseUnits(int lowRiseUnits) {
        this.lowRiseUnits = lowRiseUnits;
    }

    public int getMidRiseUnits() {
        return midRiseUnits;
    }

    public void setMidRiseUnits(int midRiseUnits) {
        this.midRiseUnits = midRiseUnits;
    }

    public int getHighRiseUnits() {
        return highRiseUnits;
    }

    public void setHighRiseUnits(int highRiseUnits) {
        this.highRiseUnits = highRiseUnits;
    }

    public int getNumOfBedrooms() {
        return numOfBedrooms;
    }

    public void setNumOfBedrooms(int numOfBedrooms) {
        this.numOfBedrooms = numOfBedrooms;
    }

    public int getNumOfResidentialUnits() {
        return numOfResidentialUnits;
    }

    public void setNumOfResidentialUnits(int numOfResidentialUnits) {
        this.numOfResidentialUnits = numOfResidentialUnits;
    }
}
