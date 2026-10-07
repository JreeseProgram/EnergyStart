package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;

public class BankBranchReport extends EnergyReport {

    private int numOfWorkersMainShift;
    private int numOfComputers;
    private float percentCooled;
    private int weeklyOperatingHours;
    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;
    //Constructors

    public BankBranchReport() {}

    public BankBranchReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                            int numOfWorkersMainShift, int numOfComputers, float percentCooled,
                            int weeklyOperatingHours) {
        super(grossFloorArea, parkingSize, yearOfConstruction);
        this.numOfWorkersMainShift = numOfWorkersMainShift;
        this.numOfComputers = numOfComputers;
        this.percentCooled = percentCooled;
        this.weeklyOperatingHours = weeklyOperatingHours;
    }

    //Custom Methods


    public float energyStarRegressionCalc(LocalDate startDate, LocalDate endDate) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 143.1f; //standard
        float squareFoot = this.getGrossFloorArea();
        float squareFootPerThousand = squareFoot/1000;
        float weeklyOperatingHours = this.getWeeklyOperatingHours();
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float numComputerPer1000ft = this.getNumOfComputers() / squareFootPerThousand;
        Property associatedProperty = repo.findById(this.getRelatedPropertyID()).orElse(null);
        Integer[] cddhdd = EnergyReport.retrieveCDDHDD(Integer.parseInt(associatedProperty.getZipcode()), startDate, endDate);
        float cooled = cddhdd[0] * this.getPercentCooled();
        float heated = cddhdd[1];

        if(squareFoot > 100000){squareFoot = 100000;}
        predictedSourceEUI += (squareFoot - 12342) * 0.0006768f;
        predictedSourceEUI += (weeklyOperatingHours - 54.09f) * 0.6130f;
        predictedSourceEUI += (numWorkersPer1000ft - 2.056f) * 15.90f;
        predictedSourceEUI += (numComputerPer1000ft - 3.028f) * 15.90f;
        predictedSourceEUI += (cooled - 6.332f) * 4.529f;
        predictedSourceEUI += (heated - 924f) * 0.004693f;

        //Energy Efficiency Ratio

        List<EnergyMeter> meters = meterRepo.findByAssociatedReportIDAndDateBetween(this.getID(),startDate,endDate);
        float sourceEUI = 0;
        for(EnergyMeter meter: meters){
            sourceEUI += meter.getSourceEUI();
        }
        float EER = sourceEUI / predictedSourceEUI;
        return EnergyStarLookupTable.getScore(EER, this);
    }

    //Getters and Setters

    public int getNumOfWorkersMainShift() {
        return numOfWorkersMainShift;
    }

    public void setNumOfWorkersMainShift(int numOfWorkersMainShift) {
        this.numOfWorkersMainShift = numOfWorkersMainShift;
    }

    public int getNumOfComputers() {
        return numOfComputers;
    }

    public void setNumOfComputers(int numOfComputers) {
        this.numOfComputers = numOfComputers;
    }

    public float getPercentCooled() {
        return percentCooled;
    }

    public void setPercentCooled(float percentCooled) {
        this.percentCooled = percentCooled;
    }

    public int getWeeklyOperatingHours() {
        return weeklyOperatingHours;
    }

    public void setWeeklyOperatingHours(int weeklyOperatingHours) {
        this.weeklyOperatingHours = weeklyOperatingHours;
    }
}
