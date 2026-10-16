package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.time.LocalDate;
import java.util.List;

public class VehicleDealershipReport extends EnergyReport {

    private int avgNumVehiclesInInventory;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;

    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

    //Constructors

    public VehicleDealershipReport() { };

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
    public float energyStarRegressionCalc(LocalDate startDate, LocalDate endDate, float cdd, float hdd) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 147.2f; //standard
        float squareFoot = this.getGrossFloorArea();
        float squareFootPerThousand = squareFoot / 1000f;
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float numVehiclesPerThousandFt = this.getAvgNumVehiclesInInventory() / squareFootPerThousand;
        float cooled = cdd * this.getPercentCooled();
        float heated = hdd *  this.getPercentHeated();

        predictedSourceEUI += (numWorkersPer1000ft - 1.680f) * 25.04f;
        predictedSourceEUI += (numVehiclesPerThousandFt - 7.551f) * 2.628f;
        predictedSourceEUI += (cooled - 1557f) * 0.01039f;
        predictedSourceEUI += (heated - 3644f) * 0.003730f;

        return predictedSourceEUI * this.getGrossFloorArea();
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
