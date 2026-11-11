package com.energystart.prod.energy;

import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.EnergyReportRepo;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("EnergyMeterReading")
public class EnergyMeterReading {

    @Id
    private String id;
    private String associatedMeterID;
    private String date; //YYYY-MM
    private float meterKBtu;
    private float rawUse;
    private float siteEUI;
    private float sourceEUI;

    //Constructors
    public EnergyMeterReading() {}

    /**
     *
     * @param repo used to calc KBtu and EUI
     * @param repo2 used to calc EUI
     * @param associatedMeterID used to link the reading to a meter
     * @param date timestamp for when this was made
     * @param rawUse total value of what is used
     */
    public EnergyMeterReading(EnergyMeterRepo repo, EnergyReportRepo repo2, String associatedMeterID, String date,
                              float rawUse) {
        this.setAssociatedMeterID(associatedMeterID);
        this.setDate(date);
        this.setRawUse(rawUse);
        this.calcKBtu(repo);
        this.calcEUI(repo2, repo);
    }
    /**
      * Constructor used for building w/o id
     */
    public EnergyMeterReading(EnergyMeterRepo repo, String associatedMeterID, String date, float meterKBtu,
                              float rawUse, float siteEUI, float sourceEUI) {
        this.setAssociatedMeterID(associatedMeterID);
        this.setDate(date);
        this.setMeterKBtu(meterKBtu);
        this.setRawUse(rawUse);
        this.setSiteEUI(siteEUI);
        this.setSourceEUI(sourceEUI);
        this.calcKBtu(repo);
    }

    /**
     * All-Args constructor
     */
    public EnergyMeterReading(EnergyMeterRepo repo, String id, String associatedMeterID, String date, float meterKBtu,
                              float rawUse, float siteEUI, float sourceEUI) {
        this.setId(id);
        this.setAssociatedMeterID(associatedMeterID);
        this.setDate(date);
        this.setMeterKBtu(meterKBtu);
        this.setRawUse(rawUse);
        this.setSiteEUI(siteEUI);
        this.setSourceEUI(sourceEUI);
        this.calcKBtu(repo);
    }

    public void calcKBtu(EnergyMeterRepo repo){
        EnergyMeter meter = repo.findByID(this.getAssociatedMeterID());
        this.setMeterKBtu(meter.calculateKBtu(this.getRawUse()));
    }

    //Custom Methods
    public void calcEUI(EnergyReportRepo repo, EnergyMeterRepo meterRepo){
        //Get square footage
        int sqrFootage = 0;
        EnergyMeter meter = meterRepo.findByID(this.getAssociatedMeterID());
        List<EnergyReport> reports = repo.findAllByRelatedPropertyID(meter.getAssociatedPropertyID());


        if (reports.isEmpty()){
            System.out.println("No associated Reports");
            return;
        }

        for(EnergyReport report : reports){
            sqrFootage += report.getGrossFloorArea();
        }

        //Calc site EUI
        setSiteEUI((this.meterKBtu/sqrFootage));
        //Calc Source EUI
        switch(meter.getMeterSelected()){
            case EnergyMeter.TYPE_OF_METER.ELECTRIC_GRID:
                setSourceEUI(this.siteEUI * 2.8f);
                break;
            case EnergyMeter.TYPE_OF_METER.ELECTRIC_SOLAR:
            case EnergyMeter.TYPE_OF_METER.ELECTRIC_WIND:
            case EnergyMeter.TYPE_OF_METER.WOOD:
            case EnergyMeter.TYPE_OF_METER.COKE:
            case EnergyMeter.TYPE_OF_METER.COAL_ANTHRACITE:
            case EnergyMeter.TYPE_OF_METER.COAL_BITUMINOUS:
                setSourceEUI(this.siteEUI);
                break;
            case EnergyMeter.TYPE_OF_METER.NATURAL_GAS:
                setSourceEUI(this.siteEUI * 1.05f);
                break;
            case EnergyMeter.TYPE_OF_METER.FUEL_OIL_1:
            case EnergyMeter.TYPE_OF_METER.FUEL_OIL_2:
            case EnergyMeter.TYPE_OF_METER.FUEL_OIL_4:
            case EnergyMeter.TYPE_OF_METER.FUEL_OIL_5_AND_6:
            case EnergyMeter.TYPE_OF_METER.DIESEL:
            case EnergyMeter.TYPE_OF_METER.KEROSENE:
            case EnergyMeter.TYPE_OF_METER.PROPANE:
                setSourceEUI(this.siteEUI * 1.01f);
                break;
            case EnergyMeter.TYPE_OF_METER.DISTRICT_STEAM:
            case EnergyMeter.TYPE_OF_METER.DISTRICT_HOT_WATER:
                setSourceEUI(this.siteEUI * 1.2f);
                break;
            case EnergyMeter.TYPE_OF_METER.DISTRICT_CHILLED_WATER:
                setSourceEUI(this.siteEUI * 0.91f);
                break;
        }

    }


    //Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAssociatedMeterID() {
        return associatedMeterID;
    }

    public void setAssociatedMeterID(String associatedMeterID) {
        this.associatedMeterID = associatedMeterID;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
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
