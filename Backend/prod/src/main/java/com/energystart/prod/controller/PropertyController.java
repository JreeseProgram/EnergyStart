package com.energystart.prod.controller;

import com.energystart.prod.model.Property;
import com.energystart.prod.service.PropertyService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }


    @GetMapping
    public List<Property> getAllProperties(){
        return propertyService.getAllProperties();
    }

    @GetMapping("/{id}")
    public Property getPropertiesById(@PathVariable String id){
        return propertyService.getPropertiesById(id);
    }

    @PostMapping
    public String createProperties(@RequestBody Property properties){
        return propertyService.createProperty(properties);
    }

    @PostMapping("/{id}")
    public String updateProperties(@PathVariable String id, @RequestBody Property properties){
        return propertyService.updateProperty(id, properties);
    }

    @DeleteMapping("/{id}")
    public void deleteProperties(@PathVariable String id){
        propertyService.deleteProperty(id);
    }
}
