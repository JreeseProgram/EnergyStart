package com.energystart.prod.energy;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document("EnergyReports")
public class EnergyReport {

    @Id
    private String ID;
    private String relatedPropertyID;
    //low-rise stories 1-4; mid-rise 5-9; high-rise 10+
    public enum BUILDING_HEIGHT_TYPES {
        lowRise,
        midRise,
        highRise
    };
    private List<EnergyMeter> energyMeters;
    private float energyScore;
    private int grossFloorArea;
    private int parkingSize;
    private int yearOfConstruction;

    //Constructors
    public EnergyReport() {}

    //NOTE: This is the main constructor for this class
    public EnergyReport(int grossFloorArea, int parkingSize, int yearOfConstruction) {
        setGrossFloorArea(grossFloorArea);
        setParkingSize(parkingSize);
        setYearOfConstruction(yearOfConstruction);
    }

    public EnergyReport(String ID, String relatedPropertyID, List<EnergyMeter> energyMeters, float energyScore,
                        int grossFloorArea, int parkingSize, int yearOfConstruction) {
        setID(ID);
        setRelatedPropertyID(relatedPropertyID);
        setEnergyMeters(energyMeters);
        setEnergyScore(energyScore);
        setGrossFloorArea(grossFloorArea);
        setParkingSize(parkingSize);
        setYearOfConstruction(yearOfConstruction);
    }

    //Custom Methods

    public void addEnergyMeter(EnergyMeter newMeter){
        energyMeters.add(newMeter);
    }

    //TODO: Calculate Energy Star Score
    public float calcEnergyScore() {
        return -1f;
    }

    //Getters and Setters


    public String getID() {
        return ID;
    }

    public void setID(String ID) {
        this.ID = ID;
    }

    public String getRelatedPropertyID() {
        return relatedPropertyID;
    }

    public void setRelatedPropertyID(String relatedPropertyID) {
        this.relatedPropertyID = relatedPropertyID;
    }

    public List<EnergyMeter> getEnergyMeters() {
        return energyMeters;
    }

    public void setEnergyMeters(List<EnergyMeter> energyMeters) {
        this.energyMeters = energyMeters;
    }

    public float getEnergyScore() {
        return energyScore;
    }
        //TODO: see if this is necessary since its calculated
    public void setEnergyScore(float energyScore) {
        this.energyScore = energyScore;
    }

    public int getGrossFloorArea() {
        return grossFloorArea;
    }

    public void setGrossFloorArea(int grossFloorArea) {
        this.grossFloorArea = grossFloorArea;
    }

    public int getParkingSize() {
        return parkingSize;
    }

    public void setParkingSize(int parkingSize) {
        this.parkingSize = parkingSize;
    }

    public int getYearOfConstruction() {
        return yearOfConstruction;
    }

    public void setYearOfConstruction(int yearOfConstruction) {
        this.yearOfConstruction = yearOfConstruction;
    }
}
