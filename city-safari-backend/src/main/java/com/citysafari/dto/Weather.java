package com.citysafari.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Weather(
    CurrentWeather current, 
    List<Forecast> forecast
) {}
