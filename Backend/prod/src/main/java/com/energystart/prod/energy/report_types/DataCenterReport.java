package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

/**
 * This report is a child of Energy Report that focuses on data centers.
 * <p>
 *     Contains additional fields pertinent to its specific energy star score
 *     requirements and a customized regression calc.
 * </p>
 * <p>
 *     This calculates fundamentally differently. Instead of EUI (energy use intensity)
 *     it rather works around PUE (Power Usage Effectiveness) and requires an additional
 *     annualITEnergy to get its score
 * </p>
 */

public class DataCenterReport extends EnergyReport {

    private float annualITEnergy;


    //Constructors
    public DataCenterReport() {}

    /**
     * Typical Constructor for this object
     * @param grossFloorArea Total sqft of the use
     * @param parkingSize Total sqft of the Parking area
     * @param yearOfConstruction Year the building was made
     * @param annualITEnergy Annual electricity (in kwh) used by only the compute units
     */
    public DataCenterReport(int grossFloorArea, int parkingSize,
                            int yearOfConstruction, float annualITEnergy) {
        super(grossFloorArea, parkingSize, yearOfConstruction);
        setAnnualITEnergy(annualITEnergy);
    }

    /**
     * This gets the Predicted PUE (Power Usage Effectiveness) and converts it to predicted kBtu
     * @return Predicted kBtu as a float
     */
    public float energyStarRegressionCalc(){
        float predictedPUE = 1.924f;

        // 3.412 converts kwh to kbtu, 2.8 converts to source kBtu
        float sourceITUsage = getAnnualITEnergy() * 3.412f * 2.80f;

        predictedPUE += (Math.min((sourceITUsage / 1000000000f),0.4f) - 0.2091f) * (-0.9506f);

        //Fix FP Precision
        predictedPUE = Math.round(predictedPUE * 1000.0f) / 1000.0f;


        return predictedPUE * sourceITUsage; // converts this to predicted kBtu
    }

    //Setters and Getters
    public float getAnnualITEnergy() {
        return annualITEnergy;
    }

    public void setAnnualITEnergy(float annualITEnergy) {
        this.annualITEnergy = annualITEnergy;
    }
}
