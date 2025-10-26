package com.citysafari.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Event(
    String name, 
    String category, 
    String description, 
    String location, 
    String date
) {}
