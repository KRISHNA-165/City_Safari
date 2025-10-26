package com.citysafari.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.citysafari.entity.UserPreference;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
    
    /**
     * Find user preferences by user ID
     */
    Optional<UserPreference> findByUserId(Long userId);
    
    /**
     * Check if preferences exist for a user
     */
    boolean existsByUserId(Long userId);
}
