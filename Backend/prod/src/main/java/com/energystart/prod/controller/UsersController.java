package com.energystart.prod.controller;

import com.energystart.prod.model.Users;
import com.energystart.prod.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserService userService;
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<Users> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Users getUsersById(@PathVariable String id){
        return userService.getUserById(id);
    }

    @PostMapping
    public String createUser(@RequestBody Users user){
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public String updateUser(@PathVariable String id, @RequestBody Users user){
       return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id){
        userService.deleteUser(id);
    }


}
