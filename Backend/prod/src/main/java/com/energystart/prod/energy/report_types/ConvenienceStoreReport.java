package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

/**
 * This report is a child of Energy Report that focuses on Convenience Stores.
 * <p>
 *     Contains additional fields pertinent to its specific energy star score
 *     requirements and a customized regression calc.
 * </p>
 */

public class ConvenienceStoreReport extends EnergyReport {

    private float areaOfWalkInFreezer;
    private float lengthOfFreezerUnit;
    private int numOfCookingEquipment;
    private int numOfFullTimeWorkers;
    private int numOfHeatingUnits;
    private float percentCooled;
    private float percentHeated;

    //Constructors

    public ConvenienceStoreReport() {}

    /**
     * This is the standard constructor for this object
     * @param grossFloorArea Total sqFt for this use
     * @param parkingSize Total area used for parking size
     * @param yearOfConstruction What year it was built
     * @param areaOfWalkInFreezer Total area of walk in freezers
     * @param lengthOfFreezerUnit Length in feet of freezer units
     * @param numOfCookingEquipment Total number of cooking equipment
     * @param numOfFullTimeWorkers Total number of full time workers
     * @param numOfHeatingUnits Total number of heating units
     * @param percentCooled Percent of the building that is cooled
     * @param percentHeated Percent of the building that is heated
     */
    public ConvenienceStoreReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                                  float areaOfWalkInFreezer, float lengthOfFreezerUnit,
                                  int numOfCookingEquipment, int numOfFullTimeWorkers,
                                  int numOfHeatingUnits, float percentCooled, float percentHeated) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setAreaOfWalkInFreezer(areaOfWalkInFreezer);
        setLengthOfFreezerUnit(lengthOfFreezerUnit);
        setNumOfCookingEquipment(numOfCookingEquipment);
        setNumOfFullTimeWorkers(numOfFullTimeWorkers);
        setNumOfHeatingUnits(numOfHeatingUnits);
        setPercentCooled(percentCooled);
        setPercentHeated(percentHeated);
    }
    // Custom Methods
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
        float predictedSourceEUI = 938.5f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot/1000.0f;
        float numWorkersPerThousandFt = this.getNumOfFullTimeWorkers()/squareFootPerThousand;
        float numCookingPerThousandFt = this.getNumOfCookingEquipment()/squareFootPerThousand;
        float numHeatingPerThousandFt = this.getNumOfHeatingUnits()/squareFootPerThousand;
        float lenOpenCloseFreezerPerThousandFt = this.getLengthOfFreezerUnit()/squareFootPerThousand;
        float percentWalkinFreezer = this.getAreaOfWalkInFreezer()/squareFoot;
        float cooled = cdd * this.getPercentCooled();
        float heated = hdd * this.getPercentHeated();

        //Fix FP imprecision
        numWorkersPerThousandFt = Math.round(numWorkersPerThousandFt * 100.0f) / 100.0f;
        numCookingPerThousandFt = Math.round(numCookingPerThousandFt * 100.0f) / 100.0f;
        numHeatingPerThousandFt = Math.round(numHeatingPerThousandFt * 100.0f) / 100.0f;
        lenOpenCloseFreezerPerThousandFt = Math.round(lenOpenCloseFreezerPerThousandFt * 100.0f) / 100.0f;
        percentWalkinFreezer = Math.round(percentWalkinFreezer * 100.0f) / 100.0f;
        cooled = Math.round(cooled * 100.0f) / 100.0f;
        heated = Math.round(heated * 100.0f) / 100.0f;

        predictedSourceEUI += (numWorkersPerThousandFt - 2.843f) * 66.65f;
        predictedSourceEUI += (numCookingPerThousandFt - 0.6083f) * 243.6f;
        predictedSourceEUI += (numHeatingPerThousandFt - 0.8391f) * 300.4f;
        predictedSourceEUI += (lenOpenCloseFreezerPerThousandFt - 14.04f) * 19.14f;
        predictedSourceEUI += (percentWalkinFreezer - 0.1214f) * 1002f;
        predictedSourceEUI += (cooled - 1177f) * 0.05873f;
        predictedSourceEUI += (heated - 5765f) * 0.02592f;


        return predictedSourceEUI * sqft;
    }

    //Getters and Setters

    public float getAreaOfWalkInFreezer() {
        return areaOfWalkInFreezer;
    }

    public void setAreaOfWalkInFreezer(float areaOfWalkInFreezer) {
        this.areaOfWalkInFreezer = areaOfWalkInFreezer;
    }

    public float getLengthOfFreezerUnit() {
        return lengthOfFreezerUnit;
    }

    public void setLengthOfFreezerUnit(float lengthOfFreezerUnit) {
        this.lengthOfFreezerUnit = lengthOfFreezerUnit;
    }

    public int getNumOfCookingEquipment() {
        return numOfCookingEquipment;
    }

    public void setNumOfCookingEquipment(int numOfCookingEquipment) {
        this.numOfCookingEquipment = numOfCookingEquipment;
    }

    public int getNumOfFullTimeWorkers() {
        return numOfFullTimeWorkers;
    }

    public void setNumOfFullTimeWorkers(int numOfFullTimeWorkers) {
        this.numOfFullTimeWorkers = numOfFullTimeWorkers;
    }

    public int getNumOfHeatingUnits() {
        return numOfHeatingUnits;
    }

    public void setNumOfHeatingUnits(int numOfHeatingUnits) {
        this.numOfHeatingUnits = numOfHeatingUnits;
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
