package com.energystart.prod.controller;

import com.energystart.prod.model.Properties;
import com.energystart.prod.service.PropertiesService;
import com.energystart.prod.service.UserService;
import org.apache.catalina.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties/")
public class PropertiesController {

    private final PropertiesService propertiesService;
    public PropertiesController(PropertiesService propertiesService) {
        this.propertiesService = propertiesService;
    }


    @GetMapping
    public List<Properties> getAllProperties(){
        return propertiesService.getAllProperties();
    }

    public Properties getPropertiesById(String id){
        return propertiesService.getPropertiesById(id);
    }

    @PostMapping
    public String createProperties(@RequestBody Properties properties){
        return propertiesService.createProperty(properties);
    }

    @PostMapping("/{id}")
    public String updateProperties(@PathVariable String id, @RequestBody Properties properties){
        return propertiesService.updateProperty(id, properties);
    }

    @DeleteMapping("/{id}")
    public void deleteProperties(@PathVariable String id){
        propertiesService.deleteProperty(id);
    }
}
