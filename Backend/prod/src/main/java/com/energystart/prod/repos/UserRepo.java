
package com.energystart.prod.repos;

import com.energystart.prod.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepo extends MongoRepository<User, String> {
}
