package com.energystart.prod.service;

import com.energystart.prod.model.Building;
//this is where the repository import will go when linked.
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class BuildingService {

    Building building1 = new Building("id","Propertyid1","Buildingid1","building size1","building 1 use type");
    Building building2 = new Building("id","Propertyid2","Buildingid2","building size2","building 2 use type");

    public List<Building> getAllBuildings(){
        return Arrays.asList(building1,building2);
    }

    public Building getBuildingById(String id){
        return building1;
    }

    public Building createBuilding(Building building){
        return building1;
    }

    public String updateBuilding(String id,Building building){
        return "The id " + id+ "is updating " + building.toString();
    }

    public String deleteBuilding(String id){
        return  "The id " + id+ "is deleting";
    }
}
