package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class MultifamilyHousingReport extends EnergyReport {

    private BUILDING_HEIGHT_TYPES BuildingType;
    private int numOfBedrooms;
    private int numOfResidentialUnits;

    //Constructors

    public MultifamilyHousingReport() {}

    public MultifamilyHousingReport(int grossFloorArea, int parkingSize, int yearOfConstruction,
                                    BUILDING_HEIGHT_TYPES buildingType, int numOfBedrooms,
                                    int numOfResidentialUnits) {
        super(grossFloorArea, parkingSize, yearOfConstruction);

        setBuildingType(buildingType);
        setNumOfBedrooms(numOfBedrooms);
        setNumOfResidentialUnits(numOfResidentialUnits);
    }


    //Getters and Setters

    public BUILDING_HEIGHT_TYPES getBuildingType() {
        return BuildingType;
    }

    public void setBuildingType(BUILDING_HEIGHT_TYPES buildingType) {
        BuildingType = buildingType;
    }

    public int getNumOfBedrooms() {
        return numOfBedrooms;
    }

    public void setNumOfBedrooms(int numOfBedrooms) {
        this.numOfBedrooms = numOfBedrooms;
    }

    public int getNumOfResidentialUnits() {
        return numOfResidentialUnits;
    }

    public void setNumOfResidentialUnits(int numOfResidentialUnits) {
        this.numOfResidentialUnits = numOfResidentialUnits;
    }
}
