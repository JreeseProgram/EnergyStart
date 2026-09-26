package com.energystart.prod.Energy;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document
public class EnergyReport {

    @Id
    private long ID;
    private float areaOfWalkInFreezer;
    private int avgNumResidents;
    private int avgNumVehiclesInInventory;
    //low-rise stories 1-4; mid-rise 5-9; high-rise 10+
    protected enum BUILDING_HEIGHT_TYPES {
        lowRise,
        midRise,
        highRise
    };
    private String buildingHeight;
    private long buildingID;
    private BUILDING_HEIGHT_TYPES BuildingType;
    private boolean doesWorkWeekend = false;
    private LocalDate reportDate;
    private List<EnergyMeter> energyMeters;
    private float energyScore;
    private int grossFloorArea;
    private int grossFloorAreaForFoodPrep;
    private boolean hasCookingFacilities = false;
    private boolean isHighSchool = false;
    private boolean isSingleStore = false;
    private float lengthOfFreezerUnit;
    private int maxResidentCapacity;
    private int numberOfBuildings;
    private int numCommercialFreezer;
    private int numOfBedrooms;
    private int numOfCommercialWashingMachines;
    private int numOfComputers;
    private int numOfCookingEquipment;
    private int numOfFullTimeWorkers;
    private int numOfHeatingUnits;
    private int numOfMRIMachines;
    private int numOfOpenClosedFreezers;
    private int numOfResidentialLifts;
    private int numOfResidentialUnits;
    private int numOfResidentialWashingMachines;
    private int numOfRooms;
    private int numOfStaffedBeds;
    private int numOfSurgicalBeds;
    private int numOfWorkersMainShift;
    private int parkingSize;
    private float percentColdStorage;
    private float percentCooled;
    private float percentHeated;
    private int seatingCapacity;
    private float siteEnergyUseIntensity;
    private float sourceEnergyUseIntensity;
    private int weeklyOperatingHours;
    private int yearOfConstruction;

    //Default Constructor
    public EnergyReport() {}


    //Getters and Setters
    public long getID() {
        return ID;
    }

    public void setID(long ID) {
        this.ID = ID;
    }

    public float getAreaOfWalkInFreezer() {
        return areaOfWalkInFreezer;
    }

    public void setAreaOfWalkInFreezer(float areaOfWalkInFreezer) {
        this.areaOfWalkInFreezer = areaOfWalkInFreezer;
    }

    public int getAvgNumResidents() {
        return avgNumResidents;
    }

    public void setAvgNumResidents(int avgNumResidents) {
        this.avgNumResidents = avgNumResidents;
    }

    public int getAvgNumVehiclesInInventory() {
        return avgNumVehiclesInInventory;
    }

    public void setAvgNumbVehiclesInInventory(int avgNumbVehiclesInInventory) {
        this.avgNumVehiclesInInventory = avgNumbVehiclesInInventory;
    }

    public String getBuildingHeight() {
        return buildingHeight;
    }

    public void setBuildingHeight(String buildingHeight) {
        this.buildingHeight = buildingHeight;
    }

    public long getBuildingID() {
        return buildingID;
    }

    public void setBuildingID(long buildingID) {
        this.buildingID = buildingID;
    }

    protected BUILDING_HEIGHT_TYPES getBuildingType() {
        return BuildingType;
    }

    protected void setBuildingType(BUILDING_HEIGHT_TYPES buildingType) {
        BuildingType = buildingType;
    }

    public boolean isDoesWorkWeekend() {
        return doesWorkWeekend;
    }

    public void setDoesWorkWeekend(boolean doesWorkWeekend) {
        this.doesWorkWeekend = doesWorkWeekend;
    }

    public LocalDate getReportDate() {
        return reportDate;
    }

