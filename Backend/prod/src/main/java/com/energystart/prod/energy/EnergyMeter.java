package com.energystart.prod.energy;

import com.energystart.prod.energy.report_types.BankBranchReport;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.Map;

@Document
public class EnergyMeter {
    public enum TYPE_OF_METER {
        ELECTRIC_GRID,
        ELECTRIC_SOLAR,
        ELECTRIC_WIND,
        FUEL_OIL_1,
        FUEL_OIL_2,
        FUEL_OIL_4,
        FUEL_OIL_5_AND_6,
        NATURAL_GAS,
        PROPANE,
        DIESEL,
        DISTRICT_STEAM,
        DISTRICT_HOT_WATER,
        DISTRICT_CHILLED_WATER,
        COAL_ANTHRACITE,
        COAL_BITUMINOUS,
        COKE,
        WOOD,
        KEROSENE
    }
    public enum TYPE_OF_MEASURE{
        kWh, //Thousand wh
        MWh, //Million wh
        kBtu, //Thousand Btu
        MBtu, //Million Btu
        GJ,
        cf, //cubic feet
        Ccf, //hundred cubic feet
        Kcf, //thousand cubic feet
        Mcf, //million cubic feet
        Therms,
        cubic_meters,
        US_Gallons,
        UK_Gallons,
        Liters,
        Lbs,
        kLbs, //Thousand Pounds
        MLbs, //Million Pounds
        kg,
        Ton_Hours,
        Tons, //Imperial Ton
        Tonnes //Metric Ton
    }

    @Id
    private String ID;
    private String associatedReportID;
    private LocalDate date;
    private String meterID;
    private TYPE_OF_METER meterSelected;
    private TYPE_OF_MEASURE unitOfMeasure;
    private boolean inUse;
    private boolean isDelivered;
    private float meterKBtu;
    private float rawUse;
    private float siteEUI;
    private float sourceEUI;


