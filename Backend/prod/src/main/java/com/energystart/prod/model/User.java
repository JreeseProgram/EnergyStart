/**
 *Class Name: Users
 * Purpose: To provide a template for the database that will hold the Users.
 * when the Mongo DB is added this class will autoconfigure what needs to be added to the
 * mongo DB database.
 *
 * The program will temporarly use a List to retrieve and add to the values for a prototype.
 *
 */
package com.energystart.prod.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String username;
    private String role;
    public List<Integer> propertyId;



    public User(String id, String username, String email, String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}
