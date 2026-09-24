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
 * (future change) the spring boot constructor doesn't need the id in the constructor.
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


    public Users(String id, String username, String email, String password_hash, String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
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

    public String getPassword_hash() {
        return password_hash;
    }

    public void setPassword_hash(String password_hash) {
        this.password_hash = password_hash;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