    public void setReportDate(LocalDate reportDate) {
        this.reportDate = reportDate;
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

    public void setEnergyScore(float energyScore) {
        this.energyScore = energyScore;
    }

    public int getGrossFloorArea() {
        return grossFloorArea;
    }

    public void setGrossFloorArea(int grossFloorArea) {
        this.grossFloorArea = grossFloorArea;
    }

    public int getGrossFloorAreaForFoodPrep() {
        return grossFloorAreaForFoodPrep;
    }

    public void setGrossFloorAreaForFoodPrep(int grossFloorAreaForFoodPrep) {
        this.grossFloorAreaForFoodPrep = grossFloorAreaForFoodPrep;
    }

    public boolean hasCookingFacilities() {
        return hasCookingFacilities;
    }

    public void setCookingFacilities(boolean hasCookingFacilities) {
        this.hasCookingFacilities = hasCookingFacilities;
    }

    public boolean isHighSchool() {
        return isHighSchool;
    }

    public void setHighSchool(boolean highSchool) {
        isHighSchool = highSchool;
    }

    public boolean isSingleStore() {
        return isSingleStore;
    }

    public void setSingleStore(boolean singleStore) {
        isSingleStore = singleStore;
    }

    public float getLengthOfFreezerUnit() {
        return lengthOfFreezerUnit;
    }

    public void setLengthOfFreezerUnit(float lengthOfFreezerUnit) {
        this.lengthOfFreezerUnit = lengthOfFreezerUnit;
    }

    public int getMaxResidentCapacity() {
        return maxResidentCapacity;
    }

    public void setMaxResidentCapacity(int maxResidentCapacity) {
        this.maxResidentCapacity = maxResidentCapacity;
    }

    public int getNumberOfBuildings() {
        return numberOfBuildings;
    }

    public void setNumberOfBuildings(int numberOfBuildings) {
        this.numberOfBuildings = numberOfBuildings;
    }

    public int getNumCommercialFreezer() {
        return numCommercialFreezer;
    }

    public void setNumCommercialFreezer(int numCommercialFreezer) {
        this.numCommercialFreezer = numCommercialFreezer;
    }

    public int getNumOfBedrooms() {
        return numOfBedrooms;
    }

    public void setNumOfBedrooms(int numOfBedrooms) {
        this.numOfBedrooms = numOfBedrooms;
    }

    public int getNumOfCommercialWashingMachines() {
        return numOfCommercialWashingMachines;
    }

    public void setNumOfCommercialWashingMachines(int numOfCommercialWashingMachines) {
        this.numOfCommercialWashingMachines = numOfCommercialWashingMachines;
    }

    public int getNumOfComputers() {
        return numOfComputers;
    }

    public void setNumOfComputers(int numOfComputers) {
        this.numOfComputers = numOfComputers;
    }

    public int getNumOfCookingEquipment() {
        return numOfCookingEquipment;
    }

    public void setNumOfCookingEquipment(int numOfCookingEquipment) {
        this.numOfCookingEquipment = numOfCookingEquipment;
    }

    public int getNumOfFullTimeWorkers() {
        return numOfFullTimeWorkers;
    }

    public void setNumOfFullTimeWorkers(int numOfFullTimeWorkers) {
        this.numOfFullTimeWorkers = numOfFullTimeWorkers;
    }

    public int getNumOfHeatingUnits() {
        return numOfHeatingUnits;
    }

    public void setNumOfHeatingUnits(int numOfHeatingUnits) {
        this.numOfHeatingUnits = numOfHeatingUnits;
    }

    public int getNumOfMRIMachines() {
        return numOfMRIMachines;
    }

    public void setNumOfMRIMachines(int numOfMRIMachines) {
        this.numOfMRIMachines = numOfMRIMachines;
    }

    public int getNumOfOpenClosedFreezers() {
        return numOfOpenClosedFreezers;
    }

    public void setNumOfOpenClosedFreezers(int numOfOpenClosedFreezers) {
        this.numOfOpenClosedFreezers = numOfOpenClosedFreezers;
    }

    public int getNumOfResidentialLifts() {
        return numOfResidentialLifts;
    }

    public void setNumOfResidentialLifts(int numOfResidentialLifts) {
        this.numOfResidentialLifts = numOfResidentialLifts;
    }

    public int getNumOfResidentialUnits() {
        return numOfResidentialUnits;
    }

    public void setNumOfResidentialUnits(int numOfResidentialUnits) {
        this.numOfResidentialUnits = numOfResidentialUnits;
    }

    public int getNumOfResidentialWashingMachines() {
        return numOfResidentialWashingMachines;
    }

    public void setNumOfResidentialWashingMachines(int numOfResidentialWashingMachines) {
        this.numOfResidentialWashingMachines = numOfResidentialWashingMachines;
    }

    public int getNumOfRooms() {
        return numOfRooms;
    }

    public void setNumOfRooms(int numOfRooms) {
        this.numOfRooms = numOfRooms;
    }

    public int getNumOfStaffedBeds() {
        return numOfStaffedBeds;
    }

    public void setNumOfStaffedBeds(int numOfStaffedBeds) {
        this.numOfStaffedBeds = numOfStaffedBeds;
    }

    public int getNumOfSurgicalBeds() {
        return numOfSurgicalBeds;
    }

    public void setNumOfSurgicalBeds(int numOfSurgicalBeds) {
        this.numOfSurgicalBeds = numOfSurgicalBeds;
    }

    public int getNumOfWorkersMainShift() {
        return numOfWorkersMainShift;
    }

    public void setNumOfWorkersMainShift(int numOfWorkersMainShift) {
        this.numOfWorkersMainShift = numOfWorkersMainShift;
    }

    public int getParkingSize() {
        return parkingSize;
    }

    public void setParkingSize(int parkingSize) {
        this.parkingSize = parkingSize;
    }

    public float getPercentColdStorage() {
        return percentColdStorage;
    }

    public void setPercentColdStorage(float percentColdStorage) {
        this.percentColdStorage = percentColdStorage;
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

    public int getSeatingCapacity() {
        return seatingCapacity;
    }

    public void setSeatingCapacity(int seatingCapacity) {
        this.seatingCapacity = seatingCapacity;
    }

    public float getSiteEnergyUseIntensity() {
        return siteEnergyUseIntensity;
    }

    public float getSourceEnergyUseIntensity() {
        return sourceEnergyUseIntensity;
    }

    public int getWeeklyOperatingHours() {
        return weeklyOperatingHours;
    }

    public void setWeeklyOperatingHours(int weeklyOperatingHours) {
        this.weeklyOperatingHours = weeklyOperatingHours;
    }

    public int getYearOfConstruction() {
        return yearOfConstruction;
    }

    public void setYearOfConstruction(int yearOfConstruction) {
        this.yearOfConstruction = yearOfConstruction;
    }
}
