package com.energystart.prod.repos;

import com.energystart.prod.model.Property;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PropertyRepo extends MongoRepository<Property, String> {

    // Find a property only when the logged-in user has access.
    Optional<Property> findByIdAndAuthorizedUserIdsContaining(
            String propertyId, String userId);
}
