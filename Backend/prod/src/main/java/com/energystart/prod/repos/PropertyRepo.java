
package com.energystart.prod.repos;

import com.energystart.prod.model.Property;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PropertyRepo extends MongoRepository<Property, String> {

    List<Property> findByAuthorizedUserIdsContaining(String userId);
}
