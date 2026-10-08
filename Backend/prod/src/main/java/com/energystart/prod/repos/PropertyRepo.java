package com.energystart.prod.repos;

import com.energystart.prod.model.Property;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PropertyRepo extends MongoRepository<Property, String> {
}
