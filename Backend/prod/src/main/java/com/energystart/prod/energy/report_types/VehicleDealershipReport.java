package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

/**
 * This report is a child of Energy Report that focuses on Vehicle Dealerships.
 * <p>
 *     Contains additional fields pertinent to its specific energy star score
 *     requirements and a customized regression calc.
 * </p>
 */
public class VehicleDealershipReport extends EnergyReport {

    private int avgNumVehiclesInInventory;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;

    //Constructors

    public VehicleDealershipReport() { };

    /**
     * Typical constructor for this object
     * @param grossFloorArea Total Sqft of the use
     * @param parkingSize Total Sqft for parking
     * @param yearOfConstruction Year the building was made
     * @param avgNumVehiclesInInventory Typical amount of vehicles in the dealers inventory
     * @param numOfWorkersMainShift Total number of workers on the primary shift
     * @param percentCooled Percent of the building that is cooled
     * @param percentHeated Percent of the building that is heated
     */
    public VehicleDealershipReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                                   int avgNumVehiclesInInventory, int numOfWorkersMainShift,
                                   float percentCooled, float percentHeated) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setAvgNumVehiclesInInventory(avgNumVehiclesInInventory);
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
        float predictedSourceEUI = 147.2f; //standard
        float squareFoot = sqft;
        float squareFootPerThousand = squareFoot / 1000f;
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float numVehiclesPerThousandFt = this.getAvgNumVehiclesInInventory() / squareFootPerThousand;
        float cooled = cdd * this.getPercentCooled();
        float heated = hdd *  this.getPercentHeated();

        //FP Precision fix
        numWorkersPer1000ft = Math.round(numWorkersPer1000ft * 100.0f) / 100.0f;
        numVehiclesPerThousandFt = Math.round(numVehiclesPerThousandFt * 100.0f) / 100.0f;
        cooled = Math.round(cooled * 100.0f) / 100.0f;
        heated = Math.round(heated * 100.0f) / 100.0f;

        predictedSourceEUI += (numWorkersPer1000ft - 1.680f) * 25.04f;
        predictedSourceEUI += (numVehiclesPerThousandFt - 7.551f) * 2.628f;
        predictedSourceEUI += (cooled - 1557f) * 0.01039f;
        predictedSourceEUI += (heated - 3644f) * 0.003730f;

        return predictedSourceEUI * sqft;
    }

    //Setters and Getters

    public int getAvgNumVehiclesInInventory() {
        return avgNumVehiclesInInventory;
    }

    public void setAvgNumVehiclesInInventory(int avgNumVehiclesInInventory) {
        this.avgNumVehiclesInInventory = avgNumVehiclesInInventory;
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
