/**
 *Class Name: Properties
 * Purpose: To provide a template for the database that will hold the Properties.
 * when the Mongo DB is added this class will autoconfigure what needs to be added to the
 * mongo DB database.
 *
 * Notes / Questions (rolling):
 *
 *
 */

package com.energystart.prod.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Properties {

    @Id
    private String id;
    private String property_address;
    private String property_notes;


}
