package com.energystart.prod.energy;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document
public class EnergyReport {

    @Id
    private long ID;
    //low-rise stories 1-4; mid-rise 5-9; high-rise 10+
    protected enum BUILDING_HEIGHT_TYPES {
        lowRise,
        midRise,
        highRise
    };
    private List<EnergyMeter> energyMeters;
    private float energyScore;
    private int grossFloorArea;
    private int parkingSize;
    private int yearOfConstruction;

    //Default Constructor
    public EnergyReport() {}


    //Getters and Setters
}
