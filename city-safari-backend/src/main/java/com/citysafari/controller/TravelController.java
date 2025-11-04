package com.citysafari.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.citysafari.dto.DestinationReport;
import com.citysafari.entity.SearchHistory;
import com.citysafari.entity.TravelReportCache;
import com.citysafari.entity.User;
import com.citysafari.repository.SearchHistoryRepository;
import com.citysafari.repository.TravelReportCacheRepository;
import com.citysafari.service.GeminiService;
import com.citysafari.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
// Enable CORS for your frontend origins, reading from application.properties
@CrossOrigin(origins = "${cors.allowed-origins}")
public class TravelController {

    private final GeminiService geminiService;
    private final SearchHistoryRepository searchHistoryRepository;
    private final TravelReportCacheRepository travelReportCacheRepository;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    public TravelController(GeminiService geminiService,
            SearchHistoryRepository searchHistoryRepository,
            TravelReportCacheRepository travelReportCacheRepository,
            UserService userService,
            ObjectMapper objectMapper) {
        this.geminiService = geminiService;
        this.searchHistoryRepository = searchHistoryRepository;
        this.travelReportCacheRepository = travelReportCacheRepository;
        this.userService = userService;
        this.objectMapper = objectMapper;
    }

    /**
     * The main endpoint your React app will call.
     * e.g., GET http://localhost:8080/api/report?city=Chennai&fromCity=Kakinada
     * Optional param: userId - if provided, the search history will be associated with that user.
     */
    @GetMapping("/report")
    public DestinationReport getTravelReport(
            @RequestParam String city,
            @RequestParam(required = false) String fromCity,
            @RequestParam(required = false) Long userId,
            HttpServletRequest request) {

        // First check cache for a valid report
        try {
            var cached = travelReportCacheRepository.findValidCacheByCityName(city, LocalDateTime.now());
            if (cached.isPresent()) {
                String reportJson = cached.get().getReportData();
                DestinationReport cachedReport = objectMapper.readValue(reportJson, DestinationReport.class);

                // Persist search history (user may be null) but skip regenerating the report
                try {
                    User user = null;
                    if (userId != null) {
                        user = userService.getUserById(userId);
                    }

                    String ipAddress = null;
                    if (request != null) {
                        ipAddress = request.getRemoteAddr();
                    }

                    SearchHistory history = new SearchHistory(user, city, ipAddress);
                    searchHistoryRepository.save(history);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                return cachedReport;
            }
        } catch (Exception e) {
            // If cache read/parse fails, continue to regenerate the report
            e.printStackTrace();
        }

        // Generate the travel report
        DestinationReport report = geminiService.generateTravelReport(city, fromCity);

        // Persist search history (user may be null)
        try {
            User user = null;
            if (userId != null) {
                user = userService.getUserById(userId);
            }

            String ipAddress = null;
            if (request != null) {
                ipAddress = request.getRemoteAddr();
            }

            SearchHistory history = new SearchHistory(user, city, ipAddress);
            searchHistoryRepository.save(history);
        } catch (Exception e) {
            // Fail gracefully: don't break the API if history saving fails
            e.printStackTrace();
        }

        // Persist/Cache the generated report as JSON
        try {
            String json = objectMapper.writeValueAsString(report);
            LocalDateTime expiresAt = LocalDateTime.now().plusHours(24);

            travelReportCacheRepository.findByCityName(city).ifPresentOrElse(existing -> {
                existing.setReportData(json);
                existing.setExpiresAt(expiresAt);
                travelReportCacheRepository.save(existing);
            }, () -> {
                TravelReportCache cache = new TravelReportCache(city, json, expiresAt);
                travelReportCacheRepository.save(cache);
            });
        } catch (Exception e) {
            // Fail gracefully: don't break the API if caching fails
            e.printStackTrace();
        }

        return report;
    }

    /**
     * Get search history for a user
     */
    @GetMapping("/history")
    public List<Map<String, Object>> getUserHistory(@RequestParam Long userId) {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            List<SearchHistory> list = searchHistoryRepository.findByUserIdOrderBySearchDateDesc(userId);
            for (SearchHistory s : list) {
                Map<String, Object> m = new HashMap<>();
                m.put("id", s.getId());
                m.put("city", s.getCityName());
                m.put("searchDate", s.getSearchDate());
                m.put("ipAddress", s.getIpAddress());
                result.add(m);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * Delete a single history item by id
     */
    @org.springframework.web.bind.annotation.DeleteMapping("/history/{id}")
    public Map<String, Object> deleteHistoryItem(@org.springframework.web.bind.annotation.PathVariable Long id) {
        Map<String, Object> resp = new HashMap<>();
        try {
            searchHistoryRepository.deleteById(id);
            resp.put("success", true);
        } catch (Exception e) {
            e.printStackTrace();
            resp.put("success", false);
            resp.put("message", e.getMessage());
        }
        return resp;
    }

    /**
     * Clear all history for a user
     */
    @org.springframework.web.bind.annotation.DeleteMapping("/history")
    public Map<String, Object> clearUserHistory(@RequestParam Long userId) {
        Map<String, Object> resp = new HashMap<>();
        try {
            List<SearchHistory> list = searchHistoryRepository.findByUserIdOrderBySearchDateDesc(userId);
            searchHistoryRepository.deleteAll(list);
            resp.put("success", true);
        } catch (Exception e) {
            e.printStackTrace();
            resp.put("success", false);
            resp.put("message", e.getMessage());
        }
        return resp;
    }
}
