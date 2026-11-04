package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.util.List;

public class DataCenterReport extends EnergyReport {

    private float annualITEnergy;


    //Constructors
    public DataCenterReport() {}

    public DataCenterReport(int grossFloorArea, int parkingSize,
                            int yearOfConstruction, float annualITEnergy) {
        super(grossFloorArea, parkingSize, yearOfConstruction);
        setAnnualITEnergy(annualITEnergy);
    }

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
