package com.citysafari.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CurrentWeather(
    String temperature, 
    String condition, 
    String feelsLike, 
    String humidity, 
    String wind
) {}
