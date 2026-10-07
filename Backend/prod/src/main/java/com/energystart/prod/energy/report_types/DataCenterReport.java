package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.time.LocalDate;
import java.util.List;

public class DataCenterReport extends EnergyReport {

    private float annualITEnergy;
    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;


    //Constructors
    public DataCenterReport() {}

    public DataCenterReport(int grossFloorArea, int parkingSize,
                            int yearOfConstruction, float annualITEnergy) {
        super(grossFloorArea, parkingSize, yearOfConstruction);
        setAnnualITEnergy(annualITEnergy);
    }

    public float energyStarRegressionCalc(LocalDate startDate, LocalDate endDate){
        float predictedPUE = 1.924f;
        List<EnergyMeter> meters = meterRepo.findByAssociatedReportIDAndDateBetween(this.getID(),startDate,endDate);
        float sourceKBtu = 0;
        for(EnergyMeter meter: meters){
            //Keeps Multipliers but reverts floor area calculations
            sourceKBtu += meter.getSourceEUI() * this.getGrossFloorArea();
        }
        // 3.412 converts kwh to kbtu, 2.8 converts to source kBtu
        float sourceITUsage = getAnnualITEnergy() * 3.412f * 2.80f;
        float realPUE = sourceKBtu/sourceITUsage;
        predictedPUE += (realPUE - 0.2091f) * (-0.9506f);
        float EER = realPUE / predictedPUE;
        return EnergyStarLookupTable.getScore(EER, this);
    }

    //Setters and Getters
    public float getAnnualITEnergy() {
        return annualITEnergy;
    }

    public void setAnnualITEnergy(float annualITEnergy) {
        this.annualITEnergy = annualITEnergy;
    }
}
