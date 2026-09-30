package com.energystart.prod.controller;

import com.energystart.prod.model.Property;
import com.energystart.prod.service.PropertiesService;
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
    public List<Property> getAllProperties(){
        return propertiesService.getAllProperties();
    }

    @GetMapping("/{id}")
    public Property getPropertiesById(@PathVariable String id){
        return propertiesService.getPropertiesById(id);
    }

    @PostMapping
    public String createProperties(@RequestBody Property properties){
        return propertiesService.createProperty(properties);
    }

    @PostMapping("/{id}")
    public String updateProperties(@PathVariable String id, @RequestBody Property properties){
        return propertiesService.updateProperty(id, properties);
    }

    @DeleteMapping("/{id}")
    public void deleteProperties(@PathVariable String id){
        propertiesService.deleteProperty(id);
    }
}
