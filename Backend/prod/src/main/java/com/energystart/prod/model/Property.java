package com.energystart.prod.model;

import com.energystart.prod.energy.EnergyMeter;
import com.energystart.prod.energy.EnergyReport;
import com.energystart.prod.energy.EnergyStarLookupTable;
import com.energystart.prod.energy.report_types.DataCenterReport;
import com.energystart.prod.repos.EnergyMeterRepo;
import com.energystart.prod.repos.EnergyReportRepo;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "properties")
public class Property {

    @Id
    private String id;

    private Integer humanReadablePropertyId;
    private String streetAddress;
    private String city;
    private String state;
    private Integer zipcode;
    private String notes;
    private int energyScore;
    private EnergyMeterRepo energyMeterRepo;
    private EnergyReportRepo energyReportRepo;

    // WorkOS user IDs allowed to access this property.
    private List<String> authorizedUserIds = new ArrayList<>();

    public Property() {
    }

    public Property(
            String id,
            Integer humanReadablePropertyId,
            String streetAddress,
            String city,
            String state,
            Integer zipcode,
            String notes) {
        this.id = id;
        this.humanReadablePropertyId = humanReadablePropertyId;
        this.streetAddress = streetAddress;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
        this.notes = notes;
    }
    //Custom methods
    public void calculateEnergyScore(LocalDate startDate, LocalDate endDate) {
        float energyScore = -1f;
        List<Float> individualKBtu = new ArrayList<>();
        List<Float> weights = new ArrayList<>();
        float totalSourceKBtu = 0.0f;
        float totalPredictedKBtu = 0.0f;
        int totalsqft = 0;
        Integer[] cddhdd = EnergyReport.retrieveCDDHDD(this.getZipcode(), startDate, endDate);

        //Access energy reports and get pertinent info
        List<EnergyReport> relevantEnergyReports = energyReportRepo.findAllByRelatedPropertyID
                (this.getId());
        for(EnergyReport report : relevantEnergyReports){
            float value = 0;
            totalsqft += report.getGrossFloorArea();
            if(!(report instanceof DataCenterReport)){
                value = report.energyStarRegressionCalc(cddhdd[0], cddhdd[1]);
                totalPredictedKBtu += value;
                individualKBtu.add(value);
            }
            else{ //only triggers for our outlier: Data Centers
                value = report.energyStarRegressionCalc(startDate, endDate);
                totalPredictedKBtu += value;
                individualKBtu.add(value);
            }
        }

        for (float value : individualKBtu) {
            weights.add(value/totalPredictedKBtu);
        }

        //access energy meters and extract pertinent info
        List<EnergyMeter> energyMeters = energyMeterRepo.findByAssociatedPropertyIDAndDateBetween
                (this.getId(), startDate, endDate);
        for (EnergyMeter energyMeter : energyMeters) {
            totalSourceKBtu += energyMeter.getSourceEUI() * totalsqft;
        }

        float EER = totalSourceKBtu / totalPredictedKBtu;
        this.setEnergyScore(EnergyStarLookupTable.getScore(EER, relevantEnergyReports, weights));
    }

    //Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getHumanReadablePropertyId() {
        return humanReadablePropertyId;
    }

    public void setHumanReadablePropertyId(Integer humanReadablePropertyId) {
        this.humanReadablePropertyId = humanReadablePropertyId;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Integer getZipcode() {
        return zipcode;
    }

    public void setZipcode(Integer zipcode) {
        this.zipcode = zipcode;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public float getEnergyScore() {
        return energyScore;
    }

    public void setEnergyScore(int energyScore) {
        this.energyScore = energyScore;
    }

    public List<String> getAuthorizedUserIds() {
        // Return a copy to protect the stored permissions.
        return authorizedUserIds == null
                ? new ArrayList<>()
                : new ArrayList<>(authorizedUserIds);
    }

    public void setAuthorizedUserIds(List<String> authorizedUserIds) {
        this.authorizedUserIds = authorizedUserIds == null
                ? new ArrayList<>()
                : new ArrayList<>(authorizedUserIds);
    }
}
