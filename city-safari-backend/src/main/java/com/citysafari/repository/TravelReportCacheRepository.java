package com.citysafari.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.citysafari.entity.TravelReportCache;

@Repository
public interface TravelReportCacheRepository extends JpaRepository<TravelReportCache, Long> {
    
    /**
     * Find cached report by city name
     */
    Optional<TravelReportCache> findByCityName(String cityName);
    
    /**
     * Delete cached report by city name
     */
    void deleteByCityName(String cityName);
    
    /**
     * Find all expired reports
     */
    @Query("SELECT t FROM TravelReportCache t WHERE t.expiresAt < :now")
    List<TravelReportCache> findExpiredReports(@Param("now") LocalDateTime now);
    
    /**
     * Check if cache exists for a city
     */
    boolean existsByCityName(String cityName);
    
    /**
     * Find valid (non-expired) cache for a city
     */
    @Query("SELECT t FROM TravelReportCache t WHERE t.cityName = :cityName AND t.expiresAt > :now")
    Optional<TravelReportCache> findValidCacheByCityName(@Param("cityName") String cityName, @Param("now") LocalDateTime now);
}
