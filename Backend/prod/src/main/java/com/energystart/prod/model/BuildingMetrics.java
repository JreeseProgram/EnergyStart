/**
 *Class Name: BuildingMetrics
 * TEMPORARY Class Used to build the Prototype application.
 * Purpose: To provide a template for the database that will hold the BuildingMetrics.
 * when the Mongo DB is added this class will autoconfigure what needs to be added to the
 * mongo DB database.
 *
 * Notes / Questions (rolling):
 * (Notes) Building Metrics are stored separately from the Building so that multiple metrics can be stored for one building.
 *
 * (Notes) This is where the building metrics entry is stored for all the building.
 * (Questions) Are there any attributes that need to be changed.
 * (Notes) This class / table will probally change the most as we first find the calculation for some
 * of these values. The class is currently build to track multiple energy star scores per building.
 */

package com.energystart.prod.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class BuildingMetrics {

    @Id
    private String id;
    private String building_id;
    private String reporting_year;
    private String site_eui;
    private String source_eui;
    private String annual_ghg;
    private String energy_star_score;
    private String audit_compliance_status;

}