    //This is used to calculate
    private record key(TYPE_OF_METER a, TYPE_OF_MEASURE b) {}
    private final Map<key, Float> kBtuMultipliers = Map.ofEntries(
            //Electric Grid
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_GRID,
                    TYPE_OF_MEASURE.kBtu
            ),
            1.0f),
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_GRID,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_GRID,
                    TYPE_OF_MEASURE.kWh
            ),
            3.412f),
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_GRID,
                    TYPE_OF_MEASURE.MWh
            ),
            3412f),
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_GRID,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            // ELECTRIC SOLAR
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_SOLAR,
                    TYPE_OF_MEASURE.kBtu
            ),
            1.0f),
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_SOLAR,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_SOLAR,
                    TYPE_OF_MEASURE.kWh
            ),
            3.412f),
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_SOLAR,
                    TYPE_OF_MEASURE.MWh
            ),
            3412f),
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_SOLAR,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            // ELECTRIC WIND
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_WIND,
                    TYPE_OF_MEASURE.kBtu
            ),
            1.0f),
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_WIND,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_WIND,
                    TYPE_OF_MEASURE.kWh
            ),
            3.412f),
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_WIND,
                    TYPE_OF_MEASURE.MWh
            ),
            3412f),
            Map.entry(new key(
                    TYPE_OF_METER.ELECTRIC_WIND,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //Natural Gas
            Map.entry(new key(
                    TYPE_OF_METER.NATURAL_GAS,
                    TYPE_OF_MEASURE.kBtu
            ),
            1.0f),
            Map.entry(new key(
                    TYPE_OF_METER.NATURAL_GAS,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.NATURAL_GAS,
                    TYPE_OF_MEASURE.cf
            ),
            1.026f),
            Map.entry(new key(
                    TYPE_OF_METER.NATURAL_GAS,
                    TYPE_OF_MEASURE.Ccf
            ),
            102.6f),
            Map.entry(new key(
                    TYPE_OF_METER.NATURAL_GAS,
                    TYPE_OF_MEASURE.Kcf
            ),
            1026f),
            Map.entry(new key(
                    TYPE_OF_METER.NATURAL_GAS,
                    TYPE_OF_MEASURE.Mcf
            ),
            1026000f),
            Map.entry(new key(
                    TYPE_OF_METER.NATURAL_GAS,
                    TYPE_OF_MEASURE.Therms
            ),
            100f),
            Map.entry(new key(
                    TYPE_OF_METER.NATURAL_GAS,
                    TYPE_OF_MEASURE.cubic_meters
            ),
            36.303f),
            Map.entry(new key(
                    TYPE_OF_METER.NATURAL_GAS,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //Fuel Oil 1
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_1,
                    TYPE_OF_MEASURE.kBtu
            ),
            1f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_1,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_1,
                    TYPE_OF_MEASURE.US_Gallons
            ),
            139f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_1,
                    TYPE_OF_MEASURE.UK_Gallons
            ),
            166.927f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_1,
                    TYPE_OF_MEASURE.Liters
            ),
            36.720f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_1,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //Fuel Oil 2
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_2,
                    TYPE_OF_MEASURE.kBtu
            ),
            1f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_2,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_2,
                    TYPE_OF_MEASURE.US_Gallons
            ),
            138f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_2,
                    TYPE_OF_MEASURE.UK_Gallons
            ),
            165.726f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_2,
                    TYPE_OF_MEASURE.Liters
            ),
            36.456f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_2,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //Fuel Oil 4
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_4,
                    TYPE_OF_MEASURE.kBtu
            ),
            1f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_4,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_4,
                    TYPE_OF_MEASURE.US_Gallons
            ),
            146f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_4,
                    TYPE_OF_MEASURE.UK_Gallons
            ),
            175.333f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_4,
                    TYPE_OF_MEASURE.Liters
            ),
            38.569f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_4,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //Fuel Oil 5/6
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_5_AND_6,
                    TYPE_OF_MEASURE.kBtu
            ),
            1f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_5_AND_6,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_5_AND_6,
                    TYPE_OF_MEASURE.US_Gallons
            ),
            150f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_5_AND_6,
                    TYPE_OF_MEASURE.UK_Gallons
            ),
            180.137f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_5_AND_6,
                    TYPE_OF_MEASURE.Liters
            ),
            39.626f),
            Map.entry(new key(
                    TYPE_OF_METER.FUEL_OIL_5_AND_6,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //Diesel
            Map.entry(new key(
                    TYPE_OF_METER.DIESEL,
                    TYPE_OF_MEASURE.kBtu
            ),
            1f),
            Map.entry(new key(
                    TYPE_OF_METER.DIESEL,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.DIESEL,
                    TYPE_OF_MEASURE.US_Gallons
            ),
            138f),
            Map.entry(new key(
                    TYPE_OF_METER.DIESEL,
                    TYPE_OF_MEASURE.UK_Gallons
            ),
            165.726f),
            Map.entry(new key(
                    TYPE_OF_METER.DIESEL,
                    TYPE_OF_MEASURE.Liters
            ),
            36.456f),
            Map.entry(new key(
                    TYPE_OF_METER.DIESEL,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //Kerosene
            Map.entry(new key(
                    TYPE_OF_METER.KEROSENE,
                    TYPE_OF_MEASURE.kBtu
            ),
            1f),
            Map.entry(new key(
                    TYPE_OF_METER.KEROSENE,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.KEROSENE,
                    TYPE_OF_MEASURE.US_Gallons
            ),
            135f),
            Map.entry(new key(
                    TYPE_OF_METER.KEROSENE,
                    TYPE_OF_MEASURE.UK_Gallons
            ),
            162.123f),
            Map.entry(new key(
                    TYPE_OF_METER.KEROSENE,
                    TYPE_OF_MEASURE.Liters
            ),
            35.663f),
            Map.entry(new key(
                    TYPE_OF_METER.KEROSENE,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //Propane
            Map.entry(new key(
                    TYPE_OF_METER.PROPANE,
                    TYPE_OF_MEASURE.kBtu
            ),
            1f),
            Map.entry(new key(
                    TYPE_OF_METER.PROPANE,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.PROPANE,
                    TYPE_OF_MEASURE.cf
            ),
            2.516f),
            Map.entry(new key(
                    TYPE_OF_METER.PROPANE,
                    TYPE_OF_MEASURE.Ccf
            ),
            251.6f),
            Map.entry(new key(
                    TYPE_OF_METER.PROPANE,
                    TYPE_OF_MEASURE.Kcf
            ),
            2516f),
            Map.entry(new key(
                    TYPE_OF_METER.PROPANE,
                    TYPE_OF_MEASURE.US_Gallons
            ),
            92f),
            Map.entry(new key(
                    TYPE_OF_METER.PROPANE,
                    TYPE_OF_MEASURE.UK_Gallons
            ),
            110.484f),
            Map.entry(new key(
                    TYPE_OF_METER.PROPANE,
                    TYPE_OF_MEASURE.Liters
            ),
            24.304f),
            Map.entry(new key(
                    TYPE_OF_METER.PROPANE,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //District Steam
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_STEAM,
                    TYPE_OF_MEASURE.kBtu
            ),
            1.0f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_STEAM,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_STEAM,
                    TYPE_OF_MEASURE.Lbs
            ),
            1.194f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_STEAM,
                    TYPE_OF_MEASURE.kLbs
            ),
            1194f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_STEAM,
                    TYPE_OF_MEASURE.MLbs
            ),
            1194000f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_STEAM,
                    TYPE_OF_MEASURE.Therms
            ),
            100f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_STEAM,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_STEAM,
                    TYPE_OF_MEASURE.kg
            ),
            2.632f),
            //District Hot Water
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_HOT_WATER,
                    TYPE_OF_MEASURE.kBtu
            ),
            1.0f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_HOT_WATER,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_HOT_WATER,
                    TYPE_OF_MEASURE.Therms
            ),
            100f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_HOT_WATER,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //District Chilled Water
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_CHILLED_WATER,
                    TYPE_OF_MEASURE.kBtu
            ),
            1.0f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_CHILLED_WATER,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_CHILLED_WATER,
                    TYPE_OF_MEASURE.Ton_Hours
            ),
            12f),
            Map.entry(new key(
                    TYPE_OF_METER.DISTRICT_CHILLED_WATER,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //Coal (anthracite)
            Map.entry(new key(
                    TYPE_OF_METER.COAL_ANTHRACITE,
                    TYPE_OF_MEASURE.kBtu
            ),
            1.0f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_ANTHRACITE,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_ANTHRACITE,
                    TYPE_OF_MEASURE.Tons
            ),
            25090f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_ANTHRACITE,
                    TYPE_OF_MEASURE.Lbs
            ),
            12.545f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_ANTHRACITE,
                    TYPE_OF_MEASURE.kLbs
            ),
            12545f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_ANTHRACITE,
                    TYPE_OF_MEASURE.MLbs
            ),
            12545000f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_ANTHRACITE,
                    TYPE_OF_MEASURE.Tonnes
            ),
            27658.355f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_ANTHRACITE,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //Coal (Bituminous)
            Map.entry(new key(
                    TYPE_OF_METER.COAL_BITUMINOUS,
                    TYPE_OF_MEASURE.kBtu
            ),
            1.0f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_BITUMINOUS,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_BITUMINOUS,
                    TYPE_OF_MEASURE.Tons
            ),
            24930f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_BITUMINOUS,
                    TYPE_OF_MEASURE.Lbs
            ),
            12.465f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_BITUMINOUS,
                    TYPE_OF_MEASURE.kLbs
            ),
            12465f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_BITUMINOUS,
                    TYPE_OF_MEASURE.MLbs
            ),
            12465000f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_BITUMINOUS,
                    TYPE_OF_MEASURE.Tonnes
            ),
            27482f),
            Map.entry(new key(
                    TYPE_OF_METER.COAL_BITUMINOUS,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //Coke
            Map.entry(new key(
                    TYPE_OF_METER.COKE,
                    TYPE_OF_MEASURE.kBtu
            ),
            1.0f),
            Map.entry(new key(
                    TYPE_OF_METER.COKE,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.COKE,
                    TYPE_OF_MEASURE.Tons
            ),
            24800f),
            Map.entry(new key(
                    TYPE_OF_METER.COKE,
                    TYPE_OF_MEASURE.Lbs
            ),
            12.4f),
            Map.entry(new key(
                    TYPE_OF_METER.COKE,
                    TYPE_OF_MEASURE.kLbs
            ),
            12400f),
            Map.entry(new key(
                    TYPE_OF_METER.COKE,
                    TYPE_OF_MEASURE.MLbs
            ),
            12400000f),
            Map.entry(new key(
                    TYPE_OF_METER.COKE,
                    TYPE_OF_MEASURE.Tonnes
            ),
            27339f),
            Map.entry(new key(
                    TYPE_OF_METER.COKE,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f),
            //Wood
            Map.entry(new key(
                    TYPE_OF_METER.WOOD,
                    TYPE_OF_MEASURE.kBtu
            ),
            1.0f),
            Map.entry(new key(
                    TYPE_OF_METER.WOOD,
                    TYPE_OF_MEASURE.MBtu
            ),
            1000f),
            Map.entry(new key(
                    TYPE_OF_METER.WOOD,
                    TYPE_OF_MEASURE.Tons
            ),
            17480f),
            Map.entry(new key(
                    TYPE_OF_METER.WOOD,
                    TYPE_OF_MEASURE.Tonnes
            ),
            15857f),
            Map.entry(new key(
                    TYPE_OF_METER.WOOD,
                    TYPE_OF_MEASURE.GJ
            ),
            947.817f)
    );






    //empty constructor
    public EnergyMeter(){}

    //Constructor from input (no meter ID)
    public EnergyMeter(TYPE_OF_METER meterSelected,
                       TYPE_OF_MEASURE unitOfMeasure,
                       boolean inUse,
                       boolean isDelivered,
                       float rawUse){
        setMeterSelected(meterSelected);
        setUnitOfMeasure(unitOfMeasure);
        setInUse(inUse);
        setDelivered(isDelivered);
        setRawUse(rawUse);
        calculateKBtu();
    }


    //Constructor with all elements
    public EnergyMeter(long ID,
                       long meterID,
                       TYPE_OF_METER meterSelected,
                       TYPE_OF_MEASURE unitOfMeasure,
                       boolean inUse,
                       boolean isDelivered,
                       float meterKBtu,
                       float rawUse) {

    }


    //Custom Methods

    protected void calculateKBtu(){
        float result = kBtuMultipliers.get(
                new key(meterSelected, unitOfMeasure)
        );
        setMeterKBtu(rawUse * result);
    }

    //TODO: update with queries to get sqrFootage
    public void calcEUI(){
        //Get square footage
        int sqrFootage = -1;
        //TODO: update this to the correct query
        //sqrFootage = db.select(this.associatedPropertyID).where("grossFloorArea")
        //Calc site EUI
        setSiteEUI((this.meterKBtu/sqrFootage));
        //Calc Source EUI
        switch(this.meterSelected){
            case TYPE_OF_METER.ELECTRIC_GRID:
                setSourceEUI(this.siteEUI * 2.8f);
                break;
            case TYPE_OF_METER.ELECTRIC_SOLAR:
            case TYPE_OF_METER.ELECTRIC_WIND:
            case TYPE_OF_METER.WOOD:
            case TYPE_OF_METER.COKE:
            case TYPE_OF_METER.COAL_ANTHRACITE:
            case TYPE_OF_METER.COAL_BITUMINOUS:
                setSourceEUI(this.siteEUI);
                break;
            case TYPE_OF_METER.NATURAL_GAS:
                setSourceEUI(this.siteEUI * 1.05f);
                break;
            case TYPE_OF_METER.FUEL_OIL_1:
            case TYPE_OF_METER.FUEL_OIL_2:
            case TYPE_OF_METER.FUEL_OIL_4:
            case TYPE_OF_METER.FUEL_OIL_5_AND_6:
            case TYPE_OF_METER.DIESEL:
            case TYPE_OF_METER.KEROSENE:
            case TYPE_OF_METER.PROPANE:
                setSourceEUI(this.siteEUI * 1.01f);
                break;
            case TYPE_OF_METER.DISTRICT_STEAM:
            case TYPE_OF_METER.DISTRICT_HOT_WATER:
                setSourceEUI(this.siteEUI * 1.2f);
                break;
            case TYPE_OF_METER.DISTRICT_CHILLED_WATER:
                setSourceEUI(this.siteEUI * 0.91f);
                break;
        }

    }

    //Getters and Setters

    public String getID() {
        return ID;
    }

    public void setID(String ID) {
        this.ID = ID;
    }

    public String getAssociatedReportID() {
        return associatedReportID;
    }

    public void setAssociatedReportID(String associatedReportID) {
        this.associatedReportID = associatedReportID;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getMeterID() {
        return meterID;
    }

    public void setMeterID(String meterID) {
        this.meterID = meterID;
    }

    public TYPE_OF_METER getMeterSelected() {
        return meterSelected;
    }

    public void setMeterSelected(TYPE_OF_METER meterSelected) {
        this.meterSelected = meterSelected;
    }

    public TYPE_OF_MEASURE getUnitOfMeasure() {
        return unitOfMeasure;
    }

    public void setUnitOfMeasure(TYPE_OF_MEASURE unitOfMeasure) {
        this.unitOfMeasure = unitOfMeasure;
    }

    public boolean isInUse() {
        return inUse;
    }

    public void setInUse(boolean inUse) {
        this.inUse = inUse;
    }

    public boolean isDelivered() {
        return isDelivered;
    }

    public void setDelivered(boolean delivered) {
        isDelivered = delivered;
    }

    public float getMeterKBtu() {
        return meterKBtu;
    }

    public void setMeterKBtu(float meterKBtu) {
        this.meterKBtu = meterKBtu;
    }

    public float getRawUse() {
        return rawUse;
    }

    public void setRawUse(float rawUse) {
        this.rawUse = rawUse;
    }

    public float getSiteEUI() {
        return siteEUI;
    }

    public void setSiteEUI(float siteEUI) {
        this.siteEUI = siteEUI;
    }

    public float getSourceEUI() {
        return sourceEUI;
    }

    public void setSourceEUI(float sourceEUI) {
        this.sourceEUI = sourceEUI;
    }
}
