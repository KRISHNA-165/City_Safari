package com.citysafari.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.citysafari.entity.SavedDestination;

@Repository
public interface SavedDestinationRepository extends JpaRepository<SavedDestination, Long> {
    
    /**
     * Find all saved destinations for a specific user
     */
    List<SavedDestination> findByUserId(Long userId);
    
    /**
     * Check if user has already saved a specific city
     */
    boolean existsByUserIdAndCityName(Long userId, String cityName);
    
    /**
     * Delete a specific saved destination for a user
     */
    void deleteByUserIdAndCityName(Long userId, String cityName);
    
    /**
     * Find all saved destinations for a specific city
     */
    List<SavedDestination> findByCityName(String cityName);
}
