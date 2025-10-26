package com.citysafari.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Forecast(
    String day, 
    String condition, 
    String temperature
) {}
