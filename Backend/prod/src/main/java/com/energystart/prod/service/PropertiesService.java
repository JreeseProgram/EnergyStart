package com.energystart.prod.service;

import com.energystart.prod.model.Property;
// import where the repository would go.
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertiesService {

    Property property1 = new Property("Property ID1", "Address 1", "Properties notes 1");
    Property property2 = new Property("Property ID2", "Address 2", "Properties notes 2");

    public List<Property> getAllProperties(){
        return List.of(property1,property2);
    }
    public Property getPropertiesById(String id){
        return property1;
    }
    public String createProperty(Property properties){
        return properties.toString();
    }

    public String updateProperty(String id, Property properties){
        return "The id "+id+" Has been updated for "+properties.toString();
    }

    public void deleteProperty(String id){
        System.out.println("The id "+id+" has been deleted");
    }

}
