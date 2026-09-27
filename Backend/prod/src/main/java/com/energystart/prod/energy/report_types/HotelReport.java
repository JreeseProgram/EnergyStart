package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class HotelReport extends EnergyReport {

    private boolean hasCookingFacilities = false;
    private int numCommercialFreezer;
    private int numOfRooms;
    private int numOfWorkersMainShift;
    private float percentCooled;
    private float percentHeated;

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
