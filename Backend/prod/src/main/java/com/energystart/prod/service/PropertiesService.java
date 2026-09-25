package com.energystart.prod.service;

import com.energystart.prod.model.Properties;
// import where the repository would go.
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PropertiesService {

    Properties property1 = new Properties("Property ID1", "Address 1", "Properties notes 1");
    Properties property2 = new Properties("Property ID2", "Address 2", "Properties notes 2");

    public List<Properties> getAllProperties(){
        return List.of(property1,property2);
    }
    public Properties getPropertiesById(String id){
        return property1;
    }
    public String createProperty(Properties properties){
        return properties.toString();
    }

    public String updateProperty(String id, Properties properties){
        return "The id "+id+" Has been updated for "+properties.toString();
    }

    public void deleteProperty(String id){
        System.out.println("The id "+id+" has been deleted");
    }

}
