package com.citysafari.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.citysafari.dto.DestinationReport;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Mono;

@Service
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public GeminiService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public DestinationReport generateTravelReport(String city, String fromCity) {
        // Build the transport section prompt
        String transportPrompt;
        if (fromCity != null && !fromCity.trim().isEmpty()) {
            transportPrompt = "  \"transport\": [{\"mode\": \"Flight/Train/Bus/Multi-modal\", \"operator\": \"Operator name\", \"route\": \"Direct/Via city\", \"description\": \"Detailed route description\", \"duration\": \"Travel time\", \"price\": \"Price range\", \"distance\": \"Distance in km\", \"availability\": \"Frequency\", \"recommendation\": \"Why choose this\"}],\n";
        } else {
            transportPrompt = "  \"transport\": [],\n";
        }

        String cityContext = fromCity != null && !fromCity.trim().isEmpty() 
            ? "from " + fromCity + " to " + city 
            : city;

        String prompt = "You are a travel report API. Generate a detailed travel report for " + cityContext + " in JSON format.\n\n" +
                "Return ONLY valid JSON (no markdown, no explanation) with this EXACT structure:\n" +
                "{\n" +
                transportPrompt +
                "  \"gettingAround\": [{\"mode\": \"Metro\", \"name\": \"City Metro\", \"route\": \"Airport to Center\", \"status\": \"Available\", \"schedule\": \"6 AM - 11 PM\", \"price\": \"$2-5\"}],\n" +
                "  \"mustVisitPlaces\": [{\"name\": \"Tower\", \"rating\": 4.5, \"description\": \"Historic landmark\", \"bestTime\": \"Morning\", \"entry\": \"$10\", \"imageUrl\": \"https://images.unsplash.com/photo-1\"}],\n" +
                "  \"localFood\": [{\"restaurantName\": \"Fine Dining Restaurant\", \"category\": \"Luxury\", \"description\": \"Upscale restaurant with gourmet cuisine\", \"rating\": 4.5, \"priceRange\": \"$50-100\", \"hours\": \"6 PM - 11 PM\"}, {\"restaurantName\": \"Local Cafe\", \"category\": \"Budget Friendly\", \"description\": \"Popular local eatery\", \"rating\": 4.2, \"priceRange\": \"$5-15\", \"hours\": \"8 AM - 9 PM\"}],\n" +
                "  \"hotelStays\": [{\"name\": \"Grand Hotel\", \"rating\": 4.5, \"category\": \"Luxury\", \"description\": \"5-star hotel in city center\", \"priceRange\": \"$150-300\", \"amenities\": \"WiFi, Pool, Spa, Gym\", \"location\": \"City Center\", \"imageUrl\": \"https://images.unsplash.com/photo-1\"}, {\"name\": \"Budget Inn\", \"rating\": 4.0, \"category\": \"Budget Friendly\", \"description\": \"Affordable hotel near metro\", \"priceRange\": \"$30-60\", \"amenities\": \"WiFi, Breakfast\", \"location\": \"Near Station\", \"imageUrl\": \"https://images.unsplash.com/photo-2\"}],\n" +
                "  \"weather\": {\"current\": {\"temperature\": \"25°C\", \"condition\": \"Sunny\", \"feelsLike\": \"27°C\", \"humidity\": \"60%\", \"wind\": \"10 km/h\"}, \"forecast\": [{\"day\": \"Tomorrow\", \"condition\": \"Cloudy\", \"temperature\": \"23°C / 18°C\"}]},\n" +
                "  \"events\": [{\"name\": \"Festival\", \"category\": \"Cultural\", \"description\": \"Annual event\", \"location\": \"City Center\", \"date\": \"This weekend\"}],\n" +
                "  \"travelTips\": [{\"tip\": \"Carry water bottle\"}]\n" +
                "}\n\n";

        if (fromCity != null && !fromCity.trim().isEmpty()) {
            prompt += """
                    IMPORTANT for 'transport' section:
                    - Provide 3-4 different transport options (Flight, Train, Bus) from %s to %s.
                    - If direct flights are not available, suggest multi-modal routes (e.g., 'Take bus to nearest airport, then flight').
                    - Include realistic prices in local currency (₹ for India), duration, distance in km.
                    - For each option, provide: mode, operator name, route description, duration, price range, distance, availability/frequency, and recommendation.
                    - Example: If Kakinada to Chennai has no direct flight, suggest: 'Take bus/taxi to Rajahmundry Airport (30 km, 45 mins), then take IndiGo flight to Chennai (1h 15m)'.

                    """.formatted(fromCity, city);
        }

        prompt += "IMPORTANT for 'hotelStays' section:\n" +
                "- Provide 4-6 hotel options: at least 2-3 'Luxury' hotels and 2-3 'Budget Friendly' hotels.\n" +
                "- Each hotel MUST have a 'category' field set to either 'Luxury' or 'Budget Friendly'.\n" +
                "- Luxury hotels: 4-5 star properties, price range $100-300 or ₹5000-15000, amenities like Pool, Spa, Gym, Fine Dining.\n" +
                "- Budget Friendly hotels: 2-3 star properties, price range $20-60 or ₹1000-3000, basic amenities like WiFi, Breakfast.\n" +
                "- Include real hotel names from " + city + " if possible.\n\n";

        prompt += "IMPORTANT for 'localFood' section:\n" +
                "- Provide 4-6 restaurant options: at least 2-3 'Luxury' restaurants and 2-3 'Budget Friendly' restaurants.\n" +
                "- Each restaurant MUST have a 'category' field set to either 'Luxury' or 'Budget Friendly'.\n" +
                "- Luxury restaurants: Fine dining, gourmet cuisine, price range $40-100 or ₹2000-5000, upscale ambiance.\n" +
                "- Budget Friendly restaurants: Local eateries, street food, casual dining, price range $5-20 or ₹200-1000.\n" +
                "- Include real restaurant names from " + city + " if possible.\n\n";

        prompt += "Include 3-4 items for each array. Use real data about " + city + ".";

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            )
        );

        try {
            String jsonResponse = webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .body(Mono.just(requestBody), Map.class)
                .retrieve()
                .bodyToMono(String.class)
                .block(); 

            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            
            String reportJsonString = rootNode
                .path("candidates").path(0)
                .path("content")
                .path("parts").path(0)
                .path("text").asText();

            if (reportJsonString.isEmpty()) {
                throw new RuntimeException("Failed to extract report JSON from Gemini response. Full response: " + jsonResponse);
            }

            // Clean up markdown code blocks if present
            reportJsonString = reportJsonString.replaceAll("```json\\n?", "").replaceAll("```\\n?", "").trim();

            return objectMapper.readValue(reportJsonString, DestinationReport.class);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error calling Gemini API or parsing response: " + e.getMessage(), e);
        }
    }

    private Map<String, Object> buildResponseSchema() {
        // This schema definition tells Gemini exactly what JSON to build
        return Map.of(
            "type", "OBJECT",
            "properties", Map.of(
                "transport", Map.of(
                    "type", "ARRAY",
                    "items", Map.of(
                        "type", "OBJECT",
                        "properties", Map.of(
                            "mode", Map.of("type", "STRING", "description", "e.g., 'Flight', 'Train', 'Bus', 'Multi-modal'"),
                            "operator", Map.of("type", "STRING", "description", "e.g., 'IndiGo', 'Indian Railways', 'RedBus'"),
                            "route", Map.of("type", "STRING", "description", "e.g., 'Direct', 'Via Rajahmundry'"),
                            "description", Map.of("type", "STRING", "description", "Detailed route explanation, especially for multi-modal journeys"),
                            "duration", Map.of("type", "STRING", "description", "e.g., '1h 30m', '6h 45m'"),
                            "price", Map.of("type", "STRING", "description", "e.g., '₹3,500 - ₹8,000'"),
                            "distance", Map.of("type", "STRING", "description", "e.g., '170 km', '425 km'"),
                            "availability", Map.of("type", "STRING", "description", "e.g., '3 flights daily', 'Every 30 mins'"),
                            "recommendation", Map.of("type", "STRING", "description", "e.g., 'Fastest option', 'Budget-friendly'")
                        ),
                        "required", List.of("mode", "operator", "route", "description", "duration", "price", "distance", "availability", "recommendation")
                    )
                ),
                "gettingAround", Map.of(
                    "type", "ARRAY",
                    "items", Map.of(
                        "type", "OBJECT",
                        "properties", Map.of(
                            "mode", Map.of("type", "STRING", "description", "e.g., 'Metro', 'Bus', 'Rickshaw'"),
                            "name", Map.of("type", "STRING", "description", "e.g., 'Chennai Metro', 'MTC Bus'"),
                            "route", Map.of("type", "STRING", "description", "e.g., 'Airport to City Center'"),
                            "status", Map.of("type", "STRING", "description", "e.g., 'Available', 'Frequent'"),
                            "schedule", Map.of("type", "STRING", "description", "e.g., '6:00 AM - 10:00 PM'"),
                            "price", Map.of("type", "STRING", "description", "e.g., '₹20 - ₹50'")
                        ),
                        "required", List.of("mode", "name", "route", "status", "schedule", "price")
                    )
                ),
                "mustVisitPlaces", Map.of(
                    "type", "ARRAY",
                    "items", Map.of(
                        "type", "OBJECT",
                        "properties", Map.of(
                            "name", Map.of("type", "STRING"),
                            "rating", Map.of("type", "NUMBER", "description", "Rating out of 5, e.g., 4.5"),
                            "description", Map.of("type", "STRING"),
                            "bestTime", Map.of("type", "STRING", "description", "e.g., 'Morning', 'Evening'"),
                            "entry", Map.of("type", "STRING", "description", "e.g., 'Free', '₹100'"),
                            "imageUrl", Map.of("type", "STRING", "description", "A valid, hot-linkable URL to an image")
                        ),
                        "required", List.of("name", "rating", "description", "bestTime", "entry", "imageUrl")
                    )
                ),
                "localFood", Map.of(
                    "type", "ARRAY",
                    "items", Map.of(
                        "type", "OBJECT",
                        "properties", Map.of(
                            "restaurantName", Map.of("type", "STRING"),
                            "description", Map.of("type", "STRING", "description", "e.g., 'Famous for South Indian Thali'"),
                            "rating", Map.of("type", "NUMBER"),
                            "priceRange", Map.of("type", "STRING", "description", "e.g., '₹150 - ₹500'"),
                            "hours", Map.of("type", "STRING", "description", "e.g., '11:00 AM - 11:00 PM'")
                        ),
                        "required", List.of("restaurantName", "description", "rating", "priceRange", "hours")
                    )
                ),
                "weather", Map.of(
                    "type", "OBJECT",
                    "properties", Map.of(
                        "current", Map.of(
                            "type", "OBJECT",
                            "properties", Map.of(
                                "temperature", Map.of("type", "STRING", "description", "e.g., '32°C'"),
                                "condition", Map.of("type", "STRING", "description", "e.g., 'Sunny', 'Partly Cloudy'"),
                                "feelsLike", Map.of("type", "STRING", "description", "e.g., '35°C'"),
                                "humidity", Map.of("type", "STRING", "description", "e.g., '75%'"),
                                "wind", Map.of("type", "STRING", "description", "e.g., '15 km/h'")
                            ),
                            "required", List.of("temperature", "condition", "feelsLike", "humidity", "wind")
                        ),
                        "forecast", Map.of(
                            "type", "ARRAY",
                            "items", Map.of(
                                "type", "OBJECT",
                                "properties", Map.of(
                                    "day", Map.of("type", "STRING", "description", "e.g., 'Tomorrow', 'Friday'"),
                                    "condition", Map.of("type", "STRING", "description", "e.g., 'Light Rain'"),
                                    "temperature", Map.of("type", "STRING", "description", "e.g., '31°C / 26°C'")
                                ),
                                "required", List.of("day", "condition", "temperature")
                            ),
                            "minItems", 3,
                            "maxItems", 3
                        )
                    ),
                    "required", List.of("current", "forecast")
                ),
                "events", Map.of(
                    "type", "ARRAY",
                    "items", Map.of(
                        "type", "OBJECT",
                        "properties", Map.of(
                            "name", Map.of("type", "STRING"),
                            "category", Map.of("type", "STRING", "description", "e.g., 'Music', 'Food', 'Cultural'"),
                            "description", Map.of("type", "STRING"),
                            "location", Map.of("type", "STRING"),
                            "date", Map.of("type", "STRING", "description", "e.g., 'Oct 25th', 'This Weekend'")
                        ),
                        "required", List.of("name", "category", "description", "location", "date")
                    )
                ),
                "travelTips", Map.of(
                    "type", "ARRAY",
                    "items", Map.of(
                        "type", "OBJECT",
                        "properties", Map.of(
                            "tip", Map.of("type", "STRING")
                        ),
                        "required", List.of("tip")
                    )
                )
            ),
            "required", List.of("transport", "gettingAround", "mustVisitPlaces", "localFood", "weather", "events", "travelTips")
        );
    }
}
