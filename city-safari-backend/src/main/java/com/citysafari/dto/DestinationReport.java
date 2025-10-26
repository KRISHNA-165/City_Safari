package com.citysafari.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DestinationReport(
    List<Transport> transport,
    List<GettingAround> gettingAround,
    List<MustVisitPlace> mustVisitPlaces,
    List<LocalFood> localFood,
    List<Hotel> hotelStays,
    Weather weather,
    List<Event> events,
    List<TravelTip> travelTips
) {}
