package com.citysafari.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record MustVisitPlace(
    String name, 
    double rating, 
    String description, 
    String bestTime, 
    String entry, 
    String imageUrl
) {}
