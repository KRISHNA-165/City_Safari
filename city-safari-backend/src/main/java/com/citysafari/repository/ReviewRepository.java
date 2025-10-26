package com.citysafari.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.citysafari.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    /**
     * Find all reviews for a specific city
     */
    List<Review> findByCityName(String cityName);
    
    /**
     * Find all reviews by a specific user
     */
    List<Review> findByUserId(Long userId);
    
    /**
     * Get average rating for a city
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.cityName = :cityName")
    Double getAverageRatingForCity(@Param("cityName") String cityName);
    
    /**
     * Check if user has already reviewed a city
     */
    boolean existsByUserIdAndCityName(Long userId, String cityName);
    
    /**
     * Find top rated cities
     */
    @Query("SELECT r.cityName, AVG(r.rating) as avgRating, COUNT(r) as reviewCount " +
           "FROM Review r GROUP BY r.cityName " +
           "HAVING COUNT(r) >= :minReviews " +
           "ORDER BY avgRating DESC")
    List<Object[]> findTopRatedCities(@Param("minReviews") Long minReviews);
    
    /**
     * Find recent reviews for a city
     */
    List<Review> findByCityNameOrderByCreatedAtDesc(String cityName);
}
