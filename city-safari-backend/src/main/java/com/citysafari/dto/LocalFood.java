package com.citysafari.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record LocalFood(
    String restaurantName,
    String category,
    String description, 
    double rating, 
    String priceRange, 
    String hours
) {}
