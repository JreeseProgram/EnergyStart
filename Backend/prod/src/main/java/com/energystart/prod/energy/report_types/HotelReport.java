package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.model.Property;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.PropertyRepo;

import java.time.LocalDate;
import java.util.List;

public class HotelReport extends EnergyReport {

    private boolean hasCookingFacilities = false;
    private int numCommercialFreezer;
    private int numOfRooms;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;

    private PropertyRepo repo;
    private EnergyMeterRepo meterRepo;

    //Constructors

    public HotelReport() {}

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

    public float energyStarRegressionCalc(LocalDate startDate, LocalDate endDate) {
        //Calculate predicted source EUI
        float predictedSourceEUI = 146.5f; //standard
        float squareFoot = this.getGrossFloorArea();
        float squareFootPerThousand = squareFoot / 1000;
        float numRoomsPerThousandFt = this.getNumOfRooms() / squareFootPerThousand;
        float numWorkersPer1000ft = this.getNumOfWorkersMainShift() / squareFootPerThousand;
        float numCommercialFreezerPerThousandFt = this.getNumCommercialFreezer() / squareFootPerThousand;
        float cookingFacilities = isHasCookingFacilities() ? 1.0f : 0.0f;

        Property associatedProperty = repo.findById(this.getRelatedPropertyID()).orElse(null);
        Integer[] cddhdd = EnergyReport.retrieveCDDHDD(Integer.parseInt(associatedProperty.getZipcode()), startDate, endDate);
        float cooled = cddhdd[0] * this.getPercentCooled();
        float heated = cddhdd[1] * this.getPercentHeated();


        if (numRoomsPerThousandFt < 3.0f){numRoomsPerThousandFt = 3.0f;}
        else if (numRoomsPerThousandFt > 4.0f) {numRoomsPerThousandFt = 4.0f;}

        predictedSourceEUI += (numRoomsPerThousandFt - 3.022f) * 103.7f;
        predictedSourceEUI += (numWorkersPer1000ft - 0.3359f) * 34.93f;
        predictedSourceEUI += (numCommercialFreezerPerThousandFt - 0.05219f) * 178.7f;
        predictedSourceEUI += cookingFacilities * 46.73f; //if no cooking, its 0 * 46.73, so no effect
        predictedSourceEUI += (cooled - 1722f) * 0.008473f;
        predictedSourceEUI += (heated - 2873f) * 0.006324f;

        //Energy Efficiency Ratio

        List<EnergyMeter> meters = meterRepo.findByAssociatedReportIDAndDateBetween(this.getID(), startDate, endDate);
        float sourceEUI = 0;
        for (EnergyMeter meter : meters) {
            sourceEUI += meter.getSourceEUI();
        }
        float EER = sourceEUI / predictedSourceEUI;
        float score = EnergyStarLookupTable.getScore(EER, this);
        setEnergyScore(score);
        return score;
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
