package com.energystart.prod;

public class EnergyReport {

    private long ID;
    private float areaOfWalkInFreezer;
    private int avgNumResidents;
    private int avgNumbVehiclesInInventory;
    //low-rise stories 1-4; mid-rise 5-9; high-rise 10+
    private enum BUILDING_HEIGHT_TYPES {
        lowRise("lowRise"),
        midRise("midRise"),
        highRise("highRise");

        private final String value;
        BUILDING_HEIGHT_TYPES(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    };
    private String buildingHeight;
    private long buildingID;
    private String BuildingType;
    private boolean doesWorkWeekend = false;
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
    private int weeklyOperatingHours;
    private int yearOfConstruction;

    //Default Constructor
    public EnergyReport() {}




}
