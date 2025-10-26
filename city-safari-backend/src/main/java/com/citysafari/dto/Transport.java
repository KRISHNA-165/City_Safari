package com.citysafari.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Transport(
    String mode,              // e.g., "Flight", "Train", "Bus", "Multi-modal"
    String operator,          // e.g., "IndiGo", "Indian Railways", "RedBus"
    String route,             // e.g., "Direct" or "Via Rajahmundry"
    String description,       // e.g., "Direct flight available" or "Take bus to Rajahmundry Airport, then flight to Chennai"
    String duration,          // e.g., "1h 30m", "6h 45m"
    String price,             // e.g., "₹3,500 - ₹8,000"
    String distance,          // e.g., "170 km", "425 km"
    String availability,      // e.g., "Multiple daily", "3 flights/day", "Every 30 mins"
    String recommendation     // e.g., "Best option", "Budget-friendly", "Most convenient"
) {}
