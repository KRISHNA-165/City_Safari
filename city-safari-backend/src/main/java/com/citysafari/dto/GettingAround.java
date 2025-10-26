package com.citysafari.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GettingAround(
    String mode, 
    String name, 
    String route, 
    String status, 
    String schedule, 
    String price
) {}
