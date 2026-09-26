package com.energystart.prod.model;

import com.energystart.prod.EnergyMeter.TYPE_OF_MEASURE;
import com.energystart.prod.EnergyMeter.TYPE_OF_METER;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

// One monthly usage reading for one building and one meter.
@Document(collection = "energy_readings")
public class EnergyReading {
    @Id private String id;
    private String buildingId;
    private String meterId;
    private LocalDate recordDate;
    private TYPE_OF_METER meterType;
    private TYPE_OF_MEASURE unit;
    private double amount;

    public EnergyReading() {}
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBuildingId() { return buildingId; }
    public void setBuildingId(String buildingId) { this.buildingId = buildingId; }
    public String getMeterId() { return meterId; }
    public void setMeterId(String meterId) { this.meterId = meterId; }
    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    public TYPE_OF_METER getMeterType() { return meterType; }
    public void setMeterType(TYPE_OF_METER meterType) { this.meterType = meterType; }
    public TYPE_OF_MEASURE getUnit() { return unit; }
    public void setUnit(TYPE_OF_MEASURE unit) { this.unit = unit; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
}
