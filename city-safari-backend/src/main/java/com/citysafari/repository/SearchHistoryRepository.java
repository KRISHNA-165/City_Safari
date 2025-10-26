package com.citysafari.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.citysafari.entity.SearchHistory;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    
    /**
     * Find search history for a specific user, ordered by most recent first
     */
    List<SearchHistory> findByUserIdOrderBySearchDateDesc(Long userId);
    
    /**
     * Find top 10 most recent searches (for analytics)
     */
    List<SearchHistory> findTop10ByOrderBySearchDateDesc();
    
    /**
     * Find popular cities based on search frequency
     */
    @Query("SELECT s.cityName, COUNT(s) as searchCount FROM SearchHistory s " +
           "GROUP BY s.cityName ORDER BY searchCount DESC")
    List<Object[]> findPopularCities();
    
    /**
     * Find recent searches for a specific city
     */
    List<SearchHistory> findByCityNameOrderBySearchDateDesc(String cityName);
}
