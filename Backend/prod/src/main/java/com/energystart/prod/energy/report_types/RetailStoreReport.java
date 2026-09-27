package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class RetailStoreReport extends EnergyReport {

    private int weeklyOperatingHours;
    private int numOfWorkersMainShift;
    private int numOfOpenClosedFreezers;
    private int numWalkInFreezers;
    private boolean isSingleStore = false;
    private boolean hasExteriorEntrance = false;
    private float percentHeated;
    private float percentCooled;



}
