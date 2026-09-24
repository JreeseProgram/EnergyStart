package com.energystart.prod.service;

import com.energystart.prod.model.Users;
// Here is where the repository import would go when connected to Mongo DB

import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {

    //Hard coding User data that can be used as an example.

    Users user1 = new Users("1","Username1","email1","Password","Role");
    Users user2 = new Users("2","Username2","email2","Password","Role");

    public List<Users> getAllUsers(){
        return List.of(user1,user2);
    }
    public Users getUserById(String id){
        return user1;
        //Will need to be changed when connected to the Mongo DB.
    }

    public String createUser(Users user){
        return user.toString();
        //Will need to be modified when the Mongo DB is created.
        //This is for the post method.
    }

    public String updateUser(String id,Users user){
        return "The id " + id + " has been updated successfully for " + user.toString();
        //Will need to be modified when the Mongo DB is created.
        //This is for the put? method
    }

    public void deleteUser(String id){
        //deleting the user
        System.out.println("Deleting User");
    }

}
