package com.citysafari.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Hotel(
    String name,
    double rating,
    String category,
    String description,
    String priceRange,
    String amenities,
    String location,
    String imageUrl
) {}
