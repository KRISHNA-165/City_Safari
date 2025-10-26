package com.citysafari.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.citysafari.dto.DestinationReport;
import com.citysafari.service.GeminiService;

@RestController
@RequestMapping("/api")
// Enable CORS for your frontend origins, reading from application.properties
@CrossOrigin(origins = "${cors.allowed-origins}")
public class TravelController {

    private final GeminiService geminiService;

    public TravelController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    /**
     * The main endpoint your React app will call.
     * e.g., GET http://localhost:8080/api/report?city=Chennai&fromCity=Kakinada
     */
    @GetMapping("/report")
    public DestinationReport getTravelReport(
            @RequestParam String city,
            @RequestParam(required = false) String fromCity) {
        // The service handles all the logic
        return geminiService.generateTravelReport(city, fromCity);
    }
}
