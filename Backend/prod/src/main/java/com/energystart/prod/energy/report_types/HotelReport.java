package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;
/**
 * This report is a child of Energy Report that focuses on Hotels.
 * <p>
 *     Contains additional fields pertinent to its specific energy star score
 *     requirements and a customized regression calc.
 * </p>
 */

public class HotelReport extends EnergyReport {

    private boolean hasCookingFacilities = false;
    private int numCommercialFreezer;
    private int numOfRooms;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;

    //Constructors

    public HotelReport() {}

    /**
     * Typical constructor for this object
     * @param grossFloorArea Total sqft of the building use
     * @param parkingSize Total amount of sqft dedicated to parking
     * @param yearOfConstruction Year the building was made
     * @param hasCookingFacilities Flag if the building use has at least one cooking facility
     * @param numCommercialFreezer Total number of commercial freezers
     * @param numOfRooms Total number of rooms in the building use
     * @param numOfWorkersMainShift Total number of workers on the Primary Shift
     * @param percentCooled Percent of the building that is cooled
     * @param percentHeated Percent of the building that is heated
     */
    public HotelReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                       boolean hasCookingFacilities, int numCommercialFreezer, int numOfRooms,
                       int numOfWorkersMainShift, float percentCooled, float percentHeated) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setHasCookingFacilities(hasCookingFacilities);
        setNumCommercialFreezer(numCommercialFreezer);
        setNumOfRooms(numOfRooms);
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
        float predictedSourceEUI = 146.5f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot / 1000;
        float numRoomsPerThousandFt = this.getNumOfRooms() / squareFootPerThousand;
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float numCommercialFreezerPerThousandFt = this.getNumCommercialFreezer() / squareFootPerThousand;
        float cookingFacilities = isHasCookingFacilities() ? 1.0f : 0.0f;
        float cooled = cdd * this.getPercentCooled();
        float heated = hdd * this.getPercentHeated();


        if (numRoomsPerThousandFt < 3.0f){numRoomsPerThousandFt = 3.0f;}
        else if (numRoomsPerThousandFt > 4.0f) {numRoomsPerThousandFt = 4.0f;}

        //FP Precision fix Math.round(numWorkersPerThousandFt * 100.0f) / 100.0f;
        numRoomsPerThousandFt = Math.round(numRoomsPerThousandFt * 100.0f) / 100.0f;
        numWorkersPer1000ft = Math.round(numWorkersPer1000ft * 100.0f) / 100.0f;
        numCommercialFreezerPerThousandFt = Math.round(numCommercialFreezerPerThousandFt * 100.0f) / 100.0f;
        cooled = Math.round(cooled * 100.0f) / 100.0f;
        heated = Math.round(heated * 100.0f) / 100.0f;

        predictedSourceEUI += (numRoomsPerThousandFt - 3.022f) * 103.7f;
        predictedSourceEUI += (numWorkersPer1000ft - 0.3359f) * 34.93f;
        predictedSourceEUI += (numCommercialFreezerPerThousandFt - 0.05219f) * 178.7f;
        predictedSourceEUI += cookingFacilities * 46.73f; //if no cooking, its 0 * 46.73, so no effect
        predictedSourceEUI += (cooled - 1722f) * 0.008473f;
        predictedSourceEUI += (heated - 2873f) * 0.006324f;

        return predictedSourceEUI * sqft;
    }

    //Getters and Setters

    public boolean isHasCookingFacilities() {
        return hasCookingFacilities;
    }

    public void setHasCookingFacilities(boolean hasCookingFacilities) {
        this.hasCookingFacilities = hasCookingFacilities;
    }

    public int getNumCommercialFreezer() {
        return numCommercialFreezer;
    }

    public void setNumCommercialFreezer(int numCommercialFreezer) {
        this.numCommercialFreezer = numCommercialFreezer;
    }

    public int getNumOfRooms() {
        return numOfRooms;
    }

    public void setNumOfRooms(int numOfRooms) {
        this.numOfRooms = numOfRooms;
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
