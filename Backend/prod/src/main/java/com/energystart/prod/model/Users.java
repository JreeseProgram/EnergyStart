/**
 *Class Name: Users
 * Purpose: To provide a template for the database that will hold the Users.
 * when the Mongo DB is added this class will autoconfigure what needs to be added to the
 * mongo DB database.
 *
 * Notes / Questions (rolling):
 * Will we use just the email as the username or will we need both the username and an email address.
 * Do we want to add and arraylist to the users so that they can hve many propertys assigned to a user
 * > (look up) "In springboot can a @Document type have an arraylist that transfers to a  Mongo DB Database"
 *
 */
package com.energystart.prod.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "users")
public class Users {
    @Id
    private String id;
    private String username;
    private String email;
    private String password_hash;
    private String role;

}
