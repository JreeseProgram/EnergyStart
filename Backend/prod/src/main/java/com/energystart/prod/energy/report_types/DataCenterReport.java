package com.energystart.prod.energy.report_types;

import com.energystart.prod.energy.EnergyReport;

public class DataCenterReport extends EnergyReport {
    //Constructors
    public DataCenterReport() {}

    public DataCenterReport(int grossFloorArea, int parkingSize, int yearOfConstruction) {
        super(grossFloorArea, parkingSize, yearOfConstruction);
    }
}
